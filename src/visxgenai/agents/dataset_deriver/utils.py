import string
import uuid
from typing import Callable

import duckdb
import polars as pl
import sqlglot
from typing_extensions import TypedDict

from ...core import create_field_sample
from ..dataset_profiler.agent import DatasetProfile
from ..dataset_profiler.tools import DatasetProfileTools
from .agent import ViewProvenance


class QueryCheckResult(TypedDict, total=False):
    df: pl.DataFrame | None
    error: str | None


def get_random_tablename() -> str:
    suffix = uuid.uuid4().hex
    return f"table_{suffix}"


def render_sql_template(sql: str, *, tablename: str) -> str:
    return string.Template(sql).substitute(tablename=tablename)


def query_df(df: pl.DataFrame, sql: str) -> pl.DataFrame:
    """SQL must refer to df in FROM clause with $tablename template var"""
    conn = duckdb.connect()
    tablename = get_random_tablename()
    conn.register(tablename, df)
    sql_rendered = render_sql_template(sql, tablename=tablename)
    return conn.query(sql_rendered).pl()


def describe_query(df: pl.DataFrame, sql: str) -> pl.DataFrame:
    """SQL must refer to df in FROM clause with $tablename template var"""
    describe_sql = f"DESCRIBE ({sql})"
    return query_df(df, describe_sql)


def normalize_query(sql: str) -> str:
    # Substituting into SQL template before parsing, then reverting to template format
    tablename = get_random_tablename()
    sql_rendered = render_sql_template(sql, tablename=tablename)
    return (
        sqlglot.parse_one(sql_rendered, dialect="duckdb")
        .sql(dialect="duckdb", pretty=True)
        .replace(tablename, "$tablename")
    )


def construct_casted_query(df: pl.DataFrame, sql: str) -> str:
    castmap = {
        "HUGEINT": "INTEGER",
        "BIGINT": "INTEGER",
        "DECIMAL(10,2)": "FLOAT",
        "DECIMAL(10,3)": "FLOAT",
        "DECIMAL(10,4)": "FLOAT",
        "DECIMAL(10,5)": "FLOAT",
    }
    # Normalizing to remove ';' suffix, etc.
    original_selection = normalize_query(sql)
    casted_types = (
        describe_query(df, original_selection)
        .select(
            column_name="column_name",
            column_type_casted=pl.col("column_type").replace(
                old=list(castmap.keys()),
                new=list(castmap.values()),
            ),
        )
        .to_dicts()
    )
    field_projections: list[str] = []
    for item in casted_types:
        column_name = item["column_name"]
        column_type_casted = item["column_type_casted"]
        field_projection = f'"{column_name}"::{column_type_casted} AS "{column_name}"'
        field_projections.append(field_projection)

    projection = ",\n".join(field_projections)
    casted_query = f"SELECT {projection} FROM ({original_selection})"
    return normalize_query(casted_query)


def list_columns_with_cased_duplicates(df: pl.DataFrame) -> list[str]:
    flags_df = df.select(
        pl.col(pl.String).n_unique().name.suffix("_n_unique"),
        pl.col(pl.String)
        .str.to_lowercase()
        .str.strip_chars(" \n")
        .n_unique()
        .name.suffix("_n_unique_normal"),
    ).select(
        *[
            (pl.col(f"{col}_n_unique") != pl.col(f"{col}_n_unique_normal")).alias(col)
            for col in df.select(pl.col(pl.String)).columns
        ]
    )
    items = flags_df.to_dicts()
    if not items:
        return []

    return [col for col, flag in items[0].items() if flag]


def check_df(df: pl.DataFrame, provenance: ViewProvenance) -> QueryCheckResult:
    """Validate DataFrame against schema requirements and provenance metadata."""
    errors = []

    # Technical validation: Ensure scalar-only outputs
    for fieldname, dtype in df.schema.items():
        basetype = dtype.base_type()
        if basetype in (pl.Struct, pl.List):
            sample = create_field_sample(df, fieldname, n=2)
            errors.append(
                f"SCALAR_VIOLATION: Column '{fieldname}' has forbidden {basetype} type. "
                f"Use UNNEST for arrays or extract values from structs. "
                f"Sample: {sample}"
            )

    # Data quality validation: Check for normalization issues
    cased_duplicate_cols = list_columns_with_cased_duplicates(df)
    if cased_duplicate_cols:
        errors.append(
            f"NORMALIZATION_ERROR: Columns {cased_duplicate_cols} contain case/whitespace variants. "
            f"Apply TRIM(LOWER(column)) to ensure consistent grouping."
        )

    # Schema validation: Verify provenance matches actual output
    for field in provenance.fields:
        if field.name not in df.columns:
            errors.append(
                f"SCHEMA_MISMATCH: Provenance field '{field.name}' missing from output. "
                f"Available columns: {list(df.columns)}"
            )
            continue

        # Type validation: Ensure temporal semantics match DuckDB types
        col = df.get_column(field.name)
        if (
            field.semantic_type in {"Year", "Duration", "DateTime"}
            and not col.dtype.is_temporal()
        ):
            errors.append(
                f"TYPE_MISMATCH: Field '{field.name}' marked as {field.semantic_type} "
                f"but has non-temporal type {col.dtype}. "
                f"Cast to DATE/DATETIME/TIMESTAMP in SELECT clause."
            )

        # Naming validation: Enforce snake_case convention
        if field.name != field.name.lower():
            errors.append(
                f"NAMING_ERROR: Field '{field.name}' not lowercase. "
                f"Re-alias as '{field.name.lower()}' in SELECT clause."
            )

    # Check max row limit for downstream altair rendering
    max_height = 4_999
    if df.height > max_height:
        errors.append(
            f"ROW_LIMIT_EXCEEDED: DataFrame has {df.height} rows, "
            f"exceeding the maximum of {max_height}. "
            f"Consider aggregating or filtering data."
        )

    return {"error": "\n".join(errors) if errors else None}


def check_query(
    sql: str,
    df: pl.DataFrame,
    provenance: ViewProvenance,
    sample_size: int | None = None,
) -> QueryCheckResult:
    try:
        maybe_sampled_df = df.sample(sample_size) if sample_size else df
        df = query_df(df=maybe_sampled_df, sql=sql)
        return check_df(df, provenance)
    except Exception as e:
        return {"error": str(e)}


def construct_table_summary(
    df: pl.DataFrame,
    dataset_profile: DatasetProfile,
    dataset_title: str,
    dataset_description: str,
    field_descriptions: dict[str, str],
) -> str:
    dataset_profile_tools = DatasetProfileTools(dataset_profile, field_descriptions)
    primary_keys = set([f["name"] for f in dataset_profile_tools.list_primary_keys()])

    field_sections: list[str] = []
    for fieldname, description in field_descriptions.items():
        profile = dataset_profile["fields"][fieldname]
        dtype = profile["technical_type"]
        samples = ", ".join(
            map(
                str,
                create_field_sample(
                    df,
                    fieldname,
                    n=3,
                    max_chars=64,
                    list_n=2,
                ),
            )
        )
        section = f"**{fieldname}** [{dtype}]: {description} ({samples})"
        if fieldname in primary_keys:
            section = f"(PRIMARY KEY) {section}"

        field_sections.append(section)
    fields = "\n".join(field_sections)

    return "\n\n".join(
        [
            f"# Table: {dataset_title}",
            f"> {dataset_description}",
            fields,
        ]
    )


def sql_to_materializer_callback(
    source_df: pl.DataFrame,
    sql: str,
) -> Callable[[], tuple[pl.DataFrame, str]]:
    """Returns a callback that executes the SQL query on the source_df and returns the result as a DataFrame."""

    sql_with_casts = construct_casted_query(source_df, sql)

    def materialize() -> tuple[pl.DataFrame, str]:
        return query_df(source_df, sql_with_casts), sql_with_casts

    return materialize
