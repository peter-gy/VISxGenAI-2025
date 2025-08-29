from .agent import PlannedInsight, PlannedInsightGroup


class InsightPlanTools:
    def __init__(self, plan: list[PlannedInsightGroup]):
        self.plan = plan

    def list_insights(self) -> list[PlannedInsight]:
        return [insight for group in self.plan for insight in group.insights]

    def find_group_name_of_goal(self, goal: str) -> str:
        for insight_group in self.plan:
            for insight in insight_group.insights:
                if insight.goal == goal:
                    return insight_group.group_name

        raise ValueError(f"Insight with goal '{goal}' not found in the plan.")

    def find_insight_by_goal(self, goal: str) -> PlannedInsight:
        for insight_group in self.plan:
            for insight in insight_group.insights:
                if insight.goal == goal:
                    return insight

        raise ValueError(f"Insight with goal '{goal}' not found in the plan.")

    def list_goals(self) -> list[str]:
        goals: list[str] = []
        for insight_group in self.plan:
            for insight in insight_group.insights:
                if insight.goal not in goals:
                    goals.append(insight.goal)

        return goals
