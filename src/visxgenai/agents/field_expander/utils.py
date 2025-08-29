import polars as pl

from .agent import ExpandedField, FieldInfo


def list_expandable_fields(
    df: pl.DataFrame,
    field_info: list[FieldInfo],
    max_field_cardinality: int,
) -> list[str]:
    fieldnames: list[str] = []
    for info in field_info:
        assert "field" in info, "Field name must be specified in refinement"
        fieldname = info["field"]
        is_cryptic = info["is_cryptic_code"] is True
        is_low_cardinality = df[fieldname].n_unique() <= max_field_cardinality
        if is_cryptic and is_low_cardinality:
            fieldnames.append(fieldname)

    return fieldnames


def remap_list_values(
    field: pl.Series,
    mapping: dict[str, str],
) -> pl.Series:
    fieldname = field.name
    return (
        field.to_frame()
        .with_row_index()
        .explode(fieldname)
        .with_columns(
            pl.col(fieldname).replace(
                old=list(mapping.keys()),
                new=list(mapping.values()),
            )
        )
        .group_by("index")
        .agg(fieldname)
        .select(pl.col(fieldname).list.drop_nulls())[fieldname]
    )


def remap_scalar_values(
    field: pl.Series,
    mapping: dict[str, str],
) -> pl.Series:
    return field.replace(
        old=list(mapping.keys()),
        new=list(mapping.values()),
    )


def apply_field_expansions_to_df(
    df: pl.DataFrame,
    field_expansions: list[ExpandedField],
) -> pl.DataFrame:
    final_df = df
    for expansion in field_expansions:
        fieldname = expansion["field"]
        mapping = expansion["mapping"]
        field = df[fieldname]
        if field.dtype.base_type() is pl.List:
            remapped_field = remap_list_values(field, mapping)
        else:
            remapped_field = remap_scalar_values(field, mapping)

        final_df = final_df.with_columns(remapped_field)

    return final_df
