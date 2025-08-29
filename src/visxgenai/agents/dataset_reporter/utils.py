import string
from pathlib import Path

import orjson
from draco.renderer import AltairRenderer

from ...notebook_kit import BlockBuilder, create_ojs_notebook
from ...provenance import read_provenance_nb_template_into_base64


def _find_by_goal(items: list[dict], goal: str) -> dict | None:
    """Find an item in a list by its 'goal' key."""
    return next((item for item in items if item["goal"] == goal), None)


def collect_report_components(
    queried_insights: list[dict],
    materialized_insights: list[dict],
    visualized_insights: list[dict],
    published_datasets: list[dict],
    report_structure: dict,
) -> dict:
    i = 0
    updated_main_sections = []
    for main_section in report_structure["sections"]:
        updated_sub_sections = []
        for sub_section in main_section["sections"]:
            visualized_insight = visualized_insights[i]
            goal = visualized_insight["goal"]

            queried_insight = _find_by_goal(queried_insights, goal)
            materialized_insight = _find_by_goal(materialized_insights, goal)
            published_dataset = _find_by_goal(published_datasets, goal)

            assert queried_insight is not None, (
                f"Queried insight not found for goal: {goal}"
            )
            assert materialized_insight is not None, (
                f"Materialized insight not found for goal: {goal}"
            )
            assert published_dataset is not None, (
                f"Published dataset not found for goal: {goal}"
            )
            i += 1

            # Use Draco's renderer to convert Draco spec to Vega-Lite
            df = materialized_insight["dataset"]
            provenance = queried_insight["provenance"]
            field_label_map = {field.name: field.label for field in provenance.fields}
            draco_completion = visualized_insight["draco_completion"]
            altair_renderer = AltairRenderer(mark_config={"line": {"point": True}})
            chart = draco_completion.render(df, field_label_map, altair_renderer)

            # Prepare Vega-Lite spec for the Observable notebook
            vegalite = chart.to_dict()
            del vegalite["datasets"]
            vegalite["$schema"] = "https://vega.github.io/schema/vega-lite/v6.1.0.json"
            vegalite["data"]["name"] = published_dataset["dataset_name"]

            visualization = {
                "draco": draco_completion.spec,
                "vegalite": vegalite,
            }
            dataset = {
                "name": published_dataset["dataset_name"],
                "url": published_dataset["dataset_url"],
                "sql": materialized_insight["sql"],
                "provenance": provenance.model_dump(),
            }
            updated_sub_section = {
                "goal": queried_insight["goal"],
                "title": sub_section["title"],
                "content": sub_section["content"],
                "dataset": dataset,
                "visualization": visualization,
            }
            updated_sub_sections.append(updated_sub_section)

        # After processing all sub-sections, update the main section
        updated_main_section = {
            "title": main_section["title"],
            "intro": main_section["intro"],
            "sections": updated_sub_sections,
        }
        updated_main_sections.append(updated_main_section)

    return {
        "title": report_structure["title"],
        "intro": report_structure["intro"],
        "sections": updated_main_sections,
        "conclusion": report_structure["conclusion"],
    }


def construct_subsection_widgets_module(
    goal: str,
    dataset_name: str,
    dataset_url: str,
    vegalite_spec: dict,
    provenance: dict,
) -> str:
    table_var = f"{dataset_name}_table"
    table_metadata_var = f"{dataset_name}_metadata"
    table_metadata_value = {"goal": goal} | provenance
    url_var = f"{dataset_name}_url"
    vegalite_spec_var = f"{dataset_name}_vegalite"
    mosaic_clients_var = f"{dataset_name}_clients"
    loading_skeleton_var = f"{dataset_name}_loading_skeleton"
    provenance_nb_link_var = f"{dataset_name}_provenance_nb_link"

    lines = [
        "// Declare metadata variables",
        f"const {table_metadata_var} = {orjson.dumps(table_metadata_value, option=orjson.OPT_INDENT_2).decode()}",
        f"const {vegalite_spec_var} = {orjson.dumps(vegalite_spec, option=orjson.OPT_INDENT_2).decode()}",
        "",
        "// Register field provenance tooltips",
        f"registerDataFieldTooltips(document.querySelectorAll('#subsection-{dataset_name} .data-field'), {table_metadata_var}.fields)",
        "",
        "// Set href of provenance notebook link",
        f"const {provenance_nb_link_var} = document.getElementById('provenance-nb-link-{dataset_name}')",
        f"{provenance_nb_link_var} && {provenance_nb_link_var}.setAttribute('href', constructProvenanceNotebookUrl(provenanceNotebookTemplate, {table_metadata_var}.goal, {vegalite_spec_var}))",
        "",
        "// Register Dataset",
        f'const {table_var} = "{dataset_name}"',
        f'const {url_var} = "{dataset_url}"',
        f"await registerDataset(db, {table_var}, {url_var})",
        "",
        "// Initialize Mosaic Clients",
        string.Template(
            "const $mosaic_clients_var = await datatableWithView({table: $table_var, spec: $vegalite_spec_var, metadata: $table_metadata_var, coordinator})"
        ).substitute(
            mosaic_clients_var=mosaic_clients_var,
            table_var=table_var,
            vegalite_spec_var=vegalite_spec_var,
            table_metadata_var=table_metadata_var,
        ),
        "",
        "// Display Mosaic Clients",
        f"display(getVegaViewNode({mosaic_clients_var}.viewClient))",
        f"display(getDataTableNode({mosaic_clients_var}.tableClient))",
        "",
        "// Remove loading skeleton after nodes are displayed",
        f"const {loading_skeleton_var} = document.getElementById('loading-skeleton-{dataset_name}')",
        f"{loading_skeleton_var} && {loading_skeleton_var}.remove()",
    ]
    return "\n".join(lines)


def report_components_to_notebook(
    report_components: dict,
    traces: dict | None = None,
    theme: str = "air",
) -> str:
    title = report_components["title"]
    intro = report_components["intro"]
    builder = BlockBuilder()

    OJS_LIB_JS = (Path(__file__).parent / "ojs-lib.js").read_text()
    OJS_LIB_CSS = (Path(__file__).parent / "ojs-lib.css").read_text()

    # Set top-level <style> tag for the notebook
    builder = builder.html(
        "<style>",
        OJS_LIB_CSS,
        "</style>",
    )

    # Header in styleable tag
    builder = builder.html(
        f"""
        <div class="report-header">
            <h1>{title}</h1>
            <div class="artifacts-links">
            <a id="full-report-link" 
                href="./index.html" 
                target="_blank" 
                data-tippy-content="Open fullscreen report in new tab">
                <i data-lucide="expand"></i>
                <span>Open Fullscreen</span>
            </a>
                {
            f'''
                <a href="{traces["flow"]}?display=timeline" 
                   target="_blank" 
                   data-tippy-content="View AI agent execution traces for generating this report">
                    <i data-lucide="bot"></i>
                    <span>Agent Traces</span>
                </a>
                '''
            if traces
            else ""
        }
                <a href="./artifacts/notebook.html" 
                   download 
                   data-tippy-content="Download Observable Notebook 2.0 source code of this report">
                    <i data-lucide="file-down"></i>
                    <span>Notebook</span>
                </a>
                <a href="./artifacts/history.json" 
                   download 
                   data-tippy-content="Download AI conversation logs of this report">
                    <i data-lucide="messages-square"></i>
                    <span>AI Chat Logs</span>
                </a>
                <a href="https://peter-gy.github.io/VISxGenAI-2025/" 
                   target="_blank" 
                   data-tippy-content="Browse gallery of other reports and get to know more about this system">
                    <i data-lucide="external-link"></i>
                    <span>Explore System</span>
                </a>
                <a href="./artifacts/provenance.json" 
                   id="provenance-json"
                   style="display: none;">
                </a>
            </div>
            <p>{intro}</p>
            <aside class="js-toc"></aside>
        </div>
        """,
    )

    for main_section in report_components["sections"]:
        main_section_title = main_section["title"]
        main_section_intro = main_section["intro"]
        builder = builder.md(f"## {main_section_title}").md(main_section_intro)
        for subsection in main_section["sections"]:
            subsection_goal = subsection["goal"]
            subsection_title = subsection["title"]
            subsection_content = subsection["content"]

            dataset_name = subsection["dataset"]["name"]
            module = construct_subsection_widgets_module(
                goal=subsection_goal,
                dataset_name=dataset_name,
                dataset_url=subsection["dataset"]["url"],
                vegalite_spec=subsection["visualization"]["vegalite"],
                provenance=subsection["dataset"]["provenance"],
            )

            def trace_links() -> str:
                if (
                    not traces
                    or not (traces_base_url := traces.get("flow"))
                    or not (
                        traced_observations := traces.get("observations", {}).get(
                            subsection_goal
                        )
                    )
                ):
                    return ""

                dataset_observation_id = traced_observations["dataset"][
                    "observation_id"
                ]
                dataset_traces_href = f"{traces_base_url}?display=timeline&observation={dataset_observation_id}"

                vis_observation_id = traced_observations["visualization"][
                    "observation_id"
                ]
                vis_traces_href = f"{traces_base_url}?display=timeline&observation={vis_observation_id}"

                return f"""
                <a href="{dataset_traces_href}" 
                    data-tippy-content="Dataset traces"
                    target="_blank">
                    <i class="icon" data-lucide="database"></i>
                </a>
                <a href="{vis_traces_href}" 
                    data-tippy-content="Visualization traces"
                    target="_blank">
                    <i class="icon" data-lucide="chart-column-increasing"></i>
                </a>
                """

            builder = (
                builder.html(
                    f"""
                    <div class="subsection-header">
                        <h3>{subsection_title}</h3>
                        <div class="trace-links">
                            <a id="provenance-nb-link-{dataset_name}" 
                               href="#"
                               data-tippy-content="Explore provenance interactively"
                               target="_blank">
                                <i class="icon" data-lucide="chart-gantt"></i>
                            </a>
                            {trace_links()}
                        </div>
                    </div>
                    """
                )
                .html(f'<p id="subsection-{dataset_name}">{subsection_content}</p>')
                .html(
                    f'<div id="loading-skeleton-{dataset_name}"><div class="loading-skeleton" /></div>'
                )
                .js(module)
            )

    conclusion = report_components["conclusion"]

    builder = (
        builder.md("---")
        .md(conclusion)
        .js(OJS_LIB_JS)
        .js(
            "// The per-paragraph provenance notebooks will be based on this template",
            f"const provenanceNotebookTemplateBase64 = '{read_provenance_nb_template_into_base64()}'",
            "const provenanceNotebookTemplate = atob(provenanceNotebookTemplateBase64)",
        )
        .js("const uiInitResult = initializeReportUI()")
    )

    return create_ojs_notebook(
        title=title,
        blocks=builder.blocks,
        theme=theme,
    )


def make_relative_assets_absolute(html: str, base_url: str) -> str:
    return (
        html.replace(
            "./assets",
            f"{base_url}/assets",  # produced by Observable notebook build
        )
        .replace(
            "./artifacts",
            f"{base_url}/artifacts",  # produced throughout the agentic process
        )
        .replace(
            'href="./',
            f'href="{base_url}/',  # all relative links
        )
    )
