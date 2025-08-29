from typing import TYPE_CHECKING, Literal

import dspy
import pydantic

from ...core import LMInitializer, ObservedModule, fence_object
from .utils import InsightTag, construct_dataset_context

if TYPE_CHECKING:
    from langfuse import Langfuse

AnalyticalTask = Literal[
    "value",  # Raw individual data points (no aggregation), e.g., scatter plot
    "summary",  # Aggregated data (averages, counts, rankings), e.g., bar/line chart
]


class PlannedInsight(pydantic.BaseModel):
    goal: str = pydantic.Field(
        ...,
        description="\n".join(
            (
                "Self-contained analytical question. State WHAT to show, not HOW to compute.",
                "BREADTH-FIRST: Use DIFFERENT field combinations in each insight - explore dataset widely.",
                "FIELD DIVERSITY: Combine fields creatively (duration=end-start, rate=count/time, ratio=A/B).",
                "AGGREGATION: Choose wisely - median for skewed, average for normal, mode for categorical.",
                "",
                "SUMMARY TASKS (aggregated): count/avg/median by categories, rankings, temporal trends",
                "VALUE TASKS (raw points): individual values, correlations, temporal scatter - NO aggregation",
                "",
                "SEGMENTATION MANDATE: Always use low-cardinality categorical fields for segmentation/faceting.",
                "TEMPORAL RULE: With time fields, use MAX 1 numeric measure to avoid overcrowding.",
            )
        ),
        examples=[
            # Concise examples showing diversity
            "Show median order_value by Region, faceted by CustomerType",
            "Rank top 10 categories by total revenue, segmented by Region",
            "Track monthly median processing_duration (end_time - start_time) by Priority",
            "Examine individual order values across Region segments",
            "Analyze correlation between individual price and quality_score, segmented by product_type",
            "❌ WRONG for VALUE: 'Display median response_time' - NO aggregation in value tasks",
            "❌ AVOID: 'Show overall median' - MISSING segmentation when categoricals available",
        ],
    )
    task: AnalyticalTask = pydantic.Field(
        ...,
        description="\n".join(
            (
                "'summary': AGGREGATES data (avg/median/sum/count/rank).",
                "'value': RAW individual points only - NO aggregation whatsoever.",
                "BOTH: Must leverage categorical fields for segmentation/faceting.",
            )
        ),
    )


class PlannedInsightGroup(pydantic.BaseModel):
    group_name: str = pydantic.Field(
        ...,
        description="Thematic chapter name in the data story.",
        examples=["Sales Performance Overview", "Customer Behavior Patterns"],
    )
    insights: list[PlannedInsight] = pydantic.Field(
        ...,
        description="2-3 focused insights per group. Strictly avoid orphan, single-insight groups.",
    )


class InsightPlanner(dspy.Signature):
    """
    Create a structured analytical narrative to maximally satisfy the user goal.

    If the user does not state a specific focus, then default to a broad, accessible overview of the dataset.

    THINK-FIRST, THEN-GROUND WITH HINTS (efficient usage):
    - Start by drafting your own concise plan sketch: proposed groups, candidate insights, and tentative field choices.
    - Then consult get_insight_plan_hints to validate and course-correct assumptions:
      * Initial validation: ONE call either with no tags (broad scan) or with dominant pattern tags plus "segmentation".
      * Spot-checks: At most ONCE per group when you are uncertain about field viability, aggregation choice, or segmentation suitability. Prefer tightening tags (e.g., ["correlation"], ["trend", "segmentation"]).
      * Optional final pass: ONE concise call before finalizing to sanity-check coverage and diversity.
    - Revise based on evidence from hints; if you keep an idea that conflicts with hints, briefly justify why.
    - Minimize total hint calls to keep the process concise while remaining grounded.
    - When you use hints, explicitly reference which hint(s) informed an adjustment (e.g., correlation pairs, low-cardinality segmenters).
    - Hints are advisory and not exhaustive. They surface safe/default combinations. You may also choose other combinations directly from dataset_context["fields"]. Prefer hinted options when uncertain; otherwise, briefly justify alternative choices.

    FINAL QUALITY CHECK WITH JUDGE (one-time, actionable):
    - Before finalizing, call the judge tool ONCE with the complete plan.
    - If judge returns status "REVISE", apply 1-2 minimal, high-impact edits (e.g., replace an overused field, add segmentation, fix task imbalance) and then finish without re-calling the judge.

    **🎯 BREADTH-FIRST EXPLORATION MANDATE:**
    - **CRITICAL**: Explore the ENTIRE dataset - use DIFFERENT field combinations in EVERY insight
    - **PRIMARY FIELD RULE**: Once a numeric/temporal field appears in 2 insights, avoid reusing it
    - **SEGMENTATION EXCEPTION**: Categorical fields CAN and SHOULD be reused for segmentation/faceting
    - **COVERAGE TARGET**: Touch 80%+ of available numeric/temporal fields across all insights
    - **PATTERN DIVERSITY**: Distribute insights equally across:
      * Temporal (T): time + numeric + categorical segments
      * Correlation (C): numeric vs numeric + categorical segments
      * Ranking (R): aggregated numeric by 1-2 dimensions
      * Distribution (D): numeric across categorical dimensions

    **CORE RULES:**

    1. **FIELD EXPLORATION PRIORITY:**
       - Track PRIMARY fields (numeric/temporal) - max 2 uses each
       - SEGMENTATION fields (categorical) - REUSE FREELY across all insights
       - Better to repeat categorical fields than have unsegmented visualizations
       - Create derived fields to expand coverage and add depth

    2. **CREATIVE CATEGORICAL ENGINEERING:**
       - **CREATE TIERS**: price_tier (high/medium/low), performance_tier (top/middle/bottom)
       - **BIN NUMERICS**: age_group, size_category, score_band
       - **EXTRACT FROM LISTS**: top-5 frequent tags, dominant categories, primary codes
       - **TIME BINS**: day_of_week, month, quarter, hour_of_day, weekend/weekday
       - **DERIVED CATEGORIES**: is_premium, is_delayed, is_successful, region_type
       - Use these engineered categoricals for richer segmentation

    3. **VALUE TASK DIMENSIONAL REQUIREMENTS:**
       - **MINIMUM**: 2 dimensions (e.g., X axis + color/segment)
       - **PREFERRED**: 3+ dimensions (e.g., X + Y + color + facet)
       - **EXAMPLES**:
         * "Individual price vs quality, colored by product_tier, faceted by region"
         * "Each transaction amount over time, segmented by customer_segment, faceted by is_premium"
         * "Individual processing_duration by department, colored by priority_level, faceted by day_of_week"
       - MORE dimensions = RICHER insights (avoid flat, unsegmented scatter plots)

    4. **SMART COMBINATIONS:**
       - Combine related fields: duration(end-start), rate(count/time), efficiency(output/input)
       - Engineer meaningful ratios and percentages
       - Each insight reveals something DIFFERENT about the data

    5. **TASK BALANCE:**
       - Maintain ~50/50 mix of 'summary' (aggregated) and 'value' (raw) tasks
       - Summary: MUST aggregate (median/avg/sum/count)
       - Value: NO aggregation - raw points with MULTIPLE dimensions

    6. **SEGMENTATION IMPERATIVE:**
       - **ALWAYS segment/facet** - unsegmented insights are wasted opportunities
       - **REUSE IS GOOD**: Same categorical can segment multiple insights
       - **LAYER DIMENSIONS**: segment + facet + color > segment only
       - **VALUE TASKS ESPECIALLY**: Need 2+ categorical dimensions for clarity

    7. **AGGREGATION SELECTION:**
       - Check dataset_context for distribution hints
       - Skewed → median; Normal → average; Counts → sum
       - State aggregation choice explicitly

    8. **CRITICAL RANKING METRICS:**
       - **THINK AS EXPERT**: Question surface-level metrics - quantity ≠ quality
       - **MEANINGFUL MEASURES**: revenue > transaction_count, efficiency > raw_volume
       - **CONTEXTUAL RANKINGS**: customer_lifetime_value > single_purchase_amount
       - **RATIO-BASED**: profit_margin, success_rate, performance_per_resource
       - **AVOID NAIVE**: Don't rank by simple counts when better metrics exist
       - **DOMAIN WISDOM**: What would an industry expert find most revealing?

    9. **QUALITY STANDARDS:**
       - Each insight is atomic and self-contained
       - NO dull insights without segmentation context
       - CREATE derived metrics and contrarian questions
       - EXPLOIT list fields and high-cardinality fields creatively

    **FIELD DIVERSITY SCORECARD:**
    ✓ Different PRIMARY (numeric/temporal) fields in each insight
    ✓ Maximum 2 uses per PRIMARY field total
    ✓ Categorical fields REUSED across many insights for segmentation
    ✓ Engineered categorical fields created for richer analysis
    ✓ VALUE tasks have 2+ dimensions ALWAYS, 3+ when possible
    ✓ 80%+ of numeric/temporal fields explored
    """

    user_goal: str = dspy.InputField(
        desc="High-level analysis goal from the user. Always takes precedence over all other instructions."
    )
    insight_count_target: str = dspy.InputField(
        desc="Target total insights, balanced across types"
    )
    dataset_context: str = dspy.InputField(
        desc="JSON: title, fields, descriptions, distribution/correlation hints"
    )
    plan: list[PlannedInsightGroup] = dspy.OutputField(
        desc="\n".join(
            (
                "Insight groups with MAXIMUM FIELD DIVERSITY:",
                "- BREADTH: Different numeric/temporal fields in every insight",
                "- SEGMENTATION REUSE: Same categoricals used across many insights",
                "- ENGINEERED CATEGORIES: Create tiers, bins, groups for richer segmentation",
                "- VALUE TASK DIMENSIONS: Always 2+, preferably 3+ dimensions",
                "- FULL COVERAGE: 80%+ of numeric/temporal fields explored",
                "- PATTERN BALANCE: Equal Temporal/Correlation/Ranking/Distribution mix",
            )
        )
    )


class InsightPlanJudge(dspy.Signature):
    """
    Evaluate plan quality and return concise, actionable guidance.

    Return a compact JSON object with fields:
    - status: "ACCEPTABLE" | "REVISE"
    - issues: list of strings highlighting only severe problems
    - fix_suggestions: up to 3 concrete, minimal edits to improve breadth and quality

    Severe issues to check:
    1. NO BREADTH: <50% of available numeric/temporal fields explored
    2. TASK IMBALANCE: Worse than 80/20 summary/value ratio
    3. MISSING SEGMENTATION: Categorical fields exist but plan ignores segmentation/faceting
    4. PATTERN MONOTONY: >=80% insights use the same analytical pattern
    5. ZERO CREATIVITY: No derived fields/ratios or interesting combinations
    6. TASK VIOLATIONS: Value tasks aggregate or summary tasks omit aggregation

    Be lenient: minor imperfections are fine; only request REVISE if clear improvements are needed.
    """

    user_goal: str = dspy.InputField(
        desc="High-level analysis goal from the user. Same as in InsightPlanner. Always takes precedence over all other instructions."
    )
    plan: str = dspy.InputField(desc="Draft plan with groups and insights")
    hints: str = dspy.InputField(
        desc="JSON with dataset hints for field diversity and statistical grounding"
    )
    evaluation: str = dspy.OutputField(
        desc='JSON: {"status": "ACCEPTABLE"|"REVISE", "issues": [...], "fix_suggestions": [...]}'
    )


class InsightPlannerAgent(ObservedModule):
    def __init__(
        self,
        init_planner_lm: LMInitializer,
        init_judge_lm: LMInitializer,
        langfuse: "Langfuse",
        max_iters: int = 5,
    ):
        super().__init__(langfuse=langfuse)
        self.init_planner_lm = init_planner_lm
        self.init_judge_lm = init_judge_lm
        self.max_iters = max_iters

        self.judge = self.make_module_observed(dspy.Predict(InsightPlanJudge))

    def _forward(
        self,
        *,
        dataset_title: str,
        dataset_description: str,
        field_descriptions: dict[str, str],
        dataset_profile: dict,
        user_goal: str = "I want an accessible, interesting report on the dataset.",
        insight_count_target: str = "At most 7 insights, balanced across types",
    ) -> dspy.Prediction:
        dataset_context = construct_dataset_context(
            dataset_title=dataset_title,
            dataset_description=dataset_description,
            field_descriptions=field_descriptions,
            dataset_profile=dataset_profile,  # type: ignore
        )
        dataset_context_str = fence_object(dataset_context)

        def get_insight_plan_hints(
            relevant_tags: InsightTag | list[InsightTag] | None = None,
        ) -> str:
            """Ground your plan with dataset-derived hints. THINK FIRST, THEN VALIDATE.

            Primary purposes:
            1. Identify suitable fields for a given analytical pattern (trend/correlation/ranking/distribution) and for segmentation/faceting.
            2. Verify statistical soundness (e.g., use actual correlated pairs, choose low-cardinality segmenters, avoid skew pitfalls).
            3. Expand coverage and creativity by surfacing interesting fields (lists, temporal, evenly distributed numerics) and sensible combinations.

            Usage guidance (keep calls minimal):
            - Initial validation: one broad call with no tags OR a targeted call using dominant pattern tags plus "segmentation".
            - Spot-checks: at most once per group when uncertain about field viability, aggregation, or segmentation; prefer focused tags.
              Examples: ["trend", "segmentation"], ["correlation", "value-task"], ["ranking", "summary-task"].
            - Optional final pass: one concise call before finalizing to sanity-check coverage/diversity.
            - If unsure, prefer a quick targeted call over guessing; otherwise avoid excessive calls to keep the process efficient.

            Args:
                relevant_tags: Optional tag or list of tags to filter hints. Recognized tags include
                  "trend", "comparison", "distribution", "correlation", "ranking", "segmentation",
                  "exploration", "value-task", "summary-task".

            Returns:
                JSON array of hint objects. Treat these as advisory "safe" options grounded in the dataset profile. You are allowed to use other
                combinations from dataset_context["fields"]. Prefer hints when uncertain; otherwise provide a brief rationale for alternative choices.
            """
            hints = dataset_context["hints"]
            if not relevant_tags:
                return fence_object(hints)

            tags = [relevant_tags] if isinstance(relevant_tags, str) else relevant_tags
            # Always include non-negotiable hints
            tags += ["non-negotiable"]
            filtered_hints = [
                hint for hint in hints if any(tag in hint["tags"] for tag in tags)
            ]
            return fence_object(filtered_hints)

        def judge_plan_before_finish(plan: str) -> str:
            """One-time, actionable quality check.

            Call ONCE with the complete plan to get a compact JSON verdict with optional
            "issues" and "fix_suggestions". Apply at most 1-2 minimal edits if status is
            "REVISE" and then finalize without re-calling.
            """
            with dspy.context(lm=self.init_judge_lm()):
                result = self.judge(
                    plan=plan,
                    hints=dataset_context["hints"],
                    user_goal=user_goal,
                )
            return result.evaluation  # type: ignore

        planner = self.make_module_observed(
            dspy.ReAct(
                InsightPlanner,
                tools=[
                    dspy.Tool(get_insight_plan_hints),
                    dspy.Tool(judge_plan_before_finish),
                ],
                max_iters=self.max_iters,
            )
        )

        with dspy.context(
            lm=self.init_planner_lm(),
        ):
            result = planner(  # type: ignore
                user_goal=user_goal,
                insight_count_target=insight_count_target,
                dataset_context=dataset_context_str,
            )

        return result  # type: ignore
