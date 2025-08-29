import datetime as dt
import math
from typing import TYPE_CHECKING, Any, Literal

import dspy
import numpy as np
import polars as pl
import polars.selectors as cs
from typing_extensions import TypedDict

from ...core import ObservedModule, SemanticSchema, SemanticType

if TYPE_CHECKING:
    from langfuse import Langfuse


def safe_round(value: Any, ndigits: int = 2) -> float:
    """Safely round a value that might be None, handling NaN and null cases."""
    if value is None:
        return 0.0
    try:
        float_val = float(value)
        if math.isnan(float_val):
            return 0.0
        return round(float_val, ndigits)
    except (TypeError, ValueError):
        return 0.0


def safe_datetime_cast(value: Any) -> dt.date | dt.datetime | None:
    """Safely cast a value to a datetime type, handling None cases."""
    if value is None:
        return None
    if isinstance(value, (dt.date, dt.datetime)):
        return value
    return None


def safe_int_cast(value: Any) -> int | None:
    """Safely cast a value to an integer, handling None cases."""
    if value is None:
        return None
    if isinstance(value, int):
        return value
    if isinstance(value, float):
        return int(value)
    if isinstance(value, str) and value.isdigit():
        return int(value)
    if isinstance(value, str) and value.replace(".", "", 1).isdigit():
        return int(float(value))


# UNIVARIATE PROFILING

ProfileType = Literal[
    "numeric",
    "boolean",
    "temporal",
    "nominal",
    "list",
]


def determine_profile_type(dtype: pl.DataType) -> ProfileType:
    if dtype.is_numeric():
        return "numeric"
    elif dtype.is_temporal():
        return "temporal"
    elif dtype == pl.Boolean:
        return "boolean"
    elif dtype == pl.String:
        return "nominal"
    elif dtype.base_type() == pl.List:
        return "list"

    raise ValueError(f"Unsupported data type for profiling: {dtype}")


class BaseProfile(TypedDict):
    n_unique: int
    diversity: float
    missing_pct: float


def compute_base_profile(field: pl.Series) -> BaseProfile:
    vc = field.value_counts(
        normalize=True,
        sort=False,
    ).get_column("proportion")
    entropy_raw = -(vc * np.log(vc) / np.log(math.e)).sum()
    n_unique = field.n_unique()
    max_entropy = np.log(n_unique)
    diversity_raw = entropy_raw / max_entropy
    missing_pct = field.null_count() / field.count()

    return {
        "n_unique": field.n_unique(),
        "diversity": safe_round(diversity_raw),
        "missing_pct": safe_round(missing_pct),
    }


Number = int | float


class NumericProfile(TypedDict):
    min: Number
    max: Number
    skew: Number
    std: Number
    p10: Number
    p25: Number
    p50: Number
    p75: Number
    p90: Number


def compute_numeric_profile(field: pl.Series) -> NumericProfile:
    assert field.dtype.is_numeric(), "Field must be numeric for this profile"
    return {
        "min": safe_round(field.min()),
        "max": safe_round(field.max()),
        "skew": safe_round(field.skew()),
        "std": safe_round(field.std()),
        "p10": safe_round(field.quantile(0.1)),
        "p25": safe_round(field.quantile(0.25)),
        "p50": safe_round(field.quantile(0.5)),
        "p75": safe_round(field.quantile(0.75)),
        "p90": safe_round(field.quantile(0.9)),
    }


DateValue = dt.date | dt.datetime


class TemporalProfile(TypedDict):
    min: DateValue | None
    max: DateValue | None
    span_days: int
    skew: Number


def compute_temporal_profile(field: pl.Series) -> TemporalProfile:
    assert field.dtype.is_temporal(), "Field must be temporal for this profile"
    return {
        "min": safe_datetime_cast(field.min()),
        "max": safe_datetime_cast(field.max()),
        "span_days": (field.max() - field.min()).days,  # type: ignore
        "skew": safe_round(field.skew()),
    }


class BooleanProfile(TypedDict):
    skew: Number


def compute_boolean_profile(field: pl.Series) -> BooleanProfile:
    assert field.dtype == pl.Boolean, "Field must be boolean for this profile"
    return {
        "skew": safe_round(field.skew()),
    }


class NominalProfile(TypedDict):
    min_char_length: int | None
    max_char_length: int | None


def compute_nominal_profile(field: pl.Series) -> NominalProfile:
    assert field.dtype == pl.String, "Field must be nominal for this profile"
    len_chars = field.str.len_chars()
    return {
        "min_char_length": safe_int_cast(len_chars.min()),
        "max_char_length": safe_int_cast(len_chars.max()),
    }


class ListProfile(TypedDict):
    min_element_count: int | None
    max_element_count: int | None
    element_profile: "FieldProfile"


def compute_list_profile(field: pl.Series) -> ListProfile:
    assert field.dtype.base_type() == pl.List, "Field must be a list for this profile"
    list_len = field.list.len()
    return {
        "min_element_count": safe_int_cast(list_len.min()),
        "max_element_count": safe_int_cast(list_len.max()),
        # Gets computed recursively in `compute_field_profile`
        "element_profile": {},  # type: ignore
    }


class FieldProfile(TypedDict):
    technical_type: str
    semantic_type: SemanticType
    profile_type: ProfileType
    base: BaseProfile
    dtype: (
        ListProfile | NumericProfile | TemporalProfile | BooleanProfile | NominalProfile
    )


def compute_field_profile(
    field: pl.Series,
    semantic_type: SemanticType,
) -> FieldProfile:
    base_profile = compute_base_profile(field)

    dtype_profile = {}
    profile_type = determine_profile_type(field.dtype)
    if profile_type == "numeric":
        dtype_profile = compute_numeric_profile(field)
    elif profile_type == "temporal":
        dtype_profile = compute_temporal_profile(field)
    elif profile_type == "boolean":
        dtype_profile = compute_boolean_profile(field)
    elif profile_type == "nominal":
        dtype_profile = compute_nominal_profile(field)
    elif profile_type == "list":
        list_profile = compute_list_profile(field)
        exploded_field = field.to_frame().explode(field.name)[field.name]
        element_profile = compute_field_profile(exploded_field, semantic_type)
        dtype_profile = {
            **list_profile,
            "element_profile": element_profile,
        }
    else:
        raise NotImplementedError(
            f"Unsupported profile type: {profile_type} for field {field.name}"
        )

    return {
        "technical_type": str(field.dtype),
        "semantic_type": semantic_type,
        "profile_type": profile_type,
        "base": base_profile,
        "dtype": dtype_profile,  # type: ignore
    }


# BIVARIATE PROFILING


def compute_correlations(
    df: pl.DataFrame,
    method: Literal["pearson", "spearman"] = "pearson",
) -> pl.DataFrame:
    numeric_fields_df = pl.from_dict({"field": df.select(cs.numeric()).columns})
    field_pairs: list[tuple[str, str]] = (
        numeric_fields_df.join(numeric_fields_df, how="cross")
        .rename({"field": "a", "field_right": "b"})
        .select(pl.concat_list("a", "b").alias("pairs"))
        .get_column("pairs")
        .to_list()
    )
    return (
        df.select(
            *(pl.corr(a, b, method=method).alias(f"{a}___{b}") for a, b in field_pairs)
        )
        .unpivot(value_name="correlation", variable_name="field_pair")
        .select(
            a=pl.col("field_pair").str.split("___").list.get(0),
            b=pl.col("field_pair").str.split("___").list.get(1),
            correlation="correlation",
        )
    )


def frame_correlated_fields(
    corr_df: pl.DataFrame,
    threshold: float,
) -> pl.DataFrame:
    return (
        corr_df.filter(pl.col("a") != pl.col("b"))
        .filter(pl.col("correlation").abs() >= threshold)
        .with_columns(pairs=pl.concat_list("a", "b").list.sort())
        .unique("pairs")
        .drop("pairs")
    )


class DatasetProfile(TypedDict):
    shape: tuple[int, int]
    fields: dict[str, FieldProfile]
    correlations: pl.DataFrame


def compute_df_profile(
    df: pl.DataFrame,
    semantic_schema: SemanticSchema,
) -> DatasetProfile:
    # Field-level stats
    fields: dict[str, FieldProfile] = {}
    for fieldname, semantic_type in semantic_schema.items():
        field_profile = compute_field_profile(
            df.get_column(fieldname),
            semantic_type,
        )
        fields[fieldname] = field_profile

    # Dataset-level stats
    correlations = compute_correlations(df)

    return {
        "shape": (df.height, df.width),
        "fields": fields,
        "correlations": correlations,
    }


class DatasetProfilerAgent(ObservedModule):
    """Agent to profile datasets, generating field-level and dataset-level statistics."""

    def __init__(self, langfuse: "Langfuse"):
        super().__init__(langfuse=langfuse)

    def _forward(
        self,
        *,
        df: pl.DataFrame,
        semantic_schema: SemanticSchema,
    ) -> dspy.Prediction:
        """Profile the given dataset and return field-level and dataset-level statistics."""
        profile = compute_df_profile(df, semantic_schema)
        return dspy.Prediction(profile=profile)
