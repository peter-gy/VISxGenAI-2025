from typing import TYPE_CHECKING, Optional

import dspy
import polars as pl
from typing_extensions import TypedDict

from ...core import (
    LMInitializer,
    ObservedModule,
    SemanticType,
    create_field_sample,
    run_module_async,
)

if TYPE_CHECKING:
    from langfuse import Langfuse


class FieldRefinement(TypedDict):
    field: str
    semantic_type: SemanticType
    separator: Optional[str]
    date_format: Optional[str]
    is_cryptic_code: Optional[bool]
    boolean_truthy_value: Optional[str | int | float]


def create_field_refiner_inputs(df: pl.DataFrame) -> list[dspy.Example]:
    def stringify_field_sample(values: list[str]) -> str:
        return "\n".join(map(str, values))

    return [
        dspy.Example(
            field_name=field_name,
            dtype=str(df[field_name].dtype),
            num_unique_values=df[field_name].n_unique(),
            sample_values=stringify_field_sample(create_field_sample(df, field_name)),
        ).with_inputs(
            "field_name",
            "dtype",
            "num_unique_values",
            "sample_values",
        )
        for field_name in df.columns
    ]


class RefinedDataFrame(TypedDict):
    df: pl.DataFrame
    refinements: list[FieldRefinement]
    semantic_schema: dict[str, SemanticType]


class FieldRefinerAgent(ObservedModule):
    def __init__(self, init_lm: LMInitializer, langfuse: "Langfuse"):
        super().__init__(langfuse=langfuse)
        self.init_lm = init_lm
        self.refiner = self.make_module_observed(dspy.Predict(FieldRefiner))

    def _forward(self, *, df: pl.DataFrame) -> dspy.Prediction:
        from .utils import apply_field_refinements_to_df

        field_refinements = self._generate_field_refinements(df)
        refined_df, semantic_schema = apply_field_refinements_to_df(
            df,
            field_refinements,
        )
        refined_dataframe_wrapper: RefinedDataFrame = {
            "df": refined_df,
            "refinements": field_refinements,
            "semantic_schema": semantic_schema,
        }

        return dspy.Prediction(**refined_dataframe_wrapper)

    def _generate_field_refinements(self, df: pl.DataFrame) -> list[FieldRefinement]:
        # Run predicition in batch for string columns
        examples = create_field_refiner_inputs(df)
        with dspy.context(lm=self.init_lm()):
            results = run_module_async(self.refiner, examples)

        return [
            {
                "field": example["field_name"],
                "semantic_type": result["semantic_type"],
                "separator": result.get("separator"),
                "date_format": result.get("date_format"),
                "is_cryptic_code": result.get("is_cryptic_code"),
                "boolean_truthy_value": result.get("boolean_truthy_value"),
                "__metadata__": result.get("__metadata__", {}),
            }
            for example, result in zip(examples, results)
        ]


class FieldRefiner(dspy.Signature):
    """Analyze field data to determine its semantic type and structural properties.

    **Semantic Type Definitions:**
    You must choose one of the following semantic types:
    - **Boolean**: Binary true/false values (e.g., 'true'/'false', 'yes'/'no', 1/0).
    - **Category**: Discrete unordered values like status, type, tags, or internal abbreviations (e.g., 'Active'/'Inactive', 'A'/'I').
    - **Ordinal**: Ordered discrete values with clear ranking (e.g., 'low'/'medium'/'high', 'S'/'M'/'L'/'XL', ratings 1-5).
    - **Numeric**: Continuous measurements, counts, or scores (e.g., weight, temperature, page views, ratings as numbers).
    - **Money**: Currency amounts, often with symbols or codes (e.g., '$100', '€50', '100 USD').
    - **Percentage**: Ratios and rates expressed as percentages (e.g., '25%', '0.25', conversion rates).
    - **DateTime**: Year, full date, and/or time values (e.g., '1987', '2023-10-26', '14:30:00', '2023-10-26 14:30:00').
    - **Duration**: Time spans and intervals (e.g., '2 hours', '30 days', 'P3M', age values).
    - **Identifier**: Unique or reference codes/IDs for entities (e.g., user_id, SKU, order_id). High cardinality is typical.
    - **Name**: Names of people, places, organizations, products, titles of documents or other entities (e.g., 'John Smith', 'New York', 'Apple Inc', 'The Great Gatsby').
    - **Text**: Free-form descriptive text (e.g., descriptions, comments, reviews, abstracts).
    - **Email**: Email addresses (e.g., 'user@example.com').
    - **URL**: Web addresses and links (e.g., 'https://example.com').
    - **Location**: Geographic data including addresses, coordinates, place names (e.g., 'New York, NY', '40.7128,-74.0060').
    - **Unknown**: Use this if the type cannot be determined or does not fit any other category.

    **Rules:**
    1. **Primary Goal:** Your main task is to choose the single best `semantic_type` from the definitions above.

    2. **Handling Separated Lists:** If `sample_values` contain separator-delimited strings (e.g., "item1,item2,item3"), your primary job is to determine the `semantic_type` of the **individual items**, not the whole string.
        - **Example 1:** For values like "Action;Adventure" or "RPG;Strategy", the `semantic_type` is `Category` and the `separator` is ';'.
        - **Example 2:** For values like "US,CA,MX", the `semantic_type` is `Identifier` (for country codes) and the `separator` is ','.
        - **Crucially, DO NOT classify a list of structured items as `Text`.** The `semantic_type` must reflect the items themselves.

    3. **Conditional Outputs:** Fill the fields below ONLY IF they apply. Otherwise, they MUST be `None`.
       - If you identified a list in Rule #2, you MUST provide the `separator`.
       - If `semantic_type` is `DateTime`, you MUST provide a `date_format` string.
       - If `semantic_type` is `Boolean`, you MUST provide the `boolean_truthy_value`.
       - If `semantic_type` is `Category`, you MUST set the boolean `is_cryptic_code`. Set it to `True` if the labels are non-obvious abbreviations (e.g., 'C1', 'C2') and `False` if they are human-readable words (e.g., 'Completed', 'Pending'). For all other semantic types, `is_cryptic_code` MUST be `None`.
    """

    field_name: str = dspy.InputField(
        desc="Name of data field (e.g., 'tags', 'created_at')."
    )
    dtype: str = dspy.InputField(desc="Raw field data type.")
    num_unique_values: int = dspy.InputField(desc="Number of unique values in field.")
    sample_values: str = dspy.InputField(
        desc="Few newline-separated sample values from field."
    )

    # --- Outputs ---
    semantic_type: SemanticType = dspy.OutputField(
        desc="""
        Single best semantic category for the field's content (or individual items in a list).
        Must be chosen from the provided semantic type definitions.
        """
    )

    separator: Optional[str] = dspy.OutputField(
        desc="""
        Character separating items in a list (e.g., ',', ';', '|').
        Return None if not a separator-delimited string.
        """
    )

    date_format: Optional[str] = dspy.OutputField(
        desc="""
        strftime-style format string for DateTime fields.
        Examples: '%Y-%m-%d', '%Y-%m-%dT%H:%M:%S', '%Y'
        Return None if field is not DateTime type.
        """
    )

    boolean_truthy_value: Optional[str] = dspy.OutputField(
        desc="""
        The value representing the 'true' or affirmative case.
        Example: 'active' from ['active', 'inactive'] or 'Y' from ['Y', 'N'].
        Fields with 2-3 unique values are strong candidates.
        Return None if not a boolean field.
        """
    )

    is_cryptic_code: Optional[bool] = dspy.OutputField(
        desc="""
        ONLY for 'Category' semantic type:
        - True: Labels are non-obvious abbreviations (e.g., 'M'/'F', 'C1'/'C2')
        - False: Labels are readable words (e.g., 'Male'/'Female', 'Active'/'Inactive')
        
        Note: Standard public codes (e.g., 'US', 'JFK') belong to 'Code' type, not 'Category'.
        MUST be None for all non-Category semantic types.
        """
    )
