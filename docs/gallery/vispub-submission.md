---
aside: false
---

# VIS Publications Dataset Report

Generated autonomously for the [2025 IEEE VISxGenAI Workshop Challenge](https://visxgenai.github.io/), this report demonstrates our multi‑agent system's dataset‑agnostic approach. The system handled the complete workflow independently:

- **Data Understanding:** The Field Refiner cleaned data and inferred column semantics, while the Dataset Describer and Field Expander (with web search) created semantic schemas and resolved cryptic codes
- **Analysis:** The Insight Planner operated within a ReAct loop, using statistical profiles to ground planning, while the Dataset Deriver crafted and repaired [DuckDB](https://duckdb.org/) queries
- **Visualization:** Rather than token‑intensive LLM‑based chart design, the Dataset Visualizer used [Draco's](https://github.com/cmudig/draco2) rule‑based solver for principled visualization recommendations
- **Reporting:** The Report Narrator generated textual descriptions using vision‑language models, assembled into this [Observable Notebook 2.0](https://github.com/observablehq/notebook-kit) report

The report combines AI‑authored insights with reader‑driven exploration via [Mosaic](https://idl.uw.edu/mosaic/) and [Quak](https://github.com/manzt/quak) for cross‑filtering and data interaction. Each insight includes an executable [Marimo](https://marimo.io/) notebook for full traceability, while [Langfuse](https://langfuse.com/) captures detailed execution traces for transparency.

**Source:** [VisPub Dataset](https://raw.githubusercontent.com/visxgenai/challenge-2025/main/dataset.csv)

<ReportLink src="/reports/vispub-submission/index.html" />

<ReportIframe
  src="/reports/vispub-submission/index.html"
  height="1000px"
  title="VIS Publications Dataset Report" />
