import dspy
import pydantic

from ...core import LMInitializer


class SuggestedField(pydantic.BaseModel):
    """A suggested field with its name and description."""

    name: str = pydantic.Field(..., description="Field name in snake_case")
    purpose: str = pydantic.Field(
        ..., description="Why this field matters in one sentence"
    )
    derivation: str = pydantic.Field(
        ...,
        description="Derivation logic in strictly natural language, no code or formulas",
        examples=[
            "Time difference between end_time and start_time",
            "Success rate as success_count divided by total_count",
            "Number of items in tags list",
            "Most common value in categories list",
            "Customer tier based on total_spent: over 10000 is platinum, 5000-10000 is gold, 1000-5000 is silver, under 1000 is bronze",
        ],
    )
    insight: str = pydantic.Field(
        ..., description="Key pattern revealed (10 words max)"
    )


class FieldSuggester(dspy.Signature):
    """Suggest 3-5 derived fields that reveal hidden patterns in the data."""

    base_fields: list[dict] = dspy.InputField(desc="Existing dataset fields")
    suggested_fields: list[SuggestedField] = dspy.OutputField(
        desc=(
            "3-5 HIGH-IMPACT derived fields. \n"
            "\n"
            "FOCUS ON: \n"
            "1. Time durations: difference between end and start times \n"
            "2. Rates/ratios: success count divided by total count \n"
            "3. List insights: count of items, most frequent value, unique count \n"
            "4. Segmentation: create meaningful categories based on thresholds \n"
            "5. Business metrics: profit margin as profit divided by revenue \n"
            "\n"
            "SKIP: \n"
            "- Obvious calculations (price times quantity) \n"
            "- Simple formatting (uppercase, date strings) \n"
            "- Fields that don't enable new analysis \n"
            "\n"
            "TEST: Would an analyst say 'I never thought to look at it that way'?"
        )
    )


class FieldSuggesterAgent(dspy.Module):
    def __init__(self, init_lm: LMInitializer):
        super().__init__()
        self.init_lm = init_lm
        self.field_suggestor = dspy.Predict(FieldSuggester)

    def forward(self, *, base_fields: list[dict]) -> dspy.Prediction:
        with dspy.context(lm=self.init_lm()):
            result = self.field_suggestor(base_fields=base_fields)
        return result  # type: ignore

    @classmethod
    def as_tool(cls, init_lm: LMInitializer, base_fields: list[dict]) -> dspy.Tool:
        def suggest_derived_fields() -> list[SuggestedField]:
            """START HERE: Suggests derived fields that unlock hidden insights, especially from list/array fields."""
            agent = cls(init_lm=init_lm)
            prediction = agent.forward(base_fields=base_fields)
            return prediction.suggested_fields

        return dspy.Tool(func=suggest_derived_fields)
