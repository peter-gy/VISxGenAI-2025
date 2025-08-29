---
aside: false
---

# Case Study: From Flawed Insight to Durable Fix

We believe good AI isn't perfect—it's **steerable**. The following flawed report, produced by an early version of our agent, illustrates why our system is designed for partnership, not perfection.

**Source:** [VisPub Dataset](https://raw.github.com/visxgenai/challenge-2025/main/dataset.csv)

<ReportLink src="/reports/vispub-flawed-insight/index.html" />

<ReportIframe
  src="/reports/vispub-flawed-insight/index.html#citation-dynamics-and-research-characteristics"
  height="1000px"
  title="VisPub Flawed Insight Report" />

## The Flaw: An Uninformative Visualization

The visualization agent correctly selected a faceted scatterplot to analyze Aminer citations versus CrossRef citations. However, the insight itself was flawed from the start due to a poor choice of segmentation:

**🤖 Agent thoughts**

> **Insight 4 (Correlation - Value):** The hint explicitly lists `AminerCitationCount` and `CitationCount_CrossRef` as correlated fields, which is perfect. `GraphicsReplicabilityStamp` is also hinted as a low-cardinality categorical for segmentation. This insight is well-supported.

Because the `GraphicsReplicabilityStamp` field is highly skewed, the resulting faceted chart is sparse, unbalanced, and ultimately uninformative.

## The Fix: Architectural, Not Prompts

The typical response might be to adjust the LLM prompt. Instead, our composable architecture enables a more robust, lasting solution in three steps:

1. **Diagnose:** Execution traces pinpointed the error's origin: the `Insight Planner` agent was misled by its `Dataset Profile Query Tool`. [🔗 See Relevant Trace Here](https://langfuse.peter.gy/project/cme1wh1l00006qj07v328noo8/traces/6a54b168da02c68ddd5a9e63fb68925e?display=timeline&observation=f05de88341324548)

2. **Intervene:** We bypassed the LLM and directly modified the **tool's deterministic logic**.

3. **Upgrade:** We implemented a permanent, dataset-agnostic rule: only suggest fields for segmentation if they meet a minimum statistical diversity threshold.

## The Result: A System-Wide Upgrade

This targeted modification permanently improves the system's knowledge base, preventing this entire class of flawed insights for **any dataset** going forward.

This is our design philosophy in action: rather than relying on an opaque oracle, we have a transparent partner that can be systematically improved.
