from typing import TYPE_CHECKING, Any

import dspy
import orjson
import polars as pl
from typing_extensions import TypedDict

from ...core import LMInitializer, ObservedModule, SemanticSchema
from .utils import create_dataset_overview

if TYPE_CHECKING:
    from langfuse import Langfuse


class DatasetDescription(TypedDict):
    title: str
    summary: str
    fields: dict[str, str]


class DatasetDescriberAgent(ObservedModule):
    def __init__(
        self,
        init_lm: LMInitializer,
        langfuse: "Langfuse",
    ):
        super().__init__(langfuse=langfuse)
        self.init_lm = init_lm
        self.describer = self.make_module_observed(dspy.Predict(DatasetDescriber))

    def _forward(
        self,
        *,
        df: pl.DataFrame,
        semantic_schema: SemanticSchema,
    ) -> dspy.Prediction:
        dataset_overview = create_dataset_overview(df, semantic_schema)
        dataset_overview_str = orjson.dumps(dataset_overview).decode("utf-8")
        with dspy.context(lm=self.init_lm()):
            prediction = self.describer(dataset_overview=dataset_overview_str)

        prediction_dict: dict[str, Any] = dict(prediction)  # type: ignore
        dataset_description: DatasetDescription = {
            "title": prediction_dict["dataset_title"],
            "summary": prediction_dict["dataset_summary"],
            "fields": prediction_dict["field_descriptions"],
        }
        metadata = prediction_dict.get("metadata", {})
        return dspy.Prediction(**dataset_description, **metadata)


class DatasetDescriber(dspy.Signature):
    """Generate crisp, semantic descriptions for dataset fields and overall dataset summary, focusing purely on conceptual understanding without any concrete data references.

    **Rules:**
    1. Dataset title must be conceptual and domain-focused, never referencing specific data points, values, or examples.
    2. Field descriptions must capture semantic purpose and analytical meaning in abstract terms only.
    3. Dataset summary must describe the conceptual domain, analytical purpose, and semantic structure without any concrete references.
    4. Focus on data semantics, relationships, and analytical utility rather than specific content.
    5. Use abstract domain terminology that describes data types, patterns, and purposes.
    6. STRICTLY FORBIDDEN: Any concrete values, sample data, specific names, dates, numbers, or literal examples from the dataset.
    7. STRICTLY FORBIDDEN: Phrases like 'e.g.', 'such as', 'for example', 'including', or any specific instances.
    8. Descriptions must be purely conceptual and semantic, describing what kinds of information the fields represent, not what they contain.
    """

    dataset_overview: str = dspy.InputField(
        desc="JSON representation of dataset overview containing field types and metadata"
    )

    dataset_title: str = dspy.OutputField(
        desc="Concise title reflecting the dataset's domain and scope"
    )
    dataset_summary: str = dspy.OutputField(
        desc="Brief 1-2 sentence summary of the dataset's domain, purpose, and key analytical dimensions"
    )
    field_descriptions: dict[str, str] = dspy.OutputField(
        desc="JSON object mapping field names to one-sentence semantic descriptions of their meaning and analytical value, strictly excluding any sample values or literal data"
    )
