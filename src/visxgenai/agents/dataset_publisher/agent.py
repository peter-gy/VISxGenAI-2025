from typing import TYPE_CHECKING

import dspy
import polars as pl
from typing_extensions import TypedDict

from ...core import ObservedModule, concat_dataframes

if TYPE_CHECKING:
    from langfuse import Langfuse


class MaterializedInsight(TypedDict):
    goal: str
    dataset: pl.DataFrame


class DatasetPublisherAgent(ObservedModule):
    def __init__(
        self,
        aws_access_key_id: str,
        aws_secret_access_key: str,
        aws_endpoint_url: str,
        cdn_base_url: str,
        bucket: str,
        langfuse: "Langfuse",
    ):
        super().__init__(langfuse=langfuse)
        self.aws_access_key_id = aws_access_key_id
        self.aws_secret_access_key = aws_secret_access_key
        self.aws_endpoint_url = aws_endpoint_url
        self.cdn_base_url = cdn_base_url
        self.bucket = bucket

    def _forward(
        self,
        *,
        materialized_insights: list[MaterializedInsight],
        session: str,
    ):
        def make_alias(i: int) -> str:
            return f"dataset_{i + 1:02d}"

        datasets = [
            materialized_insight["dataset"]
            for materialized_insight in materialized_insights
        ]
        df = concat_dataframes(datasets, make_alias)
        key = f"sessions/{session}/artifacts/datasets.parquet"
        url = "/".join([self.cdn_base_url.removesuffix("/"), key])
        df.write_parquet(
            f"s3://{self.bucket}/{key}",
            storage_options={
                "aws_access_key_id": self.aws_access_key_id,
                "aws_secret_access_key": self.aws_secret_access_key,
                "endpoint_url": self.aws_endpoint_url,
            },
        )

        publication_records = []
        for i, materialized_insight in enumerate(materialized_insights):
            goal = materialized_insight["goal"]
            dataset_alias = make_alias(i)
            publication_records.append(
                {
                    "goal": goal,
                    "dataset_name": dataset_alias,
                    "dataset_url": url,
                }
            )

        return dspy.Prediction(
            records=publication_records,
            metadata={
                "session": session,
                "bucket": self.bucket,
                "cdn_base_url": self.cdn_base_url,
            },
        )
