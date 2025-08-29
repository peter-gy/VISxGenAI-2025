class BlockBuilder:
    def __init__(self, counter_start: int = 1):
        self._blocks = []
        self._counter = counter_start

    def append(self, block: str):
        self._blocks.append(block)
        self._counter += 1
        return self

    def block(self, type: str, *text: str):
        return self.append(ojs_block(id=self._counter, type=type, text="\n".join(text)))

    def md(self, *text: str):
        return self.block("text/markdown", *text)

    def html(self, *text: str):
        return self.block("text/html", *text)

    def js(self, *text: str):
        return self.block("module", *text)

    @property
    def counter(self) -> int:
        return self._counter

    @property
    def blocks(self) -> list[str]:
        return self._blocks

    def build(self) -> str:
        return "\n".join(self._blocks)


def indent_lines(text: str, num_spaces: int = 4):
    prefix = " " * num_spaces
    return "\n".join(prefix + line for line in text.splitlines())


def ojs_block(id: int, type: str, text: str) -> str:
    lines = [
        f"""<script id="{id}" type="{type}">""",
        indent_lines(text, num_spaces=2),
        "</script>",
    ]
    return "\n".join(lines)


def create_ojs_notebook(
    title: str,
    blocks: list[str],
    theme="air",
) -> str:
    children = [
        f"<title>{title}</title>",
        *blocks,
    ]
    lines = [
        "<!doctype html>",
        f'<notebook theme="{theme}">',
        indent_lines("\n".join(children), 2),
        "</notebook>",
    ]
    return "\n".join(lines)
