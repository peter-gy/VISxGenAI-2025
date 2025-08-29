---
aside: false
---

# 🔍 Explainability & Trust

Trust in AI-generated insights hinges on understanding how they were created. Without transparency into data transformations and analytical decisions, even sophisticated analysis becomes an opaque black box that erodes confidence and utility.

Our system aims to build trust through complete explainability. Every generated insight of a report comes with full provenance—from raw data cleaning and SQL transformations to visualization choices—packaged as an interactive [Marimo](https://marimo.io/) notebook. These executable environments don't just document the AI's reasoning; they let you step through each transformation, inspect the generated queries, and understand how data got visualized.

This transparency enables true collaboration. You can validate insights by tracing their lineage, extend analysis with your own code, or surgically fix issues without regenerating entire reports. The relationship is symbiotic: explainability builds trust, and trust enables the iterative refinement that makes AI a genuine analytical partner rather than an opaque oracle.

<ReportLink src="/reports/vispub-minimalistic/index.html#evolution-of-research-keywords" linkText="Try it out ↗" />

<Link href="/reports/vispub-minimalistic/index.html#evolution-of-research-keywords" target="_blank">
  <img src="/assets/marimo-provenance.gif" />
</Link>

::: info 💡 **Interactive Provenance**
Each Marimo notebook is a standalone environment with rich widgets for no-code exploration, while also supporting direct Python coding to extend the AI's work with your domain expertise.
:::
