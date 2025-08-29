import logging

import dspy
from dspy.clients.base_lm import GLOBAL_HISTORY

from ...core import (
    AutovisEnv,
    LMInitializer,
    LMRegistry,
    make_session_id,
    put_html,
    put_json,
    read_dataset,
)
from ..dataset_deriver.agent import DatasetDeriverAgent
from ..dataset_describer.agent import DatasetDescriberAgent
from ..dataset_narrator.agent import DataReportNarratorAgent
from ..dataset_profiler.agent import DatasetProfilerAgent
from ..dataset_publisher.agent import DatasetPublisherAgent
from ..dataset_reporter.agent import DatasetReporterAgent
from ..dataset_visualizer.agent import DatasetVisualizerAgent
from ..field_expander.agent import FieldExpanderAgent
from ..field_refiner.agent import FieldRefinerAgent
from ..insight_planner.agent import InsightPlannerAgent
from ..insight_planner.tools import InsightPlanTools
from .utils import organize_provenance, organize_traces

logger = logging.getLogger(__name__)

_DEFAULT_AGENT_CONFIG = {
    "FieldRefiner": {
        "lm": {
            "model": "vertex_ai/gemini-2.5-flash-lite",
            "max_tokens": 16_000,
        }
    },
    "DatasetDescriber": {
        "lm": {
            "model": "vertex_ai/gemini-2.0-flash",
            "max_tokens": 8_000,
        }
    },
    "FieldExpander": {
        "lm": {
            "model": "gemini/gemini-2.0-flash",
            "max_tokens": 6_000,
            "tools": [
                {"googleSearch": {}},
            ],
        }
    },
    "DatasetProfiler": {
        "lm": None,
    },
    "InsightPlanner": {
        "lm": {
            "model": "vertex_ai/gemini-2.5-flash",
            "max_tokens": 32_000,
            "reasoning_effort": "disable",
        }
    },
    "InsightPlanJudge": {
        "lm": {
            "model": "vertex_ai/gemini-2.0-flash",
            "max_tokens": 8_000,
        }
    },
    "SQLQueryDrafter": {
        "lm": {
            "model": "vertex_ai/gemini-2.5-pro",
            "max_tokens": 60_000,
        }
    },
    "SQLQueryRepairer": {
        "lm": {
            "model": "vertex_ai/gemini-2.5-flash",
            "max_tokens": 60_000,
        }
    },
    "DatasetPublisher": {
        "lm": None,
    },
    "DatasetVisualizer": {
        "lm": None,
    },
    "DataReportSectionNarrator": {
        "lm": {
            "model": "vertex_ai/gemini-2.5-pro",
            "max_tokens": 32_000,
        }
    },
    "DataReportStructurer": {
        "lm": {
            "model": "vertex_ai/gemini-2.5-flash",
            "max_tokens": 32_000,
            "reasoning_effort": "disable",
        }
    },
    "DatasetReporter": {
        "lm": None,
    },
}


class OrchestratorAgent(dspy.Module):
    def __init__(
        self,
        env: AutovisEnv,
        lm_registry: LMRegistry,
        agent_config: dict | None = None,
    ):
        self.env = env
        self.lm_registry = lm_registry
        self.agent_config = agent_config or _DEFAULT_AGENT_CONFIG

        self.field_refiner = FieldRefinerAgent(
            self.lm_init_for("FieldRefiner"),
            langfuse=self.lm_registry.langfuse,
        )
        self.dataset_describer = DatasetDescriberAgent(
            self.lm_init_for("DatasetDescriber"),
            langfuse=self.lm_registry.langfuse,
        )
        self.field_expander = FieldExpanderAgent(
            self.lm_init_for("FieldExpander"),
            langfuse=self.lm_registry.langfuse,
        )
        self.dataset_profiler = DatasetProfilerAgent(langfuse=self.lm_registry.langfuse)
        self.insight_planner = InsightPlannerAgent(
            init_planner_lm=self.lm_init_for("InsightPlanner"),
            init_judge_lm=self.lm_init_for("InsightPlanJudge"),
            langfuse=self.lm_registry.langfuse,
        )
        self.dataset_deriver = DatasetDeriverAgent(
            init_drafter_lm=self.lm_init_for("SQLQueryDrafter"),
            init_repairer_lm=self.lm_init_for("SQLQueryRepairer"),
            langfuse=self.lm_registry.langfuse,
        )
        self.dataset_publisher = DatasetPublisherAgent(
            aws_access_key_id=env["AWS_ACCESS_KEY_ID"],
            aws_secret_access_key=env["AWS_SECRET_ACCESS_KEY"],
            aws_endpoint_url=env["AWS_ENDPOINT_URL"],
            cdn_base_url=env["AWS_CDN_BASE_URL"],
            bucket=env["AWS_BUCKET"],
            langfuse=self.lm_registry.langfuse,
        )
        self.dataset_visualizer = DatasetVisualizerAgent(
            langfuse=self.lm_registry.langfuse,
        )
        self.report_narrator = DataReportNarratorAgent(
            init_narrator_lm=self.lm_init_for("DataReportSectionNarrator"),
            init_structurer_lm=self.lm_init_for("DataReportStructurer"),
            langfuse=self.lm_registry.langfuse,
        )
        self.dataset_reporter = DatasetReporterAgent(
            nb_builder_api_username=env["NB_BUILDER_API_USERNAME"],
            nb_builder_api_password=env["NB_BUILDER_API_PASSWORD"],
            aws_access_key_id=env["AWS_ACCESS_KEY_ID"],
            aws_secret_access_key=env["AWS_SECRET_ACCESS_KEY"],
            aws_endpoint_url=env["AWS_ENDPOINT_URL"],
            aws_bucket=env["AWS_BUCKET"],
            aws_cdn_base_url=env["AWS_CDN_BASE_URL"],
            langfuse=self.lm_registry.langfuse,
            api_base_url=env["NB_BUILDER_API_BASE_URL"],
        )

    def forward(
        self,
        *,
        dataset_uri: str,
        report_goal: str = "I want an accessible, interesting report on the dataset.",
        report_length: str = "At most 7 insights, balanced across types",
        session_id: str | None = None,
        tags: list[str] | None = None,
    ) -> dspy.Prediction:
        session = session_id or make_session_id()
        logger.info(f"Starting report generation for session {session}")
        df = read_dataset(dataset_uri)
        logger.info(f"Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")

        # Make the langfuse trace public so that URL can be attached to report
        self.lm_registry.langfuse.update_current_trace(
            name="AutoReportOrchestrator",
            session_id=session,
            public=True,
            tags=tags or [],
        )
        trace_url = self.lm_registry.langfuse.get_trace_url()
        logger.info(f"👀 {trace_url}")

        # Identify mis-typed fields and represent them with appropriate technical types
        logger.info("🔧 Step 1/11: Refining field types...")
        field_refiner_output = self.field_refiner(df=df)
        logger.info(
            f"Field refinement complete: {len(field_refiner_output.refinements)} refinements applied"
        )

        # Describe the dataset and its fields semantically
        logger.info("🔍 Step 2/11: Describing dataset semantically...")
        dataset_describer_output = self.dataset_describer(
            df=field_refiner_output.df,
            semantic_schema=field_refiner_output.semantic_schema,
        )
        logger.info(f"Dataset description complete: '{dataset_describer_output.title}'")

        # Expand cryptic low-cardinality field values into human-readable ones
        logger.info("🔄 Step 3/11: Expanding field values...")
        field_expander_output = self.field_expander(
            df=field_refiner_output.df,
            dataset_summary=str(dict(dataset_describer_output)),
            dataset_fields=dataset_describer_output.fields,
            field_info=field_refiner_output.refinements,
        )
        logger.info(
            f"Field expansion complete: {len(field_expander_output.expansions)} field value expansions applied"
        )

        # Construct statistical dataset profile
        logger.info("📈 Step 4/11: Profiling dataset...")
        dataset_profiler_output = self.dataset_profiler(
            df=field_expander_output.df,
            semantic_schema=field_refiner_output.semantic_schema,
        )
        logger.info("Dataset profiling complete: Statistical profile generated")

        # Plan interesting insights guided by the dataset profile and semantic schema
        logger.info("💡 Step 5/11: Planning insights...")
        insight_planner_output = self.insight_planner(
            dataset_title=dataset_describer_output.title,
            dataset_description=dataset_describer_output.summary,
            field_descriptions=dataset_describer_output.fields,
            dataset_profile=dataset_profiler_output.profile,
            insight_count_target=report_length,
            user_goal=report_goal,
        )
        insight_plan_tools = InsightPlanTools(insight_planner_output.plan)
        logger.info(
            f"Insight planning complete: {len(insight_plan_tools.list_goals())} insights planned"
        )

        # Generate SQL queries to satisfy the planned insights
        logger.info("🗄️ Step 6/11: Generating SQL queries for insights...")
        dataset_deriver_output = self.dataset_deriver(
            df=field_expander_output.df,
            dataset_title=dataset_describer_output.title,
            dataset_description=dataset_describer_output.summary,
            field_descriptions=dataset_describer_output.fields,
            dataset_profile=dataset_profiler_output.profile,
            nl_queries=insight_plan_tools.list_goals(),
        )
        logger.info(
            f"SQL query generation complete: {len(dataset_deriver_output.datasets)} queries generated"
        )

        # Materialize datasets for each insight
        logger.info("🔧 Step 7/11: Materializing insight datasets...")
        materialized_insights = [
            {"goal": ds["goal"]} | dict(zip(("dataset", "sql"), ds["materialize"]()))
            for ds in dataset_deriver_output.datasets
        ]
        logger.info(
            f"Dataset materialization complete: {len(materialized_insights)} datasets ready for analysis"
        )

        # Publish materialized datasets to object store
        logger.info("☁️ Step 8/11: Publishing datasets to object store...")
        dataset_publisher_output = self.dataset_publisher(
            materialized_insights=materialized_insights,
            session=session,
        )
        logger.info(
            f"Dataset publishing complete: {len(dataset_publisher_output.records)} datasets published to cloud storage"
        )

        # Visualize the materialized datasets
        logger.info("📊 Step 9/11: Generating visualizations...")
        dataset_visualizer_output = self.dataset_visualizer(
            queried_insights=dataset_deriver_output.datasets,
            materialized_insights=materialized_insights,
            insight_plan_tools=insight_plan_tools,
        )
        logger.info(
            f"Visualization generation complete: {len(dataset_visualizer_output.recommendations)} visualizations created"
        )

        # Narrate the report sections with vision-enabled language model and draft final report structure
        logger.info("📖 Step 10/11: Narrating report sections...")
        report_narrator_output = self.report_narrator(
            parent_dataset_description=dataset_describer_output.summary,
            queried_insights=dataset_deriver_output.datasets,
            visualized_insights=dataset_visualizer_output.recommendations,
            insight_plan_tools=insight_plan_tools,
            user_goal=report_goal,
        )
        logger.info(
            f"Report narration complete: Generated narrative structure with {len(report_narrator_output.content.get('sections', []))} sections"
        )

        # Organize all traces so that they can be communicated in the final report
        logger.info("🔗 Step 11/11: Organizing traces and building report...")
        organized_traces = organize_traces(
            field_refiner_output=field_refiner_output,
            dataset_describer_output=dataset_describer_output,
            field_expander_output=field_expander_output,
            dataset_profiler_output=dataset_profiler_output,
            insight_planner_output=insight_planner_output,
            dataset_deriver_output=dataset_deriver_output,
            dataset_publisher_output=dataset_publisher_output,
            dataset_visualizer_output=dataset_visualizer_output,
            report_narrator_output=report_narrator_output,
            insight_plan_tools=insight_plan_tools,
        )

        # Collect all the components of the report and build the final HTML output
        dataset_reporter_output = self.dataset_reporter(
            session=session,
            queried_insights=dataset_deriver_output.datasets,
            materialized_insights=materialized_insights,
            visualized_insights=dataset_visualizer_output.recommendations,
            published_datasets=dataset_publisher_output.records,
            report_structure=report_narrator_output.content,
            traces={
                "flow": trace_url,
                "observations": organized_traces,
            },
        )
        logger.info(
            f"🎉 Report generation complete! Final report available at: {dataset_reporter_output.url}"
        )

        # Upload constructed Observable notebook source code as artifact
        logger.info("📦 Uploading artifacts...")
        store_credentials = {
            "aws_access_key_id": self.env["AWS_ACCESS_KEY_ID"],
            "aws_secret_access_key": self.env["AWS_SECRET_ACCESS_KEY"],
            "aws_endpoint_url": self.env["AWS_ENDPOINT_URL"],
        }
        notebook_key = f"sessions/{session}/artifacts/notebook.html"
        notebook_url = f"{self.env['AWS_CDN_BASE_URL']}/{notebook_key}"
        put_html(
            bucket=self.env["AWS_BUCKET"],
            key=notebook_key,
            html=dataset_reporter_output.nb,
            credentials=store_credentials,
        )

        llm_history_json_key = f"sessions/{session}/artifacts/history.json"
        llm_history_json_url = f"{self.env['AWS_CDN_BASE_URL']}/{llm_history_json_key}"
        put_json(
            bucket=self.env["AWS_BUCKET"],
            key=llm_history_json_key,
            data=GLOBAL_HISTORY,
            credentials=store_credentials,
        )

        organized_provenance = organize_provenance(
            dataset_uri=dataset_uri,
            field_refiner_output=field_refiner_output,
            field_expander_output=field_expander_output,
            dataset_deriver_output=dataset_deriver_output,
            insight_plan_tools=insight_plan_tools,
        )
        organized_provenance_json_key = f"sessions/{session}/artifacts/provenance.json"
        organized_provenance_json_url = (
            f"{self.env['AWS_CDN_BASE_URL']}/{organized_provenance_json_key}"
        )
        put_json(
            bucket=self.env["AWS_BUCKET"],
            key=organized_provenance_json_key,
            data=organized_provenance,
            credentials=store_credentials,
        )

        logger.info("All artifacts uploaded successfully")

        return dspy.Prediction(
            artifacts={
                "deployment": dataset_reporter_output.url,
                "notebook": notebook_url,
                "traces": trace_url,
                "history": llm_history_json_url,
                "provenance": organized_provenance_json_url,
                "datasets": dataset_publisher_output.records,
            },
            html=dataset_reporter_output.html,
        )

    def lm_init_for(self, agent: str) -> LMInitializer:
        if agent not in self.agent_config:
            raise ValueError(f"Agent {agent} is not configured.")

        lm_config = self.agent_config[agent]["lm"]
        return self.lm_registry.lm_initializer(**lm_config)
