import logging
import pathlib

logger = logging.getLogger(__name__)
logging.basicConfig()
logger.setLevel(logging.DEBUG)

"""Modifies source code of already generated artifacts to pin versions of dependencies."""

CONFIG = {
    "@uwdata/vgplot": "0.18.0",
    "anchor-js": "5.0.0",
    "lz-string": "1.5.0",
    "tippy.js": "6.3.7",
    "tocbot": "4.36.4",
    "vega": "6.1.2",
    "vega-embed": "7.0.2",
    "vega-loader-arrow": "0.3.2",
    "vega-lite": "6.2.0",
    "vega-lite-api": "5.6.0",
}


def notebook_src_with_pinned_versions(notebook_src: str) -> str:
    """E.g. "npm:@uwdata/vgplot" -> "npm:@uwdata/vgplot@0.18.0" in observables notebooks."""
    for pkg, version in CONFIG.items():
        # Only replace if version is not already pinned
        unpinned_pattern = f"npm:{pkg}"
        if unpinned_pattern in notebook_src and f"npm:{pkg}@" not in notebook_src:
            notebook_src = notebook_src.replace(
                unpinned_pattern, f"npm:{pkg}@{version}"
            )

    return notebook_src


def js_src_with_pinned_versions(js_src: str) -> str:
    """e.g. "https://cdn.jsdelivr.net/npm/vega/+esm" -> "https://cdn.jsdelivr.net/npm/vega@6.1.2/+esm" in JS files."""
    for pkg, version in CONFIG.items():
        # Only replace if version is not already pinned
        unpinned_pattern = f"https://cdn.jsdelivr.net/npm/{pkg}/+esm"
        if (
            unpinned_pattern in js_src
            and f"https://cdn.jsdelivr.net/npm/{pkg}@{version}/+esm" not in js_src
        ):
            js_src = js_src.replace(
                unpinned_pattern, f"https://cdn.jsdelivr.net/npm/{pkg}@{version}/+esm"
            )

    return js_src


def pin_all_versions(report_root: pathlib.Path):
    notebook_file = report_root / "artifacts" / "notebook.html"
    js_files = report_root.glob("assets/*.js")

    # Pin versions in the notebook
    notebook_src = notebook_src_with_pinned_versions(notebook_file.read_text())
    notebook_file.write_text(notebook_src)

    # Pin versions in the JS files
    for js_file in js_files:
        js_file.write_text(js_src_with_pinned_versions(js_file.read_text()))


if __name__ == "__main__":
    import argparse
    import glob

    parser = argparse.ArgumentParser(
        description="Pin versions of dependencies in generated artifacts."
    )
    parser.add_argument(
        "report_patterns",
        nargs="+",
        help="Glob patterns for report roots (where artifacts/ and assets/ are located).",
    )
    args = parser.parse_args()

    for pattern in args.report_patterns:
        for report_path in glob.glob(pattern):
            report_root = pathlib.Path(report_path)
            logger.info(f"Pinning versions in report at {report_root}")
            pin_all_versions(report_root)
