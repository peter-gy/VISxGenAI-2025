import polars as pl

from ...core import SemanticSchema, create_field_sample


def create_dataset_overview(
    df: pl.DataFrame,
    semantic_schema: SemanticSchema,
) -> dict[str, dict]:
    return {
        fieldname: {
            "type": semantic_type,
            "sample": create_field_sample(df, fieldname),
        }
        for fieldname, semantic_type in semantic_schema.items()
    }
