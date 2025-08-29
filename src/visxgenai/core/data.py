from typing import Callable

import duckdb
import polars as pl


def read_dataset(uri: str) -> pl.DataFrame:
    dataset_format = uri.split(".")[-1]
    if dataset_format == "csv" or uri.endswith(".csv.gz"):
        return pl.read_csv(uri, try_parse_dates=True, infer_schema_length=None)
    elif dataset_format == "parquet":
        return pl.read_parquet(uri)
    elif dataset_format == "json":
        return duckdb.query(f"select * from read_json('{uri}')").pl()
    else:
        raise ValueError(f"Unsupported dataset format: {dataset_format}")


def create_field_sample(
    df: pl.DataFrame,
    field: str,
    n: int = 6,
    max_chars: int = 100,
    list_n: int = 3,
) -> list:
    dtype = df.get_column(field).dtype
    sort_by_scalar = pl.col(field).cast(pl.String).str.len_chars()
    sort_by_list = (
        pl.col(field).list.eval(pl.element().cast(pl.String).str.len_chars()).list.sum()
    )
    sort_by = sort_by_list if dtype == pl.List else sort_by_scalar

    sorted_df = df.select(field).drop_nulls().unique().sort(sort_by, descending=True)
    head = sorted_df.head(n // 2)
    tail = sorted_df.tail(n // 2)

    truncate_scalar = pl.col(pl.String).str.slice(0, max_chars)
    truncate_list = pl.col(field).list.head(list_n)
    truncate = truncate_list if dtype == pl.List else truncate_scalar

    return (
        pl.concat([head, tail])
        .with_columns(truncate)
        .unique()
        .sort(field)[field]
        .to_list()
    )


def list_unique_values(field: pl.Series) -> list:
    fieldname = field.name
    if field.dtype.base_type() is pl.List:
        return (
            field.to_frame()
            .explode(fieldname)
            .unique()
            .drop_nulls()
            .sort(fieldname)[fieldname]
            .to_list()
        )

    return field.unique().drop_nulls().sort().to_list()


def concat_dataframes(
    dataframes: list[pl.DataFrame],
    make_alias: Callable[[int], str],
) -> pl.DataFrame:
    return pl.concat(
        [
            df.group_by(pl.lit(1))
            .agg(data=pl.struct("*"))
            .select(pl.col("data").alias(make_alias(i)))
            for i, df in enumerate(dataframes)
        ],
        how="horizontal",
    )
