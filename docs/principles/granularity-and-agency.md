---
aside: false
---

# 🎯 Granularity & Agency

Traditional AI systems treat reports as monolithic, all-or-nothing outputs. When something needs adjustment—even a minor visualization tweak—you're forced to regenerate everything from scratch, losing context, wasting resources, and breaking the analytical flow. This throwaway approach fundamentally limits human agency and makes AI collaboration unsustainable.

Our system takes a different approach: **granular outputs built on open standards**. Every report is decomposed into modular, accessible components—datasets, visualizations, insights, and code—each available as standard formats that persist beyond the initial generation. This granularity gives analysts true agency to evolve their work sustainably.

Consider a stock market analysis where the AI generates usable insights but visualizes monthly data by year, obscuring important trends. Instead of starting over, the analyst can:

- **Trace** the issue to its source using built-in provenance
- **Extract** just the problematic Vega-Lite specification
- **Modify** a single line: `"timeUnit": "year"` → `"timeUnit": "yearmonth"`
- **Integrate** the fix back into the living report

The result? A report that grows and improves over time rather than being discarded at the first imperfection. This is sustainable AI collaboration—where human expertise enhances machine capabilities through precise interventions, creating analytical assets with genuine continuity.

Because everything is built on open standards (Observable notebooks, Vega-Lite, standard data formats), these reports remain valuable and adaptable long after generation. They become living documents that analysts can return to, extend, and refine as their understanding deepens or requirements change.

![](/assets/surgical-edit.gif)

::: info 💡 **Benefits of Observable Notebooks**
As each report is a standalone Observable notebook, their suite of tools such as the [Observable Desktop](https://observablehq.com/notebook-kit/desktop) can be leveraged to edit the report, potentially using AI in a supervised setting to edit outputs of unsupervised AI.
:::
