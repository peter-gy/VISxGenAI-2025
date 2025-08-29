from typing import Literal

from typing_extensions import TypedDict

from ..dataset_profiler.agent import DatasetProfile
from ..dataset_profiler.tools import DatasetField, DatasetProfileTools


def _fieldnames(fields: list[DatasetField]) -> list[str]:
    """Extract field names from a list of field dictionaries."""
    return [field["name"] for field in fields]


InsightTag = Literal[
    "trend",
    "comparison",
    "distribution",
    "correlation",
    "ranking",
    "segmentation",
    "exploration",
    "value-task",
    "summary-task",
    "non-negotiable",
]


class InsightHint(TypedDict):
    tags: list[InsightTag]
    hint: str
    fields: list[str] | list[tuple[str, str]]


class DatasetContext(TypedDict):
    title: str
    description: str
    shape: tuple[int, int]
    fields: list[DatasetField]
    hints: list[InsightHint]


def construct_dataset_context(
    dataset_title: str,
    dataset_description: str,
    field_descriptions: dict[str, str],
    dataset_profile: DatasetProfile,
) -> DatasetContext:
    tools = DatasetProfileTools(
        dataset_profile=dataset_profile,
        field_descriptions=field_descriptions,
    )

    # Gives insight planner agent general overview of the dataset
    all_fields = tools.list_all_fields()

    # Grounds correlation-related insight planning in actually correlated fields
    correlated_fields = tools.list_correlated_field_pairs()
    correlated_pairs: list[tuple[str, str]] = [
        (pair["a"]["name"], pair["b"]["name"]) for pair in correlated_fields
    ]

    # Guides picking fields ideal for segmenting / faceting
    evenly_distributed_numeric_fields = tools.list_high_diversity_fields(
        where={"profile_type": "numeric"}
    )

    # Hints at looking at list fields which are still low-cardinality after explosion -- may be great hidden insights
    low_cardinality_list_fields = tools.list_low_cardinality_fields(
        where=lambda profile: profile["profile_type"] == "list"
        and profile["base"]["diversity"] > 0.1,
    )

    # Guides picking fields ideal to be used for grouping / faceting / segmentation
    low_cardinality_categorical_fields = tools.list_low_cardinality_fields(
        where=lambda profile: profile["profile_type"] in {"nominal", "boolean"}
        and profile["base"]["diversity"] > 0.1,
    )

    # Hints to NOT use low-diversity categorical fields for segments
    low_diversity_categorical_fields = tools.list_low_diversity_fields(
        where=lambda profile: profile["profile_type"] in {"nominal", "boolean"}
    )

    # Guides picking interesting fields to surface insights, as users might have not even been aware of their existence
    high_cardinality_list_fields = tools.list_high_cardinality_fields(
        where={"profile_type": "list"}
    )

    # Guides picking temporal fields for trends and time-based insights
    temporal_fields = tools.list_all_fields(where={"profile_type": "temporal"})

    hints: list[InsightHint] = [
        {
            "tags": ["trend"],
            "hint": "Temporal fields, useful for exploring trends over time and to give overview of dataset's time horizon. Prefer combination with faceting / segmenting some numeric field's trend by low-cardinality categorical field(s). Never use temporal field with more than one numeric field in a single insight.",
            "fields": _fieldnames(temporal_fields),
        },
        {
            "tags": ["segmentation", "trend"],
            "hint": "Categorical fields with low cardinality and decent diversity, ideal to be used as dimensions for grouping / faceting / segmentation even in trend and time-based insights. Remember, to keep things diverse you can also derive new low-cardinality fields from numeric fields, e.g. by binning them into categories / tiers.",
            "fields": _fieldnames(low_cardinality_categorical_fields),
        },
        {
            "tags": ["exploration", "segmentation", "value-task"],
            "hint": "List fields with categorical contents with low cardinality and decent diversity, ideal to be used as dimensions for grouping / faceting / segmentation even in trend and time-based insights. Remember, to keep things diverse you can also derive new low-cardinality fields from numeric fields, e.g. by binning them into categories / tiers.",
            "fields": _fieldnames(low_cardinality_list_fields),
        },
        {
            "tags": ["non-negotiable", "segmentation", "trend"],
            "hint": "NEVER use these fields for insights as they have low diversity and can lead to uninformative or even worse, misleading insights.",
            "fields": _fieldnames(low_diversity_categorical_fields),
        },
        {
            "tags": ["segmentation", "distribution", "trend", "value-task"],
            "hint": "Numeric fields with even distribution, might be interesting to facet and segment these by low-cardinality evenly distributed categoricals or use them to derive new fields and concepts without producing underplotted visualizations. Never use more than one numeric field with temporal field in a single insight.",
            "fields": _fieldnames(evenly_distributed_numeric_fields),
        },
        {
            "tags": ["exploration", "ranking"],
            "hint": "List fields with high cardinality. These fields are best explored individually to uncover unique insights—do not analyze multiple high-cardinality fields together, as this will lead to overplotted and noisy results. When selecting one for analysis, always focus on an interesting top-5 (if temporal) or top-10 (if non-temporal) subset of items, chosen by a meaningful and insightful metric.",
            "fields": _fieldnames(high_cardinality_list_fields),
        },
        {
            "tags": ["correlation", "comparison"],
            "hint": "Correlated fields, useful for exploring relationships actually present in the data. WARNING: some correlations might be spurious or trivial, so pick wisely",
            "fields": correlated_pairs,
        },
    ]
    hints = [h for h in hints if len(h["fields"]) > 0]

    # Entire context to be passed to insight planner agent
    return {
        "title": dataset_title,
        "description": dataset_description,
        "shape": dataset_profile["shape"],
        "fields": all_fields,
        "hints": hints,
    }
