import logging
from typing import Any

import dspy
from typing_extensions import TypedDict

from ..insight_planner.tools import InsightPlanTools

logger = logging.getLogger(__name__)


class Observation(TypedDict):
    trace_id: str
    observation_id: str


class OrganizedTrace(TypedDict):
    dataset: Observation
    visualization: Observation


def _index_by_goal(items: list[dict]) -> dict[str, dict]:
    return {goal: item for item in items if (goal := item.get("goal")) is not None}


def organize_traces(
    field_refiner_output: dspy.Prediction,
    dataset_describer_output: dspy.Prediction,
    field_expander_output: dspy.Prediction,
    dataset_profiler_output: dspy.Prediction,
    insight_planner_output: dspy.Prediction,
    dataset_deriver_output: dspy.Prediction,
    dataset_publisher_output: dspy.Prediction,
    dataset_visualizer_output: dspy.Prediction,
    report_narrator_output: dspy.Prediction,
    insight_plan_tools: InsightPlanTools,
) -> dict[str, OrganizedTrace]:
    datasets_by_goal = _index_by_goal(dataset_deriver_output.datasets)
    visualizations_by_goal = _index_by_goal(dataset_visualizer_output.recommendations)

    results: dict[str, OrganizedTrace] = {}
    for goal in insight_plan_tools.list_goals():
        if goal not in datasets_by_goal:
            logging.warning(f"No dataset found for goal: {goal}")
            continue

        if goal not in visualizations_by_goal:
            logging.warning(f"No visualization found for goal: {goal}")
            continue

        organized_trace = {
            "dataset": datasets_by_goal[goal]["__metadata__"],
            "visualization": visualizations_by_goal[goal]["__metadata__"],
        }
        results[goal] = organized_trace

    return results


def organize_provenance(
    dataset_uri: str,
    field_refiner_output: dspy.Prediction,
    field_expander_output: dspy.Prediction,
    dataset_deriver_output: dspy.Prediction,
    insight_plan_tools: InsightPlanTools,
) -> dict[str, Any]:
    queries_by_goal = _index_by_goal(
        [q for q in dataset_deriver_output.queries if q["success"]]
    )

    results: dict[str, Any] = {
        "dataset_uri": dataset_uri,
        "field_refinements": field_refiner_output.refinements,
        "field_expansions": field_expander_output.expansions,
        "goals": {},
    }
    for goal in insight_plan_tools.list_goals():
        if goal not in queries_by_goal:
            logging.warning(f"No successful query found for goal: {goal}")
            continue

        query = queries_by_goal[goal]["query"]
        organized_provenance = {
            "goal": goal,
            "sql": query["sql"],
            "fields": query["provenance"].model_dump(),
        }
        results["goals"][goal] = organized_provenance

    return results
