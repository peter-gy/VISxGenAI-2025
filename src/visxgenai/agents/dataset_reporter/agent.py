from typing import TYPE_CHECKING

import dspy

from ...core import ObservedModule
from ...notebook_kit import render_observable_notebook
from .utils import (
    collect_report_components,
    make_relative_assets_absolute,
    report_components_to_notebook,
)

if TYPE_CHECKING:
    from langfuse import Langfuse


class DatasetReporterAgent(ObservedModule):
    def __init__(
        self,
        nb_builder_api_username: str,
        nb_builder_api_password: str,
        aws_access_key_id: str,
        aws_secret_access_key: str,
        aws_endpoint_url: str,
        aws_bucket: str,
        aws_cdn_base_url: str,
        langfuse: "Langfuse",
        aws_region: str = "us-east-1",
        api_base_url: str = "https://visxgenai-nbrender.peter.gy",
    ):
        super().__init__(langfuse=langfuse)
        self.nb_builder_api_username = nb_builder_api_username
        self.nb_builder_api_password = nb_builder_api_password
        self.aws_access_key_id = aws_access_key_id
        self.aws_secret_access_key = aws_secret_access_key
        self.aws_endpoint_url = aws_endpoint_url
        self.aws_bucket = aws_bucket
        self.aws_cdn_base_url = aws_cdn_base_url
        self.aws_region = aws_region
        self.api_base_url = api_base_url

    def _forward(
        self,
        *,
        session: str,
        queried_insights: list[dict],
        materialized_insights: list[dict],
        visualized_insights: list[dict],
        published_datasets: list[dict],
        report_structure: dict,
        traces: dict | None = None,
    ) -> dspy.Prediction:
        # Structure all the components of the report
        report_components = collect_report_components(
            queried_insights=queried_insights,
            materialized_insights=materialized_insights,
            visualized_insights=visualized_insights,
            published_datasets=published_datasets,
            report_structure=report_structure,
        )

        # Construct the Observable notebook 2.0 HTML from the report components
        nb_html = report_components_to_notebook(report_components, traces)

        # Call custom node service via HTTP client to render the notebook, push assets to object storage and return the index.html content
        path_prefix = f"sessions/{session}"
        render_response = render_observable_notebook(
            nb_html=nb_html,
            aws_access_key_id=self.aws_access_key_id,
            aws_secret_access_key=self.aws_secret_access_key,
            aws_endpoint_url=self.aws_endpoint_url,
            aws_bucket=self.aws_bucket,
            path_prefix=path_prefix,
            api_username=self.nb_builder_api_username,
            api_password=self.nb_builder_api_password,
            aws_region=self.aws_region,
            api_base_url=self.api_base_url,
        )
        if render_response.get("success") is not True:
            raise RuntimeError(
                f"Failed to render the Observable notebook: {render_response}"
            )

        filename: str = render_response["fileName"]
        deployment_base_url = f"{self.aws_cdn_base_url}/{path_prefix}"
        deployment_url = f"{deployment_base_url}/{filename}"
        built_html_content: str = render_response["builtHtmlContent"]
        processed_html_content = make_relative_assets_absolute(
            html=built_html_content,
            base_url=deployment_base_url,
        )
        nb = make_relative_assets_absolute(
            html=nb_html,
            base_url=deployment_base_url,
        )

        return dspy.Prediction(
            url=deployment_url,
            html=processed_html_content,
            nb=nb,
        )
