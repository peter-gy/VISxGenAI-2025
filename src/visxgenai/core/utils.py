import re
from typing import Any

import orjson


def fence_block(block: str, lang: str) -> str:
    """Wrap a block of code in fenced code block syntax."""
    return f"```{lang}\n{block}\n```"


def fence_object(obj: Any) -> str:
    """Convert a dictionary to a fenced code block."""
    try:
        lang = "json"
        block = orjson.dumps(obj, option=orjson.OPT_INDENT_2).decode("utf-8")
    except orjson.JSONEncodeError:
        lang = "text"
        block = str(obj)

    return fence_block(block, lang)


def extract_fenced_content(fenced_string: str, lang: str) -> str:
    """
    Extract the first code block content of the given language from the string.
    If no matching fenced code block is found, return the original string.
    """
    # Regex for code fence with optional space after the opening fence and before language
    # and to capture the content inside the fence in a non-greedy way
    # (?s) makes '.' match newline as well
    pattern = rf"(?s)```(?:\s*){re.escape(lang)}\s*\n(.*?)\n?```"
    match = re.search(pattern, fenced_string)
    if match:
        return match.group(1).rstrip("\n")
    return fenced_string
