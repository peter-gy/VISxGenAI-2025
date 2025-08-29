from types import SimpleNamespace


class LabeledField(SimpleNamespace):
    label: str
    description: str


class ViewProvenance(SimpleNamespace):
    fields: list[LabeledField]
    summary: str


def create_field_description(field: LabeledField) -> str:
    return "\n".join(
        [
            f"### {field.label}",
            field.description,
        ]
    )


def create_visualized_data_description(
    parent_dataset_description: str,
    provenance: ViewProvenance,
) -> str:
    return "\n\n".join(
        [
            "# Parent Dataset",
            parent_dataset_description,
            "## Visualized Dataset",
            provenance.summary,
            "## Visualized Fields",
            *[create_field_description(field) for field in provenance.fields],
        ]
    )
