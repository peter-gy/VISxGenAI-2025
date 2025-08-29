import marimo

__generated_with = "0.15.1"
app = marimo.App(width="columns")


@app.cell(column=0, hide_code=True)
def _(mo):
    mo.image(agent_diagram_url("01"))
    return


@app.cell
def _(df):
    df
    return


@app.cell
def _(read_dataset):
    dataset_uri = "https://raw.githubusercontent.com/demoPlz/mini-template/main/studio/dataset.csv"
    df = read_dataset(dataset_uri)
    return (df,)


@app.cell
def _(lm_registry_from_env, load_env, make_session_id):
    env = load_env()
    lm_registry = lm_registry_from_env(env)
    session_id = make_session_id()
    return env, lm_registry, session_id


@app.function(hide_code=True)
def agent_diagram_url(id: str):
    return f"https://peter-gy.github.io/VISxGenAI-2025/assets/agents/{id}.svg"


@app.cell
def _():
    import marimo as mo
    from visxgenai.core import (
        lm_registry_from_env,
        load_env,
        make_session_id,
        read_dataset,
    )

    return lm_registry_from_env, load_env, make_session_id, mo, read_dataset


@app.cell(column=1, hide_code=True)
def _(mo):
    mo.image(agent_diagram_url("02"))
    return


@app.cell
def _(field_refiner_output):
    dict(field_refiner_output)
    return


@app.cell(hide_code=True)
def _(df, field_refiner_agent):
    field_refiner_output = field_refiner_agent(df=df)
    return (field_refiner_output,)


@app.cell
def _(FieldRefinerAgent, lm_registry):
    field_refiner_agent = FieldRefinerAgent(
        lm_registry.lm_initializer("vertex_ai/gemini-2.5-flash-lite"),
        langfuse=lm_registry.langfuse,
    )
    return (field_refiner_agent,)


@app.cell
def _():
    from visxgenai.agents.field_refiner.agent import FieldRefinerAgent

    return (FieldRefinerAgent,)


@app.cell(column=2, hide_code=True)
def _(mo):
    mo.image(agent_diagram_url("03"))
    return


@app.cell
def _(dataset_describer_output):
    dict(dataset_describer_output)
    return


@app.cell
def _(dataset_describer, field_refiner_output):
    dataset_describer_output = dataset_describer(
        df=field_refiner_output["df"],
        semantic_schema=field_refiner_output["semantic_schema"],
    )
    return (dataset_describer_output,)


@app.cell
def _(DatasetDescriberAgent, lm_registry):
    dataset_describer = DatasetDescriberAgent(
        lm_registry.lm_initializer(
            "vertex_ai/gemini-2.0-flash",
        ),
        langfuse=lm_registry.langfuse,
    )
    return (dataset_describer,)


@app.cell
def _():
    from visxgenai.agents.dataset_describer.agent import DatasetDescriberAgent

    return (DatasetDescriberAgent,)


@app.cell(column=3, hide_code=True)
def _(mo):
    mo.image(agent_diagram_url("04"))
    return


@app.cell
def _(field_expander_output):
    dict(field_expander_output)
    return


@app.cell
def _(dataset_describer_output, field_expander, field_refiner_output):
    field_expander_output = field_expander(
        df=field_refiner_output["df"],
        dataset_summary=str(dict(dataset_describer_output)),
        dataset_fields=dataset_describer_output["fields"],
        field_info=field_refiner_output["refinements"],
    )
    return (field_expander_output,)


@app.cell
def _(FieldExpanderAgent, lm_registry):
    field_expander = FieldExpanderAgent(
        lm_registry.lm_initializer(
            "gemini/gemini-2.0-flash",
            max_tokens=8_000,
            tools=[
                {"googleSearch": {}},
            ],
        ),
        langfuse=lm_registry.langfuse,
    )
    return (field_expander,)


@app.cell
def _():
    from visxgenai.agents.field_expander.agent import FieldExpanderAgent

    return (FieldExpanderAgent,)


@app.cell(column=4, hide_code=True)
def _(mo):
    mo.image(agent_diagram_url("05"))
    return


@app.cell
def _(dataset_profiler_output):
    dict(dataset_profiler_output)
    return


@app.cell
def _(dataset_profiler, field_expander_output, field_refiner_output):
    dataset_profiler_output = dataset_profiler(
        df=field_expander_output["df"],
        semantic_schema=field_refiner_output["semantic_schema"],
    )
    return (dataset_profiler_output,)


@app.cell
def _(DatasetProfilerAgent, lm_registry):
    dataset_profiler = DatasetProfilerAgent(
        langfuse=lm_registry.langfuse,
    )
    return (dataset_profiler,)


@app.cell
def _():
    from visxgenai.agents.dataset_profiler.agent import DatasetProfilerAgent

    return (DatasetProfilerAgent,)


@app.cell(column=5, hide_code=True)
def _(mo):
    mo.image(agent_diagram_url("06"))
    return


@app.cell
def _(insight_planner_output):
    [m.model_dump() for m in insight_planner_output.plan]
    return


@app.cell
def _(InsightPlanTools, insight_planner_output):
    insight_plan_tools = InsightPlanTools(insight_planner_output.plan)
    return (insight_plan_tools,)


@app.cell
def _(dataset_describer_output, dataset_profiler_output, insight_planner):
    insight_planner_output = insight_planner(
        dataset_title=dataset_describer_output.title,
        dataset_description=dataset_describer_output.summary,
        field_descriptions=dataset_describer_output.fields,
        dataset_profile=dataset_profiler_output.profile,
    )
    insight_planner_output
    return (insight_planner_output,)


@app.cell
def _(InsightPlannerAgent, lm_registry):
    insight_planner = InsightPlannerAgent(
        init_planner_lm=lm_registry.lm_initializer(
            "vertex_ai/gemini-2.5-flash",
            max_tokens=32_000,
            # reasoning_effort="disable",
        ),
        init_judge_lm=lm_registry.lm_initializer(
            "vertex_ai/gemini-2.5-flash-lite",
            max_tokens=16_000,
            reasoning_effort="disable",
        ),
        langfuse=lm_registry.langfuse,
    )
    return (insight_planner,)


@app.cell
def _(
    construct_dataset_context,
    dataset_describer_output,
    dataset_profiler_output,
):
    construct_dataset_context(
        dataset_title=dataset_describer_output.title,
        dataset_description=dataset_describer_output.summary,
        field_descriptions=dataset_describer_output.fields,
        dataset_profile=dataset_profiler_output.profile,
    )
    return


@app.cell
def _():
    from visxgenai.agents.insight_planner.utils import construct_dataset_context

    return (construct_dataset_context,)


@app.cell
def _():
    from visxgenai.agents.insight_planner.agent import InsightPlannerAgent
    from visxgenai.agents.insight_planner.tools import InsightPlanTools

    return InsightPlanTools, InsightPlannerAgent


@app.cell(column=6, hide_code=True)
def _(mo):
    mo.image(agent_diagram_url("07"))
    return


@app.cell
def _(datset_deriver_output):
    materialized_insights = [
        {"goal": ds["goal"]} | dict(zip(("dataset", "sql"), ds["materialize"]()))
        for ds in datset_deriver_output.datasets
    ]
    materialized_insights
    return (materialized_insights,)


@app.cell
def _(datset_deriver_output):
    dict(datset_deriver_output)
    return


@app.cell
def _(datset_deriver_output):
    datset_deriver_output.queries
    return


@app.cell
def _(datset_deriver_output):
    dict(datset_deriver_output)
    return


@app.cell
def _(
    dataset_describer_output,
    dataset_profiler_output,
    datset_deriver,
    field_expander_output,
    insight_plan_tools,
):
    datset_deriver_output = datset_deriver(
        df=field_expander_output.df,
        dataset_title=dataset_describer_output.title,
        dataset_description=dataset_describer_output.summary,
        field_descriptions=dataset_describer_output.fields,
        dataset_profile=dataset_profiler_output.profile,
        nl_queries=insight_plan_tools.list_goals(),
    )
    datset_deriver_output
    return (datset_deriver_output,)


@app.cell
def _(DatasetDeriverAgent, lm_registry):
    datset_deriver = DatasetDeriverAgent(
        init_drafter_lm=lm_registry.lm_initializer(
            "vertex_ai/gemini-2.5-pro",
            max_tokens=60_000,
        ),
        init_repairer_lm=lm_registry.lm_initializer(
            "vertex_ai/gemini-2.5-flash",
            max_tokens=60_000,
        ),
        langfuse=lm_registry.langfuse,
    )
    return (datset_deriver,)


@app.cell
def _():
    from visxgenai.agents.dataset_deriver.agent import DatasetDeriverAgent

    return (DatasetDeriverAgent,)


@app.cell(column=7, hide_code=True)
def _(mo):
    mo.image(agent_diagram_url("08"))
    return


@app.cell
def _(dataset_publisher_output):
    dict(dataset_publisher_output)
    return


@app.cell
def _(dataset_publisher, materialized_insights, session_id):
    dataset_publisher_output = dataset_publisher(
        materialized_insights=materialized_insights,
        session=session_id,
    )
    return (dataset_publisher_output,)


@app.cell
def _(DatasetPublisherAgent, env, lm_registry):
    dataset_publisher = DatasetPublisherAgent(
        aws_access_key_id=env["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=env["AWS_SECRET_ACCESS_KEY"],
        aws_endpoint_url=env["AWS_ENDPOINT_URL"],
        cdn_base_url=env["AWS_CDN_BASE_URL"],
        bucket=env["AWS_BUCKET"],
        langfuse=lm_registry.langfuse,
    )
    return (dataset_publisher,)


@app.cell
def _():
    from visxgenai.agents.dataset_publisher.agent import DatasetPublisherAgent

    return (DatasetPublisherAgent,)


@app.cell(column=8, hide_code=True)
def _(mo):
    mo.image(agent_diagram_url("09"))
    return


@app.cell
def _(dataset_visualizer_output):
    dict(dataset_visualizer_output)
    return


@app.cell
def _(
    dataset_visualizer,
    datset_deriver_output,
    insight_plan_tools,
    materialized_insights,
):
    dataset_visualizer_output = dataset_visualizer(
        queried_insights=datset_deriver_output.datasets,
        materialized_insights=materialized_insights,
        insight_plan_tools=insight_plan_tools,
    )
    return (dataset_visualizer_output,)


@app.cell
def _(DatasetVisualizerAgent, lm_registry):
    dataset_visualizer = DatasetVisualizerAgent(
        langfuse=lm_registry.langfuse,
    )
    return (dataset_visualizer,)


@app.cell
def _():
    from visxgenai.agents.dataset_visualizer.agent import DatasetVisualizerAgent

    return (DatasetVisualizerAgent,)


@app.cell(column=9, hide_code=True)
def _(mo):
    mo.image(agent_diagram_url("10"))
    return


@app.cell
def _(report_narrator_output):
    report_narrator_output.content
    return


@app.cell
def _(
    dataset_describer_output,
    dataset_visualizer_output,
    datset_deriver_output,
    insight_plan_tools,
    report_narrator,
):
    report_narrator_output = report_narrator(
        parent_dataset_description=dataset_describer_output.summary,
        queried_insights=datset_deriver_output.datasets,
        visualized_insights=dataset_visualizer_output.recommendations,
        insight_plan_tools=insight_plan_tools,
    )
    return (report_narrator_output,)


@app.cell
def _(DataReportNarratorAgent, lm_registry):
    report_narrator = DataReportNarratorAgent(
        init_narrator_lm=lm_registry.lm_initializer(
            "vertex_ai/gemini-2.5-pro",
            max_tokens=32_000,
        ),
        init_structurer_lm=lm_registry.lm_initializer(
            "vertex_ai/gemini-2.5-flash",
            max_tokens=32_000,
        ),
        langfuse=lm_registry.langfuse,
    )
    return (report_narrator,)


@app.cell
def _():
    from visxgenai.agents.dataset_narrator.agent import DataReportNarratorAgent

    return (DataReportNarratorAgent,)


@app.cell(column=10, hide_code=True)
def _(mo):
    mo.image(agent_diagram_url("11"))
    return


@app.cell
def _(dataset_reporter_output):
    dict(dataset_reporter_output)
    return


@app.cell
def _(dataset_reporter_output, mo):
    mo.ui.code_editor(dataset_reporter_output.nb, language="html")
    return


@app.cell
def _(
    dataset_publisher_output,
    dataset_reporter,
    dataset_visualizer_output,
    datset_deriver_output,
    materialized_insights,
    report_narrator_output,
    session_id,
):
    dataset_reporter_output = dataset_reporter(
        session=session_id,
        queried_insights=datset_deriver_output.datasets,
        materialized_insights=materialized_insights,
        visualized_insights=dataset_visualizer_output.recommendations,
        published_datasets=dataset_publisher_output.records,
        report_structure=report_narrator_output.content,
        traces={"flow": "#", "observations": {}},
    )
    return (dataset_reporter_output,)


@app.cell
def _(DatasetReporterAgent, env, lm_registry):
    dataset_reporter = DatasetReporterAgent(
        nb_builder_api_username=env["NB_BUILDER_API_USERNAME"],
        nb_builder_api_password=env["NB_BUILDER_API_PASSWORD"],
        aws_access_key_id=env["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=env["AWS_SECRET_ACCESS_KEY"],
        aws_endpoint_url=env["AWS_ENDPOINT_URL"],
        aws_bucket=env["AWS_BUCKET"],
        aws_cdn_base_url=env["AWS_CDN_BASE_URL"],
        langfuse=lm_registry.langfuse,
        api_base_url=env["NB_BUILDER_API_BASE_URL"],
    )
    return (dataset_reporter,)


@app.cell
def _():
    from visxgenai.agents.dataset_reporter.agent import DatasetReporterAgent

    return (DatasetReporterAgent,)


@app.cell
def _():
    return


@app.cell(column=11, hide_code=True)
def _(dataset_reporter_output, mo):
    mo.iframe(dataset_reporter_output.html)
    return


if __name__ == "__main__":
    app.run()
