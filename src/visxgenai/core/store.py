from typing import Any, Optional

import obstore as obs
from typing_extensions import TypedDict


class BucketCredentials(TypedDict, total=False):
    aws_access_key_id: str
    aws_secret_access_key: str
    aws_endpoint_url: str
    aws_region: str


def put_object(
    bucket: str,
    *,
    key: str,
    file: bytes,
    credentials: BucketCredentials,
    attributes: Optional["obs.Attributes"] = None,
) -> "obs.PutResult":
    store = obs.store.S3Store(
        bucket=bucket,
        access_key_id=credentials.get("aws_access_key_id"),
        secret_access_key=credentials.get("aws_secret_access_key"),
        endpoint_url=credentials.get("aws_endpoint_url"),
        region=credentials.get("aws_region", "us-east-1"),
    )

    return store.put(
        key,
        file,
        attributes=attributes,
    )


def put_json(
    bucket: str,
    *,
    key: str,
    data: Any,
    credentials: BucketCredentials,
) -> "obs.PutResult":
    import orjson
    from pydantic.json import pydantic_encoder

    file = orjson.dumps(data, default=pydantic_encoder)
    return put_object(
        bucket=bucket,
        key=key,
        file=file,
        credentials=credentials,
        attributes={"Content-Type": "application/json"},
    )


def put_html(
    bucket: str,
    *,
    key: str,
    html: str,
    credentials: BucketCredentials,
) -> "obs.PutResult":
    file = html.encode("utf-8")
    return put_object(
        bucket=bucket,
        key=key,
        file=file,
        credentials=credentials,
        attributes={"Content-Type": "text/html"},
    )
