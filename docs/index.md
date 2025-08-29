---
layout: home

hero:
  name: "Composable Agents"
  text: "for Visual Reporting"
  image:
    light: /assets/agents/flow-light.svg
    dark: /assets/agents/flow-dark.svg

  tagline: A prototype autonomous agentic system for steerable, explainable, and collaborative analytics, exploring human–AI partnership in visualization for the generative AI era. Workshop Challenge submission for <a class="outlink" href="https://visxgenai.github.io/" target="_blank">IEEE VISxGenAI 2025</a>.

  actions:
    - theme: brand
      text: 📊 Explore the Gallery
      link: /gallery/
    - theme: alt
      text: 🏗️ Curious About the Design?
      link: /paper/

features:
  - icon: 🧩
    title: Composability & Modularity
    link: /principles/composability-and-modularity
    details: We avoid brittle, monolithic models by externalizing logic to deterministic modules, leveraging the rule-based system <a class="outlink" href="https://github.com/cmudig/draco2" target="_blank">Draco</a> for principled, white-box autonomous visualization design.
  - icon: 🔍
    title: Explainability & Trust
    link: /principles/explainability-and-trust
    details: Every insight is accompanied by deep, executable provenance via <a class="outlink" href="https://marimo.io/" target="_blank">Marimo</a> notebooks, while all agent interactions are captured using <a class="outlink" href="https://langfuse.com/" target="_blank">Langfuse</a>, making the system's reasoning transparent and its data transformations traceable.
  - icon: 🧭
    title: Interactive Exploration
    link: /principles/interactive-exploration
    details: Powered by <a class="outlink" href="https://idl.uw.edu/mosaic/" target="_blank">Mosaic</a>, reports are not just static documents. Readers can go beyond the AI's narrative, asking their own questions via cross-filtering and direct data interaction.
  - icon: 🎯
    title: Granularity & Agency
    link: /principles/granularity-and-agency
    details: Deconstructed artifacts enable surgical modifications to any part of the report without full regenerations. Built with <a class="outlink" href="https://observablehq.com/notebook-kit/" target="_blank">Observable Notebook 2.0</a> for source code transparency and AI-assisted editing.
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #2870EA 30%, #2052FB);

  --vp-home-hero-image-filter: blur(10px);
}
.dark {
    --vp-home-hero-image-filter: blur(15px);
}

.VPImage {
  max-width: 100% !important;
  height: auto;
}
</style>
