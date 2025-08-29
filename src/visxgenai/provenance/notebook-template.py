"""
This is a Marimo notebook template requiring the following template variables as input:

- provenance_json_url: str
- goal: str
- vl_spec: str
"""

import marimo

__generated_with = "0.14.17.dev13"
app = marimo.App(width="columns")


@app.cell(column=0, hide_code=True)
def _(flowchart, mo):
    mo.md(
        rf"""
    # 5. Visualization

    {flowchart(selected=5)}

    The system picked the key fields from the [derived data](#dataset-derivation) and used [Draco](https://github.com/cmudig/draco2) to create this chart.
    """
    )
    return


@app.cell(hide_code=True)
def _(alt, derived_df, pl, vl_spec):
    chart = alt.Chart.from_json(vl_spec).properties(data=pl.from_arrow(derived_df))
    chart
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(
        r"""
    # From Source Data to Final Chart

    This notebook shows how coordinated AI agents turned input data into the visualization you see in the report. We'll walk through each step, starting with the final chart and working backwards to see how it was built. Start scrolling to the right or use the links below to jump to any section.

    - [1. Original Dataset](#1-original-dataset): The data we started with
    - [2. Dataset Refinement](#2-dataset-refinement): Clean-up and formatting improvements
    - [3. Field Remapping](#3-field-remapping): Making cryptic codes readable
    - [4. Dataset Derivation](#4-dataset-derivation): The [DuckDB](http://duckdb.org) query that filtered and shaped the data
    - [5. Visualization](#5-visualization): The chart created by [Draco](https://github.com/cmudig/draco2)
    """
    )
    return


@app.cell(column=1, hide_code=True)
def _(flowchart, mo):
    mo.md(rf"""
    # 4. Dataset Derivation

    {flowchart(selected=4)}
    """)
    return


@app.cell(hide_code=True)
def _(goal, mo, sql):
    mo.md(rf"""
    After the system analyzed the statistical profile of the dataset and its semantics, an AI agent concluded that it would be interesting to pursue the following analytical goal:

    > {goal}

    To satisfy this goal, the system wrote this SQL query:

    ```sql
    {sql}
    ```

    This query got executed against `remapped_df`, which was built by:

    1. Starting with the [original data](#original-dataset)
    2. Applying [data clean-up](#dataset-refinement)
    3. Making [cryptic codes readable](#field-remapping)
    """)
    return


@app.cell(hide_code=True)
def _(duckdb, remapped_df, sql):
    remapped_df  # This ensures that by the time Marimo's dataflow graph reaches this node, `remapped_df` is available
    derived_df = duckdb.query(sql).arrow()
    derived_df
    return (derived_df,)


@app.cell(hide_code=True)
def _(INPUTS, goal, string):
    sql = string.Template(INPUTS["goals"][goal]["sql"]).substitute(
        tablename="remapped_df"
    )
    return (sql,)


@app.cell(column=2, hide_code=True)
def _(flowchart, mo):
    mo.md(rf"""
    # 3. Field Remapping

    {flowchart(selected=3)}
    """)
    return


@app.cell(hide_code=True)
def _(expanded_fields, field_expansions, field_expansions_to_md, mo):
    mo.md(
        rf"""
    The system looked at sample values and decided that fields {", ".join([f"`{field}`" for field in expanded_fields])} needed to be made more readable.

    Here are the mappings that were applied to the [cleaned data](#dataset-refinement):

    {field_expansions_to_md(field_expansions)}

    This gave us a dataset where cryptic codes are replaced with clear, human-readable labels.
    """
    )
    return


@app.cell(hide_code=True)
def _(apply_field_expansions_to_df, field_expansions, refined_df):
    remapped_df = apply_field_expansions_to_df(refined_df, field_expansions)
    remapped_df
    return (remapped_df,)


@app.cell(hide_code=True)
def _(INPUTS):
    # Mappings generated for fields  where `is_cryptic_code` was set to True by an upstream agent refining fields
    field_expansions = INPUTS["field_expansions"]
    return (field_expansions,)


@app.cell(hide_code=True)
def _(TypedDict, pa, pl):
    class ExpandedField(TypedDict):
        field: str
        mapping: dict[str, str]

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

    def _apply_field_expansions_to_df(
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

    def apply_field_expansions_to_df(
        df: pa.Table,
        field_expansions: list[ExpandedField],
    ) -> pa.Table:
        df = _apply_field_expansions_to_df(pl.from_arrow(df), field_expansions)
        return pa.Table.from_pylist(df.to_dicts())

    return (apply_field_expansions_to_df,)


@app.cell(hide_code=True)
def _(field_expansions):
    expanded_fields = [item["field"] for item in field_expansions]

    def field_expansion_to_md(field: str, mapping: dict[str, str]) -> str:
        lines = [
            f"**{field}**",
            *[f"- {key}: {value}" for key, value in mapping.items()],
        ]

        return "\n\n".join(lines)

    def field_expansions_to_md(field_expansions: list):
        return "\n\n".join(
            [
                field_expansion_to_md(item["field"], item["mapping"])
                for item in field_expansions
            ]
        )

    return expanded_fields, field_expansions_to_md


@app.cell(column=3, hide_code=True)
def _(flowchart, mo):
    mo.md(
        rf"""
    # 2. Dataset Refinement

    {flowchart(selected=2)}

    The system looked at sample data from each field and made these improvements to fix formatting issues and match how the data should really be used.
    """
    )
    return


@app.cell(hide_code=True)
def _(field_refinements, pa, pd):
    pa.Table.from_pandas(pd.DataFrame(field_refinements).drop("__metadata__", axis=1))
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(
        r"""After applying these changes, we get the cleaned dataset below, which comes directly from the [original data](#original-dataset)."""
    )
    return


@app.cell(hide_code=True)
def _(apply_field_refinements_to_df, df, field_refinements):
    refined_df = apply_field_refinements_to_df(df, field_refinements)
    refined_df
    return (refined_df,)


@app.cell(hide_code=True)
def _(Callable, Iterable, Optional, TypedDict, pa, pl):
    SemanticType = str
    SemanticSchema = dict[str, SemanticType]

    class FieldRefinement(TypedDict):
        field: str
        semantic_type: str
        separator: Optional[str]
        date_format: Optional[str]
        is_cryptic_code: Optional[bool]
        boolean_truthy_value: Optional[str | int | float]

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
            # .list.filter(pl.element().str.len_chars() > 0)
        )

        # If category, then also normalize casing of the items
        if refinement["semantic_type"] == "Category":
            list_expr = list_expr.list.eval(pl.element().str.to_lowercase())

        return [
            {"expr": list_expr, "type": refinement["semantic_type"]},
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

    def _apply_field_refinements_to_df(
        df: pl.DataFrame,
        refinements: list[FieldRefinement],
    ) -> tuple[pl.DataFrame, SemanticSchema]:
        refinement_handlers = [
            _handle_separator,
            _handle_date_format,
            _handle_boolean,
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

    def apply_field_refinements_to_df(
        df: pa.Table,
        refinements: list[FieldRefinement],
    ) -> pa.Table:
        df, _ = _apply_field_refinements_to_df(pl.from_arrow(df), refinements)
        return pa.Table.from_pylist(df.to_dicts())

    return (apply_field_refinements_to_df,)


@app.cell(hide_code=True)
def _(INPUTS):
    # Refinements suggested by AI agent for each field to get a representation that better captures field semantics
    field_refinements = INPUTS["field_refinements"]
    return (field_refinements,)


@app.cell(column=4, hide_code=True)
def _(dataset_uri, flowchart, mo):
    mo.md(
        rf"""
    # 1. Original Dataset

    {flowchart(selected=1)}

    This is the raw data we started with, loaded from {dataset_uri}.
    """
    )
    return


@app.cell(hide_code=True)
def _(dataset_uri, read_dataset):
    df = read_dataset(dataset_uri)
    df
    return (df,)


@app.cell(hide_code=True)
def _(duckdb, pa, pd):
    def read_dataset(dataset_uri: str) -> pa.Table:
        # Using Pandas to read dataset so that we have no networking issues in Pyodide-based Marimo env
        if dataset_uri.endswith(".csv") or dataset_uri.endswith(".csv.gz"):
            pandas_df = pd.read_csv(dataset_uri)
        elif dataset_uri.endswith(".parquet"):
            pandas_df = pd.read_parquet(dataset_uri)
        elif dataset_uri.endswith(".json"):
            pandas_df = pd.read_json(dataset_uri)
        else:
            raise NotImplementedError(f"No support for reading {dataset_uri}")

        return duckdb.query("select * from pandas_df").arrow()

    return (read_dataset,)


@app.cell(hide_code=True)
def _(INPUTS):
    # Original, unprocessed dataset
    dataset_uri = INPUTS["dataset_uri"]
    return (dataset_uri,)


@app.cell(hide_code=True)
def _(httpx):
    # These are the only inputs of the notebook template, all other cells are functions of these

    provenance_json_url = "$provenance_json_url"
    goal = "$goal"
    vl_spec = """$vl_spec"""

    INPUTS = httpx.get(provenance_json_url).json()
    return INPUTS, goal, vl_spec


@app.cell(hide_code=True)
def _(mo):
    def flowchart(selected: int):
        nodes = ["A", "B", "C", "D", "E"]
        selected_node = nodes[selected - 1]
        return mo.mermaid(rf"""
    flowchart RL
        %% Define Nodes
        A(1\. Original Dataset)
        B[2\. Dataset Refinement]
        C[3\. Field Remapping]
        D[4\. Dataset Derivation]
        E([5\. Visualization])

        %% Define Connections
        A -->|Clean & Format| B
        B -->|Make Codes Readable| C
        C -->|Filter & Shape Data using DuckDB| D
        D -->|Generate Chart Spec using Draco| E

        %% Define clickable links for each node
        click A "#1-original-dataset" "Go to Original Dataset section"
        click B "#2-dataset-refinement" "Go to Dataset Refinement section"
        click C "#3-field-remapping" "Go to Field Remapping section"
        click D "#4-dataset-derivation" "Go to Dataset Derivation section"
        click E "#5-visualization" "Go to Visualization section"

        %% Style the selected node
        classDef selected fill:#cde4ff,stroke:#5a96d8,stroke-width:3px
        class {selected_node} selected
    """)

    return (flowchart,)


@app.cell(hide_code=True)
def _():
    import string
    from typing import Callable, Iterable, Optional

    import altair as alt
    import duckdb
    import httpx
    import marimo as mo
    import pandas as pd
    import polars as pl
    import pyarrow as pa
    from typing_extensions import TypedDict

    return (
        Callable,
        Iterable,
        Optional,
        TypedDict,
        alt,
        duckdb,
        httpx,
        mo,
        pa,
        pd,
        pl,
        string,
    )


if __name__ == "__main__":
    app.run()
