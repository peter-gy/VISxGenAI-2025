from typing import Callable, Iterable

import polars as pl
from typing_extensions import TypedDict

from ...core import SemanticSchema, SemanticType
from .agent import FieldRefinement


class SemanticTypedExpr(TypedDict):
    expr: pl.Expr
    type: SemanticType


FieldRefinementHandler = Callable[
    [pl.Series, FieldRefinement],
    Iterable[SemanticTypedExpr],
]


def _handle_separator(
    _: pl.Series, refinement: FieldRefinement
) -> list[SemanticTypedExpr]:
    if refinement["separator"] is None:
        return []

    fieldname = refinement["field"]
    separator = refinement["separator"]
    # Account for unsolicited comments in the output by splitting on whitespace and taking the actual separator
    sep = separator.split(" ")[0]
    list_expr = (
        pl.col(fieldname)
        .str.split(sep)
        .fill_null([])
        .list.eval(pl.element().str.strip_chars(" "))
        .list.filter(pl.element().str.len_chars() > 0)
    )

    # If category, then also normalize casing of the items
    if refinement["semantic_type"] == "Category":
        list_expr = list_expr.list.eval(pl.element().str.to_lowercase())

    # list_length_expr = list_expr.list.len().alias(f"{fieldname}_ItemCount")
    return [
        {"expr": list_expr, "type": refinement["semantic_type"]},
        # {"expr": list_length_expr, "type": "Count"},
    ]


def _handle_date_format(
    series: pl.Series, refinement: FieldRefinement
) -> list[SemanticTypedExpr]:
    if refinement["date_format"] is None or series.dtype.is_temporal():
        return []

    fieldname = refinement["field"]
    date_format = refinement["date_format"]
    # if any of these are present in `date_format` then we have a datetime
    datetime_template_chars = {"%H", "%M", "%S"}
    is_datetime = any((ch in date_format for ch in datetime_template_chars))
    if is_datetime:
        expr = pl.col(fieldname).cast(pl.String).str.to_datetime(date_format)
    else:
        expr = pl.col(fieldname).cast(pl.String).str.to_date(date_format)

    return [{"expr": expr, "type": refinement["semantic_type"]}]


def _handle_boolean(
    series: pl.Series, refinement: FieldRefinement
) -> list[SemanticTypedExpr]:
    if refinement["boolean_truthy_value"] is None or series.dtype == pl.Boolean:
        return []
    fieldname = refinement["field"]
    boolean_truthy_value = refinement["boolean_truthy_value"]
    expr = (
        pl.col(fieldname)
        .cast(pl.String)
        .eq(pl.lit(str(boolean_truthy_value)))
        .fill_null(False)
    )
    return [{"expr": expr, "type": refinement["semantic_type"]}]


def _handle_text(
    series: pl.Series, refinement: FieldRefinement
) -> list[SemanticTypedExpr]:
    if refinement["semantic_type"] != "Text" or refinement["separator"] is not None:
        return []
    fieldname = refinement["field"]
    expr = pl.col(fieldname).str.len_chars().alias(f"{fieldname}_CharCount")
    return [{"expr": expr, "type": "Count"}]


def apply_field_refinements_to_df(
    df: pl.DataFrame,
    refinements: list[FieldRefinement],
) -> tuple[pl.DataFrame, SemanticSchema]:
    refinement_handlers = [
        _handle_separator,
        _handle_date_format,
        _handle_boolean,
        # _handle_text,
    ]

    # General, unconditional refinement expressions to apply common normalizations
    strip_spaces_scalar = pl.col(pl.String).str.strip_chars(" ")
    strip_spaces_list = pl.col(pl.List(pl.String)).list.eval(
        pl.element().str.strip_chars(" ")
    )
    general_refinement_exprs: list[pl.Expr] = [
        strip_spaces_scalar,
        strip_spaces_list,
    ]
    refined_df = df.with_columns(*general_refinement_exprs)
    semantic_schema: SemanticSchema = {}

    for refinement in refinements:
        for handler in refinement_handlers:
            series = df.get_column(refinement["field"])
            refiner_expressions = handler(series, refinement)
            exprs = [
                expr_with_semantic_type["expr"]
                for expr_with_semantic_type in refiner_expressions
            ]
            subschema = {refinement["field"]: refinement["semantic_type"]} | {
                expr_with_semantic_type[
                    "expr"
                ].meta.output_name(): expr_with_semantic_type["type"]
                for expr_with_semantic_type in refiner_expressions
            }
            refined_df = refined_df.with_columns(*exprs)
            semantic_schema = semantic_schema | subschema  # type: ignore

    # Select columns to match the order of the semantic schema
    refined_df = refined_df.select(list(semantic_schema.keys()))

    return refined_df, semantic_schema  # type: ignore
