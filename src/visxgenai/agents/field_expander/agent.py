from typing import TYPE_CHECKING

import dspy
import polars as pl
from typing_extensions import TypedDict

from ...core import LMInitializer, ObservedModule, list_unique_values, run_module_async

if TYPE_CHECKING:
    from langfuse import Langfuse


def create_field_expander_inputs(
    df: pl.DataFrame,
    dataset_summary: str,
    fields_to_expand: dict[str, str],
) -> list[dspy.Example]:
    inputs: list[dspy.Example] = []
    for field_name, field_description in fields_to_expand.items():
        field_summary = f"{field_name}: {field_description}"
        cryptic_values = list_unique_values(df.get_column(field_name))
        input = dspy.Example(
            dataset_summary=dataset_summary,
            field_summary=field_summary,
            cryptic_values=cryptic_values,
        ).with_inputs(
            "dataset_summary",
            "field_summary",
            "cryptic_values",
        )
        inputs.append(input)

    return inputs


class FieldInfo(TypedDict):
    field: str
    is_cryptic_code: bool


class ExpandedField(TypedDict):
    field: str
    mapping: dict[str, str]


class FieldExpanderOutput(TypedDict):
    df: pl.DataFrame
    expansions: list[ExpandedField]


class FieldExpanderAgent(ObservedModule):
    def __init__(
        self,
        init_lm: LMInitializer,
        langfuse: "Langfuse",
    ):
        super().__init__(langfuse=langfuse)
        self.init_lm = init_lm
        self.expander = self.make_module_observed(dspy.Predict(FieldExpander))

    def _forward(
        self,
        *,
        df: pl.DataFrame,
        dataset_summary: str,
        dataset_fields: dict[str, str],
        field_info: list[FieldInfo],
        max_field_cardinality: int = 10,
    ) -> dspy.Prediction:
        from .utils import apply_field_expansions_to_df, list_expandable_fields

        expandable_fieldnames = list_expandable_fields(
            df=df,
            field_info=field_info,
            max_field_cardinality=max_field_cardinality,
        )
        fields_to_expand = {
            fieldname: dataset_fields[fieldname] for fieldname in expandable_fieldnames
        }
        field_expansions = self._generate_field_expansions(
            df=df,
            dataset_summary=dataset_summary,
            fields_to_expand=fields_to_expand,
        )
        expanded_df = apply_field_expansions_to_df(df, field_expansions)
        output: FieldExpanderOutput = {
            "df": expanded_df,
            "expansions": field_expansions,
        }
        return dspy.Prediction(**output)

    def _generate_field_expansions(
        self,
        *,
        df: pl.DataFrame,
        dataset_summary: str,
        fields_to_expand: dict[str, str],
    ) -> list[ExpandedField]:
        if len(fields_to_expand) == 0:
            return []

        inputs = create_field_expander_inputs(df, dataset_summary, fields_to_expand)
        with dspy.context(lm=self.init_lm()):
            results = run_module_async(self.expander, inputs)

        return [
            {
                "field": field,
                "mapping": result["mapping"],
                "__metadata__": result.get("__metadata__", {}),
            }
            for field, result in zip(fields_to_expand.keys(), results)
        ]


class FieldExpander(dspy.Signature):
    """Generate human-readable labels for categorical codes in a dataset field.
    Labels should be in the same language as the input dataset and field descriptions.

    **Dataset Identification Strategy (Priority 1):**
    - FIRST, search to identify if this is a commonly known dataset on the internet
    - Look for exact matches using dataset characteristics, field names, and unique identifiers
    - Search queries like: "[dataset_summary] dataset", "[field_names] public dataset", "[unique_characteristics] open data"
    - Common sources: Kaggle, UCI ML Repository, government data portals, research institutions, industry organizations
    - If dataset is identified, search for its official metadata/documentation page
    - Look for data dictionaries, codebooks, or field descriptions on the dataset's home page

    **Web Search Strategy (Priority 2):**
    - Search for domain-specific terminology using dataset context (e.g., "medical codes ICD-10", "country ISO codes", "industry classification NAICS")
    - Look up official documentation, standards, or codebooks related to the field
    - Search for the exact codes with field context (e.g., "[code] meaning [field_context]")
    - Use multiple search queries with different phrasings if initial searches are inconclusive
    - Prioritize authoritative sources (official documentation, government sites, standards organizations)

    **Search Query Examples:**
    - Dataset identification: "[dataset_domain] [unique_field_names] dataset site:kaggle.com OR site:archive.ics.uci.edu"
    - For location codes: "[code] country code ISO", "[code] state abbreviation", "[code] region code"
    - For classification codes: "[code] [domain] classification", "[code] category meaning [field_name]"
    - For industry/medical codes: "[code] [field_context] official definition", "[code] [domain] standard codes"

    **Rules:**
    1. **REQUIRED:** Create a 1:1 mapping from each code to a clear, human-readable label.
    2. **DATASET MATCHING FIRST:** Always first attempt to identify if this is a known public dataset with existing documentation.
    3. **METADATA SEARCH:** If dataset is identified, search for its official metadata, data dictionary, or documentation page.
    4. **WEB SEARCH FALLBACK:** Use general web searches for unfamiliar codes only if dataset identification fails.
    5. **AUTHORITATIVE SOURCES:** Prioritize official documentation, standards, and reputable sources over general web content.
    6. **CONSISTENCY:** Labels should be consistent with the dataset domain and field context.
    7. **CLARITY:** Prefer full words over abbreviations in the resolved labels.
    8. **CONTEXT-AWARE:** Use dataset and field context to disambiguate codes with multiple possible meanings.
    9. **VERIFICATION:** Cross-reference findings across multiple sources when possible.
    10. **FORMAT:** Output must be a valid JSON object with codes as keys and readable labels as values.
    """

    dataset_summary: str = dspy.InputField(
        desc="Brief summary describing the dataset's domain, purpose, and key characteristics. This context is crucial for web searches - use domain keywords (e.g., 'healthcare', 'geography', 'finance') to find relevant code standards and documentation."
    )
    field_summary: str = dspy.InputField(
        desc="Brief description of the field containing codes, explaining its semantic meaning and role. Use this field context in web searches to find specific code mappings, official standards, or domain-specific terminology guides."
    )
    cryptic_values: list[str] = dspy.InputField(
        desc="List of all unique categorical codes that need human-readable labels. Search for each code individually with field/dataset context to find authoritative definitions."
    )

    mapping: dict[str, str] = dspy.OutputField(
        desc="Dictionary mapping each code to its human-readable label. Keys are the original codes, values are the resolved readable labels."
    )

    dataset_url: str | None = dspy.OutputField(
        desc="Optional URL of the identified dataset's official page, metadata page, or documentation. Set this if web search successfully identifies this as a known public dataset (e.g., from Kaggle, UCI ML Repository, government portals). Return None if no specific dataset source is identified."
    )
