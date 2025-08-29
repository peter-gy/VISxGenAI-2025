import io
from typing import Literal

import altair as alt
import draco as drc
import PIL.Image
import polars as pl

from .agent import FieldWithRole


def altair_chart_to_image(chart: alt.Chart, **kwargs) -> PIL.Image.Image:
    buf = io.BytesIO()
    chart.save(buf, format="png", **kwargs)
    buf.seek(0)
    return PIL.Image.open(buf)


def construct_draco_program(
    df: pl.DataFrame,
    fields: list[FieldWithRole],
    task: Literal["summary", "value"],
) -> list[str]:
    data_schema_dict = drc.schema_from_dataframe(df)  # type: ignore
    data_schema_facts = drc.dict_to_facts(data_schema_dict)
    base_facts = [
        *data_schema_facts,
        "entity(view,root,v0).",
        "entity(mark,v0,m0).",
    ]
    required_fields = [field.name for field in fields if field.role != "detail"]
    field_requires = [f"require(field, {field})." for field in required_fields]

    # If the `task` is summary, we already have pre-aggregated data. Therefore, we forbid Draco to aggregate aggregates
    forbids = ["forbid(aggregate)."] if task == "summary" else []

    return [
        *base_facts,
        f"attribute(task,root,{task}).",
        *field_requires,
        *forbids,
    ]
