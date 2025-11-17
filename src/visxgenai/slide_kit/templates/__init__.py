import pathlib
from typing import Literal

from pptx import Presentation

SupportedTemplate = Literal["mckinsey"]


def load_slide_template(name: SupportedTemplate) -> Presentation:
    path = pathlib.Path(__file__).parent / f"{name}.pptx"
    if not path.exists():
        raise ValueError(f"Template '{name}' not found.")

    return Presentation(path)
