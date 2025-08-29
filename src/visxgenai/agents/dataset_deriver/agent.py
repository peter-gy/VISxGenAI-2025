from typing import TYPE_CHECKING, Callable, Literal, Optional, cast

import dspy
import polars as pl
import pydantic
from typing_extensions import TypedDict

if TYPE_CHECKING:
    from langfuse import Langfuse


from ...core import (
    LMInitializer,
    ObservedModule,
    SemanticType,
    extract_fenced_content,
    run_module_async,
)
from ..dataset_profiler.agent import DatasetProfile


class GeneratedQuery(TypedDict):
    num_shots: int
    sql: str
    error: str | None
    provenance: str


class QueryGenResult(TypedDict):
    success: bool
    goal: str
    query: GeneratedQuery


def create_sql_query_builder_inputs(
    df: pl.DataFrame,
    dataset_title: str,
    dataset_description: str,
    field_descriptions: dict[str, str],
    dataset_profile: DatasetProfile,
    nl_queries: list[str],
) -> list[dspy.Example]:
    from .utils import construct_table_summary

    table_summary = construct_table_summary(
        df=df,
        dataset_profile=dataset_profile,
        dataset_title=dataset_title,
        dataset_description=dataset_description,
        field_descriptions=field_descriptions,
    )

    examples: list[dspy.Example] = []
    for nl_query in nl_queries:
        example = dspy.Example(
            table_summary=table_summary,
            analytical_goal=nl_query,
            df=df,
        ).with_inputs(
            "table_summary",
            "analytical_goal",
            "df",
        )
        examples.append(example)

    return examples


class MaterializeableDataset(TypedDict):
    goal: str
    provenance: "ViewProvenance"
    materialize: Callable[[], tuple[pl.DataFrame, str]]


class DatasetDeriverAgent(ObservedModule):
    def __init__(
        self,
        init_drafter_lm: LMInitializer,
        init_repairer_lm: LMInitializer,
        langfuse: "Langfuse",
        max_retries: int = 3,
    ):
        super().__init__(langfuse=langfuse)
        self.builder = SQLQueryBuilderAgent(
            init_drafter_lm=init_drafter_lm,
            init_repairer_lm=init_repairer_lm,
            max_retries=max_retries,
            langfuse=langfuse,
        )

    def _forward(
        self,
        *,
        df: pl.DataFrame,
        dataset_title: str,
        dataset_description: str,
        field_descriptions: dict[str, str],
        dataset_profile: DatasetProfile,
        nl_queries: list[str],
    ) -> dspy.Prediction:
        from .utils import sql_to_materializer_callback

        inputs = create_sql_query_builder_inputs(
            df=df,
            dataset_title=dataset_title,
            dataset_description=dataset_description,
            field_descriptions=field_descriptions,
            dataset_profile=dataset_profile,
            nl_queries=nl_queries,
        )
        results = run_module_async(self.builder, inputs)

        queries = [
            {
                "success": result.get("error") is None,
                "goal": inputs[i]["analytical_goal"],
                "query": dict(result),
            }
            for i, result in enumerate(results)
            if result is not None
        ]

        datasets: list[MaterializeableDataset] = [
            {
                "goal": cast(str, query["goal"]),
                "provenance": cast(ViewProvenance, query["query"]["provenance"]),
                "materialize": sql_to_materializer_callback(
                    source_df=df,
                    sql=cast(str, query["query"]["sql"]),
                ),
                "__metadata__": query["query"].get("__metadata__", {}),
            }
            for query in queries
            if query["success"]
        ]

        return dspy.Prediction(
            datasets=datasets,
            queries=queries,
        )


class SQLQueryBuilderAgent(ObservedModule):
    """
    Module for generating and repairing DuckDB SQL queries.

    Orchestrates a multi-step process to produce a valid and
    visualization-ready SQL query. It starts by drafting an initial query based on
    the provided table summary and analytical goal. If the query fails execution,
    it enters a repair loop that attempts to fix the query based on the
    execution error. This process is repeated up to a specified number of retries.
    """

    def __init__(
        self,
        init_drafter_lm: LMInitializer,
        init_repairer_lm: LMInitializer,
        max_retries: int,
        langfuse: "Langfuse",
    ):
        super().__init__(langfuse=langfuse)
        self.max_retries = max_retries
        self.drafter = self.make_module_observed(dspy.Predict(SQLQueryDrafter))
        self.init_drafter_lm = init_drafter_lm
        self.repairer = self.make_module_observed(dspy.Predict(SQLQueryRepairer))
        self.init_repairer_lm = init_repairer_lm

    def _forward(
        self,
        *,
        table_summary: str,
        analytical_goal: str,
        df: pl.DataFrame,
    ) -> dspy.Prediction:
        from .utils import check_query

        # 1. Draft the initial query
        with dspy.context(
            lm=self.init_drafter_lm(),
        ):
            draft = self.drafter(
                table_summary=table_summary,
                analytical_goal=analytical_goal,
            )
            assert draft.sql is not None, "Drafted SQL query cannot be None"
            assert draft.provenance is not None, "Drafted provenance cannot be None"

        sql = extract_fenced_content(draft.sql, lang="sql")
        provenance = draft.provenance
        error = None

        # Loop for a total of 1 initial attempt + max_retries repair attempts
        for i in range(self.max_retries + 1):
            # 2. Check the query for errors
            check_result = check_query(sql, df, provenance)
            error = check_result.get("error")

            # 3. If the query is valid, return the successful result
            if error is None:
                return dspy.Prediction(
                    num_shots=i,
                    sql=sql,
                    error=None,
                    provenance=provenance,
                )

            # 4. If there are still retries left, attempt to repair the query
            if i < self.max_retries:
                with dspy.context(
                    lm=self.init_repairer_lm(),
                ):
                    repair = self.repairer(
                        table_summary=table_summary,
                        analytical_goal=analytical_goal,
                        failed_sql=sql,
                        execution_error=error,
                    )
                sql = extract_fenced_content(repair.fixed_sql, lang="sql")

                # If fields got re-aliased in the repair process, we update provenance details
                if repair.provenance is not None:
                    provenance = repair.provenance
            else:
                break

        # 5. If the loop completes, all attempts have failed.
        return dspy.Prediction(
            num_shots=self.max_retries,
            sql=sql,  # The last failing SQL query
            error=error,  # The last execution error
            provenance="Failed to generate a valid SQL query after multiple retries.",
        )


FieldRole = Literal["primary", "segment", "facet", "detail"]


class GeneratedField(pydantic.BaseModel):
    name: str = pydantic.Field(
        ...,
        description=" ".join(
            (
                "Final, aliased name of the field as appears in the SELECT clause.",
                "STRICT NAMING: ASCII-only snake_case using lowercase English letters, digits, and underscores ([a-z0-9_]+).",
                "No spaces, hyphens, diacritics, emoji, or non-ASCII symbols.",
            )
        ),
    )
    label: str = pydantic.Field(
        ...,
        description="\n".join(
            (
                "Human-friendly, whitespace separated label of this field, as it should appear in visualizations.",
                "Prefer a single-word label whenever possible; otherwise choose the shortest phrasing that remains clear and descriptive.",
                "AXIS READABILITY: Keep labels AS SHORT AS POSSIBLE (ideally 1–2 words) so they fit on axes and legends without truncation.",
                "Labels will be quoted verbatim in downstream report text, so they must read naturally and flow with surrounding prose.",
                "STRICT LABELING: Use only standard English ASCII characters (A–Z, a–z, 0–9 and spaces). No diacritics, emoji, or non-ASCII symbols. Keep punctuation to an absolute minimum—avoid unless essential for clarity.",
                "If the original field name is already meaningful and human-readable, use it as-is without modification.",
                "Respect proper noun casing: NEVER output personal names, organization names, place names, product names, or titles in lowercase.",
                "Preserve the original source casing in SELECT outputs; if normalization is necessary, use proper casing (e.g., DuckDB INITCAP()), and avoid altering known acronyms (e.g., 'NASA', 'USA').",
            )
        ),
    )
    description: str = pydantic.Field(
        ...,
        description="\n".join(
            (
                "FACTUAL and ACCOUNTABLE lineage description that provides complete derivation transparency.",
                "Must explicitly reference the original source field ID(s) from the dataset and describe the exact computational steps taken.",
                "For fields used without transformation, format as: 'Original field [original_field_name] used without modification'.",
                "For transformed/derived fields, format as: 'Derived from [original_field_name]: [exact computation/transformation performed]'.",
                "For aggregated fields, specify the aggregation function and grouping.",
                "For transformed fields, detail the transformation logic.",
                "Users must be able to trace back to the source data and understand exactly what they are looking at.",
                "Avoid vague terms - be precise about operations, filters, and calculations applied.",
            )
        ),
    )
    semantic_type: SemanticType = pydantic.Field(
        ...,
        description="Semantic type of the field",
    )
    role: FieldRole = pydantic.Field(
        ...,
        description="\n".join(
            (
                "Role of the field.",
                "'primary' if it should be encoded in a visualization explicitly as core attribute. There must be at most 2 'primary' fields in an output.",
                "'segment' if the field segments the data and could be displayed with layers.",
                "'facet' if the field should be used to create small multiples over.",
                "'detail' if it should be only shown on demand, such as human-readable IDs, unique IDs and additional categories and attributes which are not part of the insight explicitly but are related and can help interactive exploration. URLs linking to external resources, profiles, or documentation are excellent candidates for 'detail' fields as they enable interactive navigation while not cluttering the primary visualization.",
                "In cross-filter-enabled environments, consider including additional semantically related fields as 'detail' to enrich filtering, tooltips, and ad-hoc slicing—but ONLY for non-aggregated queries that return individual records.",
                "FOR NON-AGGREGATED QUERIES: Prioritize LOW-CARDINALITY categorical and TEMPORAL context fields (e.g., status, type, region, month, day_of_week) for 'detail' to maximize cross-filter effectiveness and keep UIs responsive.",
                "FOR AGGREGATED QUERIES: Do NOT add extra 'detail' fields beyond those explicitly requested or required for the aggregation, as they would break the GROUP BY logic and produce incorrect results.",
                "IMPORTANT: High-cardinality name-like fields (e.g., product names, customer names, item titles) MUST use 'detail' role since it's impossible to directly visualize thousands of unique string values. These fields are valuable for tooltips, cross-filtering, and interactive exploration but cannot serve as primary visualization dimensions.",
            )
        ),
    )


class ViewProvenance(pydantic.BaseModel):
    summary: str = pydantic.Field(
        ...,
        description="Brief, accessible summary of the generated view's purpose",
    )
    fields: list[GeneratedField] = pydantic.Field(
        ...,
        description="\n".join(
            (
                "Complete lineage documentation for ALL fields in the output dataset.",
                "Each field MUST have a detailed, factual description that explicitly references source field IDs and describes exact computational steps.",
                "For fields used as-is, clearly indicate no transformation was applied.",
                "This serves as accountable documentation so users can understand the provenance and trustworthiness of derived data.",
            )
        ),
    )


class SQLQueryDrafter(dspy.Signature):
    """
    DuckDB SQL Generator for visualization-ready queries. Produces clean, scalar output optimized for charts and dashboards.

    **CRITICAL RULES:**
    1. Output ONLY scalar columns (TEXT, INTEGER, DECIMAL, DATE, TIMESTAMP) - NEVER LIST/ARRAY/STRUCT.
    2. Maximum 5 columns for 'primary', 'segment', and 'facet' fields combined. 'Detail' fields (IDs, context) do not count toward this limit.
    3. NO explicit rank columns (e.g., RANK(), ROW_NUMBER()) - use ORDER BY + LIMIT for rankings.
    4. Transform booleans/codes into human-readable labels using CASE statements.
    5. Handle nulls/empty strings with COALESCE and NULLIF for clean data.
    6. Use snake_case for column aliases.
    7. **MANDATORY YEAR TO DATE CONVERSION**: When a field represents a Year (either named "Year", "year", or similar year-like fields), it MUST be converted to a DATE type using `MAKE_DATE("Year", 1, 1)`. This applies to any field that contains year values (e.g., 2020, 2021, etc.) regardless of its original data type. NEVER return year fields as integers or strings - always convert to proper DATE format using MAKE_DATE().
    8. Preserve temporal types: columns with `Date`, `DateTime`, `Timestamp` semantics must remain as DuckDB temporal types, never strings or numbers.
    8. Reduce field cardinality for visualization efficiency (e.g., bin continuous values, group rare categories).
    9. Prefer long format over wide format to simplify downstream visualization: pivot multiple measure columns into a single measure column with a categorical column for type. For example, instead of columns `avg_type_a`, `avg_type_b`, transform into `measure_value` (quantitative) and `measure_type` (categorical, e.g., 'Type A', 'Type B') using UNPIVOT or UNION ALL.
    10. Include unique identifier column whenever possible. When returning non-aggregated values and a PRIMARY KEY field is present in the source data, it MUST be included in the output. Additionally, include human-readable identifier columns (e.g., name, title, label fields) that provide meaningful context for data points.
    11. In addition to the unique ID, include a name-like or human-readable identifier column (e.g., item name, product title, or customer name) to encode as a tooltip for interactive visualizations. For example, when analyzing correlations between two quantitative variables, include a nominal column (e.g., item_name) to identify data points on hover in scatter plots or similar charts.
    12. Include additional categorical columns as 'detail' field role for NON-AGGREGATED queries, even if the analytical goal does not explicitly request them. Detail fields do not count toward the 5-column limit, so prioritize meaningful context columns for filtering, grouping, or conditional formatting (e.g., category, type, status, region fields). For AGGREGATED queries, only include 'detail' fields that are part of the GROUP BY clause or explicitly requested.
    13. Prefer to return as many data points as possible for insightful downstream vis, e.g. if goal is to identify distribution, the more data point there is for visualization, the better.
    14. **CRITICAL NULL HANDLING IN AGGREGATIONS**: When performing aggregations (AVG, MEAN, SUM, etc.), treat NULL values as missing data, NOT as zeros. Filter NULL values BEFORE aggregation to ensure semantic accuracy. Use WHERE clauses or FILTER expressions to exclude NULLs from calculations. For example: `AVG(column_name) FILTER (WHERE column_name IS NOT NULL)` or `WHERE column_name IS NOT NULL` in subqueries. This ensures aggregations reflect true data patterns rather than artificially inflated denominators or skewed results from implicit zero-substitution.
    15. **MAXIMIZE CONTEXT FOR CROSS-FILTERING** (NON-AGGREGATED QUERIES ONLY): For queries that return individual records without aggregation, include additional related fields as 'detail' role fields, even if not explicitly requested. Prioritize categorical dimensions (status, type, category, region, department, etc.), temporal fields (created_date, modified_date, etc.), and descriptive fields (description, notes, tags, etc.) that enhance interactive exploration in cross-filter-enabled environments. These fields enable rich filtering, tooltips, conditional formatting, and ad-hoc analysis. 'Detail' fields don't count toward the 5-column analytical limit, so be generous with contextual information. **CRITICAL**: For AGGREGATED queries (GROUP BY, aggregate functions), do NOT add extra 'detail' fields beyond those required for grouping, as this would break the aggregation logic and produce incorrect results.
    16. **RESPECT PROPER NOUN CASING**: NEVER output personal names, organization names, place names, product names, or titles in lowercase. Preserve original casing in SELECT outputs. Use LOWER() only for comparisons (e.g., in WHERE/ON), never for final projected columns. When normalization is required for outputs, use proper casing (e.g., INITCAP()) and avoid altering known acronyms.
    17. **STRICT ASCII ALIASES**: All SQL column aliases must be ASCII-only snake_case using only lowercase letters, digits, and underscores ([a-z0-9_]+). No spaces, hyphens, diacritics, emoji, or non-ASCII symbols.
    18. **STRICT ASCII LABELS**: Field labels used downstream must contain only standard English ASCII characters (letters, digits, spaces). No diacritics, emoji, or non-ASCII symbols; avoid punctuation unless essential.
    19. **ULTRA-SHORT FIELD LABELS**: Choose the SHORTEST possible human-readable labels (ideally 1–2 words) to ensure axis/legend readability and avoid truncation in downstream visualizations.
    20. **URL FIELD DERIVATION**: When there is a natural opportunity to derive a valid URL field from existing data (e.g., combining base URLs with paths, constructing API endpoints, building profile links from usernames, creating documentation links from identifiers), include it as a 'detail' field named 'url'. Only add URL fields when: (a) you are certain the constructed URL is valid and functional, (b) it would provide meaningful interactive value (e.g., linking to profiles, documentation, external resources), and (c) a 'url' field is not already present in the dataset. Skip URL derivation if uncertain about validity or if no clear opportunity exists. Examples: website_base + '/' + username → url, 'https://api.example.com/items/' + item_id → url, 'https://github.com/' + github_username → url.

    **DuckDB API Refresher**:
    - Computing list lengths: `SELECT len(my_list_column) AS list_length FROM my_table;`
    - Proper casing: `SELECT INITCAP(name_column) AS name_column FROM $tablename;` (use only when the source text is incorrectly cased; do not change known acronyms)
    """

    table_summary: str = dspy.InputField(
        desc="\n".join(
            (
                "Dataset description: include column names, data types, sample values. ",
                "Specify LIST/ARRAY columns requiring UNNEST, date formats, boolean/code columns needing human-readable labels, ",
                "and a name-like or human-readable identifier column suitable for tooltips in visualizations.",
            )
        )
    )
    analytical_goal: str = dspy.InputField(
        desc="\n".join(
            (
                "Analysis or visualization goal: specify desired dimensions (categorical/temporal), measures (quantitative), filters, ",
                "and a name-like identifier column for interactive tooltips (e.g., item name for scatter plot hover). ",
                "For rankings, use 'top N' to indicate ORDER BY + LIMIT, avoiding explicit rank functions.",
            )
        )
    )
    sql: str = dspy.OutputField(
        desc="\n".join(
            (
                "DuckDB SQL query wrapped in ```sql\n``` fences. MUST adhere to:",
                "- **Scalar outputs only** (TEXT, INTEGER, DECIMAL, DATE, TIMESTAMP); UNNEST arrays or extract from STRUCT if needed.",
                "- **MANDATORY YEAR TO DATE CONVERSION**: Any field representing a Year (named 'Year', 'year', or containing year values like 2020, 2021, etc.) MUST be converted to DATE type using `MAKE_DATE(\"Year\", 1, 1)`. Never return year fields as integers or strings.",
                "- **No rank columns**; use ORDER BY + LIMIT for implicit rankings.",
                "- Maximum 5 columns for analytical fields ('primary', 'segment', 'facet'), plus unlimited 'detail' fields (IDs, context).",
                "- **NULL handling in aggregations**: CRITICAL - treat NULLs as missing data, not zeros. Use FILTER clauses or WHERE conditions to exclude NULLs from aggregations: `AVG(col) FILTER (WHERE col IS NOT NULL)` or subquery filtering.",
                "- **Column ordering**: Use intuitive, natural ordering for table viewing - typically: (1) human-readable identifiers/names first, (2) PRIMARY KEY fields second, (3) primary analysis fields, (4) secondary dimensions, (5) measures/quantitative fields, (6) status/categorical fields. This creates a logical flow for end users scanning table data.",
                "- **PRIMARY KEY preservation**: When including PRIMARY KEY fields, always preserve the original field name exactly as-is (only convert to snake_case if needed), never add prefixes like 'id_' or suffixes like '_key'. For example, 'ProductID' becomes 'product_id', not 'id_product' or 'product_id_key'.",
                "- Transform booleans/codes with CASE, e.g., CASE WHEN is_active THEN 'Active' ELSE 'Inactive' END.",
                "- Clean strings: use TRIM(); use LOWER() only in comparisons (WHERE/ON), never in SELECT outputs.",
                "- **Respect proper noun casing**: NEVER output personal/organization/place/product names in lowercase. Preserve source casing in outputs; if normalization is needed, use proper casing (e.g., INITCAP()) while avoiding changes to known acronyms.",
                "- Handle nulls: COALESCE(NULLIF(TRIM(col), ''), 'Unknown') for strings, COALESCE(col, 0) for numbers.",
                "- Use $tablename as table placeholder.",
                "- Use snake_case ASCII aliases ([a-z0-9_]+ only). No spaces, hyphens, diacritics, emoji, or non-ASCII symbols.",
                "- Quote column names with spaces, e.g., 'Column Name'.",
                "- Include comments for complex logic or transformations.",
                "- For long format, use UNPIVOT or UNION ALL to transform multiple measures into a single measure column with a type column.",
                "- Include identifier and context columns as 'detail' fields (unlimited), balancing analytical value with interactive utility.",
                "- **URL FIELD DERIVATION**: When there is a natural opportunity to derive a valid URL field from existing data, include it as a 'detail' field with alias 'url'. Only derive URLs when: (a) you are certain the constructed URL is valid (e.g., combining base_url + path, 'https://api.domain.com/items/' + id, 'https://github.com/' + username), (b) it would provide meaningful interactive value for linking to external resources, profiles, or documentation, and (c) a 'url' field is not already present in the dataset. Use string concatenation or CONCAT() function. Skip if uncertain about URL validity or no clear opportunity exists.",
                "- **MAXIMIZE CONTEXT FOR CROSS-FILTERING** (NON-AGGREGATED QUERIES ONLY): For queries returning individual records (no GROUP BY/aggregation), include related contextual fields as 'detail' role, even if not explicitly requested: prioritize LOW-CARDINALITY categorical dimensions (status, type, category, region, department) and TEMPORAL fields (created_date, modified_date, month, day_of_week) from the original dataset. These enhance interactive exploration, cross-filtering, and tooltips without counting toward the 5-column analytical limit. **CRITICAL**: For AGGREGATED queries, do NOT add extra 'detail' fields beyond those required for grouping, as this breaks aggregation logic.",
                "- **ULTRA-SHORT LABELS**: Use the shortest possible human-readable labels (1–2 words preferred) for projected columns to optimize axis/legend readability.",
            )
        )
    )
    provenance: ViewProvenance = dspy.OutputField(
        desc="\n".join(
            (
                "COMPLETE provenance metadata documenting the lineage of every field in the generated view.",
                "For each field in the 'fields' list, the 'description' MUST be factually accurate and reference the exact source field ID(s) from the original dataset.",
                "For fields used without transformation, format as: 'Original field [source_field_id] used without modification'.",
                "For transformed/derived fields, format as: 'Derived from [source_field_id]: [exact_computation_performed]'.",
                "Examples: 'Original field customer_name used without modification', 'Derived from sales_amount: Sum aggregated by product_category',",
                "'Derived from customer_name: Direct selection with TRIM() applied', 'Derived from order_date: Extracted year component using EXTRACT(YEAR FROM order_date)'.",
                "This documentation ensures full accountability and traceability for derived data.",
            )
        ),
    )


class SQLQueryRepairer(dspy.Signature):
    """
    DuckDB Query Debugger. Fixes errors while maintaining visualization standards and analytical intent.

    **REPAIR PRIORITIES:**
    1. Fix the technical error
    2. Ensure scalar-only outputs (no LIST/ARRAY/STRUCT columns)
    3. Remove explicit rank columns if present
    4. **MANDATORY YEAR TO DATE CONVERSION**: Any field representing a Year must be converted to DATE type using `MAKE_DATE("Year", 1, 1)`. Never leave year fields as integers or strings.
    5. Maintain SHORT, readable labels (aim for 1–2 words) and proper null handling
    5. **CRITICAL**: Ensure NULL values in aggregations are treated as missing data, not zeros - use FILTER clauses or WHERE conditions to exclude NULLs
    6. **MAXIMIZE CONTEXT (cross-filtering, NON-AGGREGATED QUERIES ONLY)**: For queries returning individual records, include additional 'detail' fields where helpful, prioritizing LOW-CARDINALITY categorical and TEMPORAL context fields from the original dataset. For AGGREGATED queries, do NOT add extra 'detail' fields beyond those required for grouping
    7. **URL FIELD DERIVATION**: When repairing, consider deriving a valid URL field as a 'detail' field named 'url' if there's a natural opportunity and no existing 'url' field. Only add when certain about URL validity and meaningful interactive value. Examples: base_url + '/' + path, 'https://api.domain.com/items/' + id
    8. **RESPECT PROPER NOUN CASING**: Do not lowercase names (persons, organizations, places, products, titles) in outputs; preserve source casing or apply proper casing (e.g., INITCAP()) only when necessary and without altering known acronyms

    **DuckDB API Refresher**:
    - Computing list lengths: `SELECT len(my_list_column) AS list_length FROM my_table;`
    """

    table_summary: str = dspy.InputField(
        desc=(
            "Complete dataset schema with column names, types, and sample values. "
            "Critical for fixing type mismatches and identifying problematic LIST/STRUCT columns."
        ),
    )
    analytical_goal: str = dspy.InputField(
        desc="Original analysis objective. Ensure repair preserves this intent while meeting output standards."
    )
    failed_sql: str = dspy.InputField(
        desc="The complete SQL query that failed or violated standards (e.g., returned LIST column, used RANK())."
    )
    execution_error: str = dspy.InputField(
        desc="\n".join(
            (
                "Exact DuckDB error message. For standard violations, use: ",
                "'Compliance Error: Non-scalar column returned' or 'Compliance Error: Explicit rank column used'",
            )
        ),
    )
    fixed_sql: str = dspy.OutputField(
        desc="\n".join(
            (
                "Corrected DuckDB query in ```sql fences that fixes the error AND meets standards:",
                "- **Fix the error** while preserving analytical intent",
                "- **MANDATORY YEAR TO DATE CONVERSION**: Any field representing a Year (named 'Year', 'year', or containing year values) MUST be converted to DATE type using `MAKE_DATE(\"Year\", 1, 1)`. Never return year fields as integers or strings.",
                "- **ONLY scalar outputs** - if original selected LIST/STRUCT, convert to scalar (UNNEST + aggregate, extract values)",
                "- **Remove explicit ranks** - replace with ORDER BY + LIMIT",
                "- **NULL handling in aggregations**: CRITICAL - treat NULLs as missing data, not zeros. Use FILTER clauses or WHERE conditions to exclude NULLs from aggregations: `AVG(col) FILTER (WHERE col IS NOT NULL)` or subquery filtering.",
                "- Max 5 columns: 1-3 dimensions + 1-2 measures. Fields with 'detail' role do not count toward this limit.",
                "- **Column ordering**: Use intuitive, natural ordering for table viewing - typically: (1) human-readable identifiers/names first, (2) PRIMARY KEY fields second, (3) primary analysis fields, (4) secondary dimensions, (5) measures/quantitative fields, (6) status/categorical fields. This creates a logical flow for end users scanning table data.",
                "- **PRIMARY KEY preservation**: When including PRIMARY KEY fields, always preserve the original field name exactly as-is (only convert to snake_case if needed), never add prefixes like 'id_' or suffixes like '_key'. For example, 'ProductID' becomes 'product_id', not 'id_product' or 'product_id_key'.",
                "- Semantic labels: CASE statements for booleans/codes",
                "- Clean string handling: use TRIM(); use LOWER() only in comparisons (WHERE/ON), never in SELECT outputs.",
                "- **Respect proper noun casing**: NEVER output personal/organization/place/product names in lowercase. Preserve source casing in outputs or apply proper casing (e.g., INITCAP()) where necessary, without changing known acronyms.",
                "- Handle nulls: COALESCE(NULLIF(TRIM(col), ''), 'Unknown') for strings, COALESCE(col, 0) for numbers",
                "- Use $tablename placeholder",
                "- snake_case ASCII aliases ([a-z0-9_]+ only). No spaces, hyphens, diacritics, emoji, or non-ASCII symbols",
                "- Add comments explaining the fix and any transformations",
                "- **URL FIELD DERIVATION**: When repairing, consider adding a valid URL field as 'detail' role with alias 'url' if there's a natural opportunity from existing data (e.g., base_url + path, 'https://api.domain.com/items/' + id, 'https://github.com/' + username) and no existing 'url' field. Only derive when certain about URL validity and meaningful interactive value. Use string concatenation or CONCAT() function.",
                "- **MAXIMIZE CONTEXT FOR CROSS-FILTERING**: Whenever possible, include relevant contextual fields as 'detail' role: prioritize LOW-CARDINALITY categorical dimensions and TEMPORAL fields (e.g., month, day_of_week) from the original dataset that enhance interactive exploration without counting toward analytical column limits",
                "- **ULTRA-SHORT LABELS**: Prefer the shortest possible human-readable labels (1–2 words) for projected columns to optimize axis/legend readability",
            )
        ),
    )
    provenance: Optional[ViewProvenance] = dspy.OutputField(
        desc="\n".join(
            (
                "Updated provenance and field details, if the output table structure changed compared to the query which had to be fixed.",
                "When provided, ALL field descriptions MUST maintain the same factual, accountable lineage standards:",
                "explicitly reference source field IDs and describe exact computational steps.",
                "For fields used without transformation, format as: 'Original field [source_field_id] used without modification'.",
                "For transformed/derived fields, format as: 'Derived from [source_field_id]: [exact_computation_performed]'.",
                "Leave as None if the query got fixed without changing the output field names or their derivation logic.",
            )
        ),
    )
