import itertools
import logging
from types import SimpleNamespace
from typing import TYPE_CHECKING, Literal

import altair as alt
import draco
import dspy
import polars as pl
from draco.dracox import DracoExpress

from ...core import ObservedModule, run_module_async
from ..insight_planner.tools import InsightPlanTools

if TYPE_CHECKING:
    from langfuse import Langfuse

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def create_recommender_inputs(
    queried_insights: list[dict],
    materialized_insights: list[dict],
    insight_plan_tools: InsightPlanTools,
) -> list[dspy.Example]:
    inputs: list[dspy.Example] = []
    for queried_insight, materialized_insight in zip(
        queried_insights,
        materialized_insights,
    ):
        assert materialized_insight["goal"] == queried_insight["goal"], (
            "Goals must match for queried and materialized insights."
        )
        goal = materialized_insight["goal"]
        insight = insight_plan_tools.find_insight_by_goal(goal)
        input = dspy.Example(
            goal=goal,
            df=materialized_insight["dataset"],
            fields=queried_insight["provenance"].fields,
            task=insight.task,
        ).with_inputs(
            "df",
            "fields",
            "task",
        )
        inputs.append(input)
    return inputs


class DatasetVisualizerAgent(ObservedModule):
    def __init__(
        self,
        langfuse: "Langfuse",
        draco: draco.Draco = draco.Draco(),
    ):
        super().__init__(langfuse=langfuse)
        self.draco = draco
        self.recommender = self.make_module_observed(
            VisualizationRecommenderAgent(draco=draco)
        )

    def _forward(
        self,
        *,
        queried_insights: list[dict],
        materialized_insights: list[dict],
        insight_plan_tools: InsightPlanTools,
    ) -> dspy.Prediction:
        inputs = create_recommender_inputs(
            queried_insights,
            materialized_insights,
            insight_plan_tools,
        )
        results = run_module_async(self.recommender, inputs)

        recommendations = [
            {
                "goal": input["goal"],
                **dict(result),
            }
            for input, result in zip(inputs, results)
            if result["image"] is not None
        ]

        return dspy.Prediction(recommendations=recommendations)


class FieldWithRole(SimpleNamespace):
    name: str
    label: str
    role: str


class VisualizationRecommenderAgent(dspy.Module):
    def __init__(self, draco: draco.Draco = draco.Draco()):
        super().__init__()
        self.draco = draco

    def forward(
        self,
        *,
        df: pl.DataFrame,
        fields: list[FieldWithRole],
        task: Literal["summary", "value"],
        models: int = 3,
        top_k: int = 3,
    ) -> dspy.Prediction:
        from .utils import altair_chart_to_image, construct_draco_program

        try:
            drx = DracoExpress(draco=self.draco)
            program = construct_draco_program(df, fields, task)  # type: ignore
            candidates = list(drx.complete_spec(program, models=models))

            # Multiple specs per same cost can occur, so we group by cost and take the top n
            groups = [
                (key, list(group))
                for key, group in itertools.groupby(candidates, lambda spec: spec.cost)
            ]

            top_candidates = list(groups[0][1])[:top_k]
            optimal_spec = top_candidates[0]
            chart = optimal_spec.render(
                df=df,  # type: ignore
                label_mapping={field.name: field.label for field in fields},
            )

            # Adjust the chart to make labels more readable for downstream agents
            if not isinstance(chart, alt.FacetChart):
                chart = chart.properties(width=800).configure_axis(
                    labelFontSize=7,  # Decreased font size to avoid truncated text
                )

            image = altair_chart_to_image(chart, scale_factor=1.0)

            return dspy.Prediction(
                draco_program="\n".join(program),
                draco_completion=optimal_spec,
                image=image,
            )
        except Exception as e:
            import traceback

            logger.error(f"Error generating visualization: {e}")
            logger.error(traceback.format_exc())
            return dspy.Prediction(
                draco_program=None,
                draco_completion=None,
                image=None,
            )
