import logging

import httpx
import orjson

logger = logging.getLogger(__name__)


def render_observable_notebook(
    nb_html: str,
    aws_access_key_id: str,
    aws_secret_access_key: str,
    aws_endpoint_url: str,
    aws_bucket: str,
    path_prefix: str,
    api_username: str,
    api_password: str,
    aws_region: str = "us-east-1",
    api_base_url: str = "https://visxgenai-nbrender.peter.gy",
) -> dict:
    """Custom Node service client to run a notebook build using https://www.npmjs.com/package/@observablehq/notebook-kit CLI"""
    s3_config = {
        "endpoint": aws_endpoint_url,
        "region": aws_region,
        "accessKeyId": aws_access_key_id,
        "secretAccessKey": aws_secret_access_key,
        "bucket": aws_bucket,
        "pathPrefix": path_prefix,
    }
    payload = {"s3Config": orjson.dumps(s3_config)}
    files = {"htmlFile": ("index.html", nb_html, "text/html")}
    res = httpx.post(
        f"{api_base_url}/build",
        auth=httpx.BasicAuth(api_username, api_password),
        files=files,
        data=payload,
        timeout=90.0,
    )
    logger.debug("Response from notebook build service: %s", res.text)
    res.raise_for_status()
    return res.json()
