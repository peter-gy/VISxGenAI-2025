from typing import Callable, Optional

import dspy
import polars as pl
from pydantic import TypeAdapter
from typing_extensions import TypedDict

from .agent import DatasetProfile, FieldProfile, ProfileType, SemanticType


class DatasetProfileQueryParams(TypedDict):
    low_diversity_threshold: float
    high_diversity_threshold: float
    low_cardinality_threshold: int
    high_cardinality_threshold: int
    correlation_threshold: float
    skew_threshold: float


_DEFAULT_PARAMS: DatasetProfileQueryParams = {
    "low_diversity_threshold": 0.1,
    "high_diversity_threshold": 0.8,
    "low_cardinality_threshold": 8,
    "high_cardinality_threshold": 25,
    "correlation_threshold": 0.7,
    "skew_threshold": 2.0,
}


class DatasetField(TypedDict):
    name: str
    technical_type: str
    semantic_type: str
    description: str


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


def _get_inner_field_profile(field_profile: FieldProfile) -> FieldProfile:
    if field_profile["profile_type"] == "list":
        return field_profile["dtype"]["element_profile"]  # type: ignore

    return field_profile


class CorrelatedFieldPair(TypedDict):
    a: DatasetField
    b: DatasetField
    correlation: float


class DataFieldWhereClauseDict(TypedDict, total=False):
    technical_type: str | list[str]
    semantic_type: SemanticType | list[SemanticType]
    profile_type: ProfileType | list[ProfileType]


DataFieldWhereClause = Callable[[FieldProfile], bool] | DataFieldWhereClauseDict | dict


def _where_clause_to_predicate(
    where: DataFieldWhereClause,
) -> Callable[[FieldProfile], bool]:
    """Convert a DataFieldWhereClause to a Python predicate function."""
    from inspect import isfunction

    if isfunction(where):
        return where

    if isinstance(where, dict):
        where = DataFieldWhereClauseDict(**where)

    def predicate(field_profile: FieldProfile) -> bool:
        for key, value in where.items():

            def op(a, b):
                if isinstance(b, list):
                    return a in b
                return a == b

            top_level_match = op(field_profile.get(key), value)
            child_match = op(
                field_profile["dtype"].get("element_profile", {}).get(key),  # type: ignore
                value,
            )
            if not top_level_match and not child_match:
                return False
        return True

    return predicate


class DatasetProfileTools:
    """Queryable tools for dataset exploration to guide insight planning."""

    def __init__(
        self,
        dataset_profile: DatasetProfile,
        field_descriptions: dict[str, str],
        params: DatasetProfileQueryParams = _DEFAULT_PARAMS,
    ):
        self.dataset_profile = dataset_profile
        self.field_descriptions = field_descriptions
        self.params = params

    def list_tools(self) -> list[dspy.Tool]:
        funcs = [
            self.list_all_fields,
            self.list_field_profiles,
            self.list_primary_keys,
            self.list_high_diversity_fields,
            self.list_low_cardinality_fields,
            self.list_correlated_field_pairs,
            self.list_skewed_fields,
        ]
        return [dspy.Tool(func=func) for func in funcs]

    def list_all_fields(
        self,
        where: DataFieldWhereClause | None = None,
    ) -> list[DatasetField]:
        """Returns all dataset fields with their technical type, semantic type, and description.
        Useful for getting an overview of the dataset.
        """
        queried_fields = self._list_field_profiles(where)
        fieldnames = [fieldname for fieldname, _ in queried_fields]
        return list(map(self._get_dataset_field, fieldnames))

    def list_field_profiles(
        self,
        fieldnames: list[str],
        where: DataFieldWhereClause | None = None,
    ) -> dict[str, FieldProfile]:
        """Returns detailed statistical field profiles for the specified field names.

        Useful for understanding the data distribution, types, and characteristics of specific fields.
        If a field name is not found, it will be skipped.
        """
        return {
            fieldname: profile
            for fieldname, profile in self._list_field_profiles(where)
            if fieldname in fieldnames
        }

    def list_primary_keys(
        self, where: DataFieldWhereClause | None = None
    ) -> list[DatasetField]:
        """Returns fields which are unique across all rows.

        Useful for identifying potential primary keys in the dataset.
        """
        primary_keys: list[str] = []
        for fieldname, field_profile in self._list_field_profiles(where):
            num_rows = self.dataset_profile["shape"][0]
            n_unique = field_profile["base"]["n_unique"]
            if n_unique == num_rows:
                primary_keys.append(fieldname)

        return list(map(self._get_dataset_field, primary_keys))

    def list_low_diversity_fields(
        self, where: DataFieldWhereClause | None = None
    ) -> list[DatasetField]:
        """Returns fields with low normalized Shannon entropy, indicating uneven distribution of values.

        Useful for identifying fields that may not be suitable for detailed analysis tasks.
        """
        low_diversity_fields: list[str] = []
        for fieldname, field_profile in self._list_field_profiles(where):
            inner_profile = _get_inner_field_profile(field_profile)
            if (
                inner_profile["base"]["diversity"]
                < self.params["low_diversity_threshold"]
            ):
                low_diversity_fields.append(fieldname)

        return list(map(self._get_dataset_field, low_diversity_fields))

    def list_high_diversity_fields(
        self, where: DataFieldWhereClause | None = None
    ) -> list[DatasetField]:
        """Returns fields with high normalized Shannon entropy, indicating even distribution of values.

        Useful for identifying fields for 'value' analysis tasks, optionally to be grouped by some categorical field or ranked by interesting criteria.
        """
        high_diversity_fields: list[str] = []
        for fieldname, field_profile in self._list_field_profiles(where):
            inner_profile = _get_inner_field_profile(field_profile)
            if (
                inner_profile["base"]["diversity"]
                > self.params["high_diversity_threshold"]
            ):
                high_diversity_fields.append(fieldname)

        return list(map(self._get_dataset_field, high_diversity_fields))

    def list_low_cardinality_fields(
        self,
        where: DataFieldWhereClause | None = None,
    ) -> list[DatasetField]:
        """Returns fields with low number of unique values, suitable for categorical analysis.

        Useful for identifying fields that can be used for grouping or categorization in analysis tasks.
        """
        low_cardinality_fields: list[str] = []
        for fieldname, field_profile in self._list_field_profiles(where):
            inner_profile = _get_inner_field_profile(field_profile)
            if (
                inner_profile["base"]["n_unique"]
                < self.params["low_cardinality_threshold"]
            ):
                low_cardinality_fields.append(fieldname)

        return list(map(self._get_dataset_field, low_cardinality_fields))

    def list_high_cardinality_fields(
        self,
        where: DataFieldWhereClause | None = None,
    ) -> list[DatasetField]:
        """Returns fields with high number of unique values, suitable for detailed analysis.

        Useful for identifying fields that can be used for detailed analysis tasks, such as segmentation or trend analysis.
        """
        high_cardinality_fields: list[str] = []
        for fieldname, field_profile in self._list_field_profiles(where):
            inner_profile = _get_inner_field_profile(field_profile)
            if (
                inner_profile["base"]["n_unique"]
                >= self.params["high_cardinality_threshold"]
            ):
                high_cardinality_fields.append(fieldname)

        return list(map(self._get_dataset_field, high_cardinality_fields))

    def list_correlated_field_pairs(self) -> list[CorrelatedFieldPair]:
        """Returns correlated field pairs as well as the exact correlation value.
        Note that pure numerical correlation between two fields is not necessarily meaningful.

        Useful for identifying fields that may have strong relationships, and are sensible to be used together in analysis tasks.
        """
        corr_df = self.dataset_profile["correlations"]
        threshold = self.params["correlation_threshold"]

        if corr_df.is_empty():
            return []

        correlations = frame_correlated_fields(corr_df, threshold)
        pairs: list[dict] = (
            correlations.select(
                pair=pl.struct(
                    a="a",
                    b="b",
                    correlation="correlation",
                )
            )
            .get_column("pair")
            .to_list()
        )
        return [
            {
                "a": self._get_dataset_field(pair["a"]),
                "b": self._get_dataset_field(pair["b"]),
                "correlation": pair["correlation"],
            }
            for pair in pairs
        ]

    def list_skewed_fields(
        self, where: DataFieldWhereClause | None = None
    ) -> list[DatasetField]:
        """Returns fields with high skewness, indicating potential outliers or non-normal distributions.

        Useful for identifying fields which are NOT SUITABLE for grouping or aggregation tasks.
        """
        skewed_fields: list[str] = []
        for fieldname, field_profile in self._list_field_profiles(where):
            skew = field_profile["dtype"].get("skew")
            if skew is not None and abs(skew) >= self.params["skew_threshold"]:  # type: ignore
                skewed_fields.append(fieldname)

        return list(map(self._get_dataset_field, skewed_fields))

    def _list_field_profiles(
        self,
        where: DataFieldWhereClause | None = None,
    ) -> list[tuple[str, FieldProfile]]:
        clause = (
            TypeAdapter(Optional[DataFieldWhereClause]).validate_python(where)
            or DataFieldWhereClauseDict()
        )
        predicate = _where_clause_to_predicate(clause)
        return [
            (fieldname, field_profile)
            for fieldname, field_profile in self.dataset_profile["fields"].items()
            if predicate(field_profile)
        ]

    def _get_dataset_field(self, fieldname: str) -> DatasetField:
        if fieldname not in self.dataset_profile["fields"]:
            raise KeyError(f"Field '{fieldname}' not found in dataset profile.")

        if fieldname not in self.field_descriptions:
            raise KeyError(f"Description for field '{fieldname}' not found.")

        field_profile = self.dataset_profile["fields"][fieldname]
        field_description = self.field_descriptions[fieldname]
        return {
            "name": fieldname,
            "technical_type": field_profile["technical_type"],
            "semantic_type": field_profile["semantic_type"],
            "description": field_description,
        }
