import base64
from pathlib import Path


def read_provenance_nb_template_into_base64() -> str:
    template_file = Path(__file__).parent / "notebook-template.py"
    template = template_file.read_text()
    return base64.b64encode(template.encode()).decode()
