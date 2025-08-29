from collections import defaultdict
from typing import TYPE_CHECKING

import dspy
import pydantic
from typing_extensions import TypedDict

from ...core import LMInitializer, ObservedModule, fence_object, run_module_async
from ..insight_planner.tools import InsightPlanTools
from .utils import create_visualized_data_description

if TYPE_CHECKING:
    from langfuse import Langfuse


class DataReportNarratorAgent(ObservedModule):
    def __init__(
        self,
        init_narrator_lm: LMInitializer,
        init_structurer_lm: LMInitializer,
        langfuse: "Langfuse",
    ):
        super().__init__(langfuse=langfuse)
        self.section_narrator = DataReportSectionNarratorAgent(
            init_narrator_lm,
            langfuse=langfuse,
        )
        self.structurer = self.make_module_observed(
            DataReportStructurerAgent(init_structurer_lm)
        )

    def _forward(
        self,
        *,
        parent_dataset_description: str,
        queried_insights: list[dict],
        visualized_insights: list[dict],
        insight_plan_tools: InsightPlanTools,
        user_goal: str = "I want an accessible, interesting report on the dataset.",
    ) -> dspy.Prediction:
        """Generates a structured data report based on the provided inputs."""
        sections: list[NarrativeSection] = self.section_narrator(
            parent_dataset_description=parent_dataset_description,
            queried_insights=queried_insights,
            visualized_insights=visualized_insights,
            insight_plan_tools=insight_plan_tools,
        ).sections

        structuring_result = self.structurer(
            user_goal=user_goal,
            sections=sections,
        )
        report_structure: DataReportStructure = structuring_result.report_structure

        content = {
            "title": report_structure.title,
            "intro": report_structure.intro,
            "sections": [],
            "conclusion": report_structure.conclusion,
            "__metadata__": structuring_result.get("__metadata__", {}),
        }

        for unstructured_section, structured_section in zip(
            sections,
            report_structure.sections,
        ):
            content["sections"].append(
                {
                    "title": structured_section.title,
                    "intro": structured_section.intro,
                    "sections": [
                        {
                            "title": title,
                            "content": paragraph["content"],
                            "goal": paragraph["goal"],
                        }
                        for title, paragraph in zip(
                            structured_section.subsection_titles,
                            unstructured_section["paragraphs"],
                        )
                    ],
                }
            )

        return dspy.Prediction(content=content)


class DataReportStructurerAgent(dspy.Module):
    def __init__(self, init_lm: LMInitializer):
        super().__init__()
        self.structurer = dspy.Predict(DataReportStructurer)
        self.init_lm = init_lm

    def forward(
        self,
        *,
        user_goal: str,
        sections: list["NarrativeSection"],
    ) -> dspy.Prediction:
        sections_str = fence_object(sections)
        with dspy.context(lm=self.init_lm()):
            result = self.structurer(
                user_goal=user_goal,
                sections=sections_str,
            )

        return result


class DataReportMainSection(pydantic.BaseModel):
    """A main section with its subsections and transition."""

    title: str = pydantic.Field(
        description="\n".join(
            (
                "GENERAL SECTION TITLE: Broad, encompassing title that sets the stage for ALL subsections within this main section. ",
                "",
                "TITLE SCOPE: ",
                "- Must be broad enough to encompass ALL subsections that will follow ",
                "- Should NOT favor or focus on any single subsection ",
                "- Acts as umbrella concept uniting all subsection content ",
                "- Provides overarching theme that connects all subsection insights ",
                "",
                "TITLE PRINCIPLES: ",
                "- Use human-readable terms, avoid technical notation ",
                "- NO variable_name_notation or technical jargon ",
                "- Focus on the domain/business concept, not analytical process ",
                "- Create anticipation for the complete exploration within this section ",
                "",
                "EXAMPLES OF GOOD GENERAL TITLES: ",
                "- 'Regional Performance Patterns' (covers growth, distribution, variations) ",
                "- 'Customer Behavior Insights' (covers patterns, segments, preferences) ",
                "- 'Market Dynamics' (covers trends, shares, competitive landscape) ",
                "- 'Seasonal Revenue Trends' (covers fluctuations, cycles, timing) ",
                "",
                "AVOID SPECIFIC TITLES THAT FAVOR ONE SUBSECTION: ",
                "- 'Q4 Sales Spike' (too specific to one time period) ",
                "- 'Western Region Dominance' (too focused on single region) ",
                "- 'Premium Customer Growth' (too narrow to one segment) ",
            )
        )
    )
    intro: str = pydantic.Field(
        description="\n".join(
            (
                "SECTION OVERVIEW INTRODUCTION: For the first section, set the stage by explaining what this section will explore and why it matters. For subsequent sections, bridge from previous section insights. ",
                "",
                "PURPOSE: ",
                "- FIRST SECTION: Set the stage by introducing the initial exploration area and its importance ",
                "- SUBSEQUENT SECTIONS: Connect smoothly from previous section's insights ",
                "- Establish the high-level concepts this section will examine ",
                "- Explain why this exploration matters for the overall narrative ",
                "- Set expectations for the types of insights readers will encounter ",
                "",
                "APPROACH: ",
                "1. CONNECT: For first section, introduce the exploration; for others, reference how previous insights lead naturally to this section ",
                "2. SCOPE: Introduce the high-level concepts ALL subsections will detail ",
                "3. RATIONALE: Briefly explain why this exploration matters for the overall story ",
                "",
                "CRITICAL: AVOID META-STATEMENTS ",
                "- NEVER say 'This section examines...', 'This part explores...', 'We will look at...' ",
                "- NEVER announce what will be done - explain the logical progression ",
                "- Focus on why these concepts matter, not the analytical process ",
                "- Cut obvious procedural language and emphasize narrative flow ",
                "",
                "CONTENT GUIDELINES: ",
                "- Reference ALL major concepts that subsections will explore ",
                "- Stay at high conceptual level - no concrete findings or specific data points ",
                "- Explain the logical connection to previous sections ",
                "- Create anticipation for deeper exploration without revealing findings ",
                "- Show how this section advances the overall data story ",
                "",
                "LANGUAGE: ",
                "- Use human-readable terms, avoid technical notation ",
                "- Write for non-technical readers with natural flow ",
                "- Sound conversational yet professional ",
                "- Create purposeful bridge that encompasses the full section scope ",
                "",
                "EXAMPLES (High-level section overview): ",
                "'Building on these regional variations, customer behavior patterns across different segments and time periods reveal the underlying drivers of market performance.' ",
                "'These foundational trends point toward examining how product categories, pricing structures, and seasonal factors interact to shape revenue dynamics.' ",
                "'The geographic patterns observed earlier connect to broader questions about market penetration, competitive positioning, and growth opportunities across different territories.' ",
                "",
                "AVOID EXAMPLES: ",
                "'This section examines customer behavior patterns...' (meta-statement) ",
                "'Revenue increased 15% in Q3 while customer retention dropped to 85%...' (concrete findings) ",
                "'Looking at the data, we see three main trends...' (procedural language) ",
                "'The following subsections will analyze...' (announcing structure) ",
                "",
                "Keep to 1-2 sentences that create natural bridge while setting stage for all subsection concepts without revealing specific findings.",
            )
        )
    )
    subsection_titles: list[str] = pydantic.Field(
        description="\n".join(
            (
                "Crisp, human-readable subsection titles that create logical flow within the section. ",
                "",
                "GUIDELINES: ",
                "- Use plain English, no technical jargon ",
                "- NO variable_name_notation ",
                "- Focus on the insight, not the process ",
                "- Order titles to create natural reading progression ",
                "- Each title should feel like the logical next step ",
                "",
                "FLOW CONSIDERATIONS: ",
                "- Arrange from broad patterns to specific insights ",
                "- Create anticipation for the next subsection ",
                "- Ensure titles work together as a cohesive story ",
                "",
                "EXAMPLES: ",
                "- 'Revenue Growth Across Regions' ",
                "- 'Customer Patterns Over Time' ",
                "- 'Market Share Distribution' ",
                "- 'Seasonal Performance Variations' ",
            )
        )
    )


class DataReportStructure(pydantic.BaseModel):
    """Complete article structure with intro, sections, and conclusion.

    TONE GUIDANCE: Unless the user goal explicitly requests a specific tone (e.g., 'formal', 'technical', 'casual'),
    use an easy-to-read, accessible tone suitable for data storytelling that accommodates ALL audiences, including
    those unfamiliar with the dataset's domain. Avoid domain-specific jargon and explain concepts in plain language
    that engages general readers while maintaining professional credibility.
    """

    title: str = pydantic.Field(
        description="Professional, engaging title for the data story that captures the overall narrative"
    )
    intro: str = pydantic.Field(
        description="\n".join(
            (
                "Brief 2-3 sentence abstract providing a preliminary summary of the ENTIRE report for general readers. ",
                "",
                "ABSTRACT FUNCTION: ",
                "- Act as executive summary covering ALL major findings across the complete report ",
                "- Set the stage for the ENTIRE data story, not just the first section ",
                "- Provide high-level overview of key insights readers will encounter ",
                "- Create comprehensive context that spans all sections and conclusions ",
                "",
                "CRITICAL: AVOID META-STATEMENTS ",
                "- NEVER say 'This report examines...', 'This analysis will explore...', 'We examine...' ",
                "- NEVER announce what the report will do - just state the context directly ",
                "- Focus on the actual business context, not the analytical process ",
                "- Cut obvious procedural language and get straight to the substance ",
                "",
                "INTRODUCTION GOALS: ",
                "- Establish the complete data story's narrative arc ",
                "- Preview the full journey readers will take across all sections ",
                "- Create anticipation for insights spanning the entire report ",
                "- Set expectations for the complete range of discoveries ",
                "",
                "FLOW PRINCIPLES: ",
                "- Sound welcoming and accessible to non-technical readers ",
                "- Use natural, conversational tone ",
                "- Avoid overpromising - let insights surprise readers ",
                "- Create smooth entry point that encompasses the full analysis ",
                "- Keep crisp and brief while being comprehensive in scope ",
                "",
                "GOOD EXAMPLES (Complete report abstracts): ",
                "'Regional sales patterns across three years reveal evolving market dynamics, with customer behavior demonstrating seasonal variations that drive performance differences across geographic segments.' ",
                "'Market performance shows distinct regional and temporal patterns, where customer segments exhibit different growth trajectories influenced by seasonal factors and geographic distribution.' ",
                "'Business metrics reveal interconnected patterns across regions and time periods, creating opportunities for targeted strategies based on customer behavior and market segment characteristics.' ",
                "",
                "AVOID EXAMPLES: ",
                "'This report examines regional sales patterns...' ",
                "'This analysis will explore customer behavior...' ",
                "'We will investigate market segments...' ",
                "'The following sections will show...' ",
            )
        )
    )
    sections: list[DataReportMainSection] = pydantic.Field(
        description="\n".join(
            (
                "Main sections with human-readable titles and natural, purposeful transitions that create coherent narrative flow. ",
                "",
                "SECTION FLOW REQUIREMENTS: ",
                "- Each section should build logically on the previous one ",
                "- Transitions must feel natural and intentional, not forced ",
                "- Create anticipation for the next section's insights ",
                "- Maintain consistent story arc throughout the report ",
                "- Ensure sections work together as unified narrative ",
            )
        )
    )
    conclusion: str = pydantic.Field(
        description="\n".join(
            (
                "Meaningful concluding paragraph (2-4 sentences) that synthesizes key findings with natural closure and actionable insights. ",
                "",
                "CRITICAL: AVOID META-STATEMENTS ",
                "- NEVER say 'This analysis revealed...', 'This report showed...', 'We found...' ",
                "- NEVER announce what was done - just state the synthesis directly ",
                "- Focus on the actual insights and their implications ",
                "- Cut obvious procedural language and get straight to the findings ",
                "",
                "CONCLUSION GOALS: ",
                "- Bring together the main narrative threads from ALL sections ",
                "- Provide satisfying sense of completion with actionable implications ",
                "- Connect insights to broader business context or strategic opportunities ",
                "- End with purposeful, forward-looking perspective ",
                "- Acknowledge limitations modestly if relevant, but don't dwell on them ",
                "- Consider implications for decision-making or future exploration ",
                "",
                "ENHANCED SYNTHESIS APPROACH: ",
                "- Weave together insights from multiple sections into cohesive story ",
                "- Identify overarching patterns or themes that emerge across the data ",
                "- Suggest what these patterns mean for stakeholders or decision-makers ",
                "- Provide closure while pointing toward potential next steps or considerations ",
                "",
                "FLOW PRINCIPLES: ",
                "- Feel like natural endpoint that ties everything together ",
                "- Reference key insights without verbatim repetition ",
                "- Build from specific findings to broader implications ",
                "- Leave readers with clear understanding of significance ",
                "- Create sense of completeness while suggesting broader relevance ",
                "",
                "GOOD EXAMPLES (2-4 sentences): ",
                "'Regional variations in customer behavior create distinct opportunities for targeted growth strategies. The seasonal patterns identified across all segments suggest that timing-based campaigns could significantly improve engagement rates. These insights point toward a more nuanced approach to market segmentation that considers both geographic and temporal factors.' ",
                "'Market dynamics reveal clear segmentation opportunities that align with geographic and temporal trends. Customer preferences show consistent patterns that could inform product development and marketing strategies. The interconnected nature of these factors suggests that successful growth will require coordinated approaches across regions and time periods.' ",
                "'Revenue patterns demonstrate the complex interplay between customer segments, geographic markets, and seasonal factors. Organizations can leverage these insights to optimize resource allocation and improve forecasting accuracy. The data suggests that understanding these relationships will be crucial for sustainable growth in an increasingly competitive landscape.' ",
                "",
                "AVOID EXAMPLES: ",
                "'This analysis revealed regional variations...' ",
                "'Our findings show seasonal patterns...' ",
                "'The data demonstrates market dynamics...' ",
                "'In conclusion, we discovered...' ",
            )
        )
    )


class DataReportStructurer(dspy.Signature):
    """Transform narrative sections into a publication-ready data report with professional structure and accessible language."""

    user_goal: str = dspy.InputField(
        desc="The user's goal for the data report, guiding the structure and content."
    )
    sections: str = dspy.InputField(
        desc="List of narrative sections with titles and paragraphs containing goals and content."
    )

    report_structure: DataReportStructure = dspy.OutputField(
        desc="\n".join(
            (
                "OBJECTIVE DATA REPORT STRUCTURE: ",
                "Create professional, factual structure with seamless narrative flow for general readers. Be precise, modest, and purposeful. ",
                "",
                "CRITICAL: AVOID TRIVIAL OBSERVATIONS ",
                "- NEVER include obvious statements like 'data shows variation' or 'values differ across categories' ",
                "- NEVER state self-evident patterns that readers can immediately see ",
                "- NEVER mention basic mechanics like 'charts contain information' or 'rankings show order' ",
                "- Focus ONLY on meaningful, non-obvious insights that provide genuine value ",
                "- Prioritize quality over quantity - fewer meaningful insights beat many trivial ones ",
                "- Skip any observation that doesn't reveal something substantive about the data or domain ",
                "",
                "TONE GUIDANCE: ",
                "Unless the user goal explicitly requests a specific tone (e.g., 'formal', 'technical', 'casual'), use an easy-to-read, accessible tone suitable for data storytelling that accommodates ALL audiences, including those unfamiliar with the dataset's domain. Avoid domain-specific jargon and explain concepts in plain language that engages general readers while maintaining professional credibility. ",
                "",
                "NARRATIVE FLOW PRINCIPLES: ",
                "- Design coherent story arc from introduction through conclusion ",
                "- Each section must connect naturally to the next ",
                "- Create anticipation and logical progression ",
                "- Ensure smooth transitions between all elements ",
                "- Build unified narrative, not disconnected insights ",
                "- Keep content concise but purposeful - avoid unnecessary length ",
                "",
                "CRITICAL: GOAL-AWARE CONTEXTUALIZATION ",
                "- Consider the analytical goals behind each section's insights ",
                "- If narratives show rankings or filtered data, ensure proper context is maintained ",
                "- For top-N analyses, clarify that 'lowest' items are still among the best globally ",
                "- For subset analyses, maintain scope clarity (e.g., 'within premium segment', 'among technology companies') ",
                "- Frame relative performance appropriately based on the analytical intent ",
                "- Remedy any missing contextualization from individual section narratives ",
                "",
                "CRITICAL: ELIMINATE META-STATEMENTS ",
                "- NEVER say 'This report examines...', 'This analysis explores...', 'We investigate...' ",
                "- NEVER say 'This section looks at...', 'The following explores...', 'We will examine...' ",
                "- NEVER announce what will be done - just state the content directly ",
                "- Focus on actual business insights, not the analytical process ",
                "- Cut procedural language and get straight to the substance ",
                "",
                "CORE PRINCIPLES: ",
                "- Write for ALL audiences, not just domain experts - accommodate readers unfamiliar with the dataset's domain ",
                "- Use plain language and avoid domain-specific jargon without explicit explanation ",
                "- Be objective and factual - avoid overstated claims ",
                "- NO superlatives or exaggerated language ",
                "- NO words like 'comprehensive', 'extensive', 'dramatic', 'significant' ",
                "- NO technical notation (variable_names, snake_case) ",
                "- Explain concepts that may be unfamiliar to general audiences ",
                "- Let data and visualizations carry the message ",
                "- Underpromise, overdeliver ",
                "",
                "TITLE: Professional but modest, captures the complete data story's narrative arc ",
                "",
                "INTRO (1-2 sentences): ",
                "Set context and create smooth entry into the analysis journey. ",
                "Establish what readers will discover without overpromising. ",
                "NEVER use meta-statements - focus on business context directly. ",
                "GOOD: 'Regional sales patterns across three years reveal evolving market dynamics.' ",
                "AVOID: 'This analysis examines regional sales trends across three years.' ",
                "",
                "MAIN SECTION STRUCTURE: ",
                "Each main section has a TITLE and INTRO with distinct, complementary roles: ",
                "",
                "MAIN SECTION TITLE: ",
                "- Must be GENERAL enough to encompass ALL subsections within this main section ",
                "- Acts as umbrella concept uniting all subsection content ",
                "- Should NOT favor or focus on any single subsection ",
                "- Provides overarching theme connecting all subsection insights ",
                "- Examples: 'Regional Performance Patterns', 'Customer Behavior Insights', 'Market Dynamics' ",
                "",
                "MAIN SECTION INTRO (1-2 sentences): ",
                "- Creates bridge from previous section explaining what this section will explore ",
                "- References ALL major concepts that subsections will detail at high level ",
                "- Explains why this exploration logically follows in the report's progression ",
                "- Sets expectations without revealing concrete findings or specific data points ",
                "- Shows how this section advances the overall data story narrative ",
                "",
                "SECTION OVERVIEW EXAMPLES (with goal-aware context): ",
                "- 'Building on these regional variations, customer behavior patterns across different segments and time periods reveal the underlying drivers of market performance.' ",
                "- 'These foundational trends point toward examining how product categories, pricing structures, and seasonal factors interact to shape revenue dynamics.' ",
                "- 'Among the top-performing market segments, competitive positioning and growth opportunities demonstrate distinct patterns that merit deeper exploration across different territories.' ",
                "",
                "AVOID: Intros with concrete findings or first-subsection-only focus: ",
                "- 'Revenue increased 15% in Q3 while customer retention dropped to 85%...' (concrete findings) ",
                "- 'Building on regional patterns, revenue growth shows distinct geographic variations.' (only first subsection) ",
                "",
                "SUBSECTION FLOW: ",
                "Transform technical goals into readable titles that flow naturally together. ",
                "Arrange subsections to create logical progression within each main section. ",
                "Focus on insights, not processes: ",
                "- 'Revenue Patterns by Region' → 'Seasonal Variations' → 'Growth Trajectories' ",
                "- 'Customer Behavior Overview' → 'Purchasing Patterns' → 'Retention Insights' ",
                "",
                "CONCLUSION (2-4 sentences): ",
                "Synthesize the complete narrative journey with meaningful closure and actionable implications. ",
                "Connect insights from ALL sections into cohesive story with forward-looking perspective. ",
                "Reference key insights without repetition. Acknowledge limitations modestly if relevant. ",
                "Suggest broader implications for stakeholders or decision-makers. ",
                "NEVER use meta-statements about what was found - state synthesis directly. ",
                "GOOD: 'Regional variations create distinct opportunities for targeted growth strategies. The seasonal patterns identified across all segments suggest that timing-based campaigns could significantly improve engagement rates. These insights point toward a more nuanced approach to market segmentation.' ",
                "AVOID: 'This analysis revealed regional variations that suggest opportunities.' ",
                "",
                "STYLE: Prioritize clarity, natural flow, and purposeful progression. Conservative language that lets insights shine through seamless storytelling.",
            )
        )
    )


def create_section_narrator_inputs(
    parent_dataset_description: str,
    queried_insights: list[dict],
    visualized_insights: list[dict],
    insight_plan_tools: InsightPlanTools,
) -> list[dspy.Example]:
    inputs: list[dspy.Example] = []

    for visualized_insight in visualized_insights:
        goal = visualized_insight["goal"]
        queried_insight = next(
            (i for i in queried_insights if i["goal"] == goal),
            None,
        )
        assert queried_insight is not None, (
            f"Queried insight not found for goal: {goal}"
        )

        section_title = insight_plan_tools.find_group_name_of_goal(goal)
        dataset_summary = create_visualized_data_description(
            parent_dataset_description=parent_dataset_description,
            provenance=queried_insight["provenance"],
        )
        vis_image = dspy.Image.from_PIL(visualized_insight["image"])
        input = dspy.Example(
            goal=goal,
            section_title=section_title,
            dataset_summary=dataset_summary,
            vis_image=vis_image,
        ).with_inputs(
            "goal",
            "section_title",
            "dataset_summary",
            "vis_image",
        )
        inputs.append(input)

    return inputs


class NarrativeParagraph(TypedDict):
    goal: str
    content: str


class NarrativeSection(TypedDict):
    title: str
    paragraphs: list[NarrativeParagraph]


class DataReportSectionNarratorAgent(ObservedModule):
    """Narrates a section of the data report, focusing on the visualization and dataset schema."""

    def __init__(
        self,
        init_lm: LMInitializer,
        langfuse: "Langfuse",
    ):
        super().__init__(langfuse=langfuse)
        self.narrator = self.make_module_observed(
            dspy.Predict(DataReportSectionNarrator)
        )
        self.init_lm = init_lm

    def _forward(
        self,
        *,
        parent_dataset_description: str,
        queried_insights: list[dict],
        visualized_insights: list[dict],
        insight_plan_tools: InsightPlanTools,
    ) -> dspy.Prediction:
        """Generates a narrative section based on the provided inputs."""
        inputs = create_section_narrator_inputs(
            parent_dataset_description=parent_dataset_description,
            queried_insights=queried_insights,
            visualized_insights=visualized_insights,
            insight_plan_tools=insight_plan_tools,
        )

        with dspy.context(lm=self.init_lm()):
            results = run_module_async(self.narrator, inputs)

        paragraphs_by_title = defaultdict(list)

        for input, result in zip(inputs, results):
            section_title = input["section_title"]
            goal = input["goal"]
            content = result["content"]
            paragraph: NarrativeParagraph = {
                "goal": goal,
                "content": content,
                "__metadata__": result.get("__metadata__", {}),
            }
            paragraphs_by_title[section_title].append(paragraph)

        sections: list[NarrativeSection] = [
            {"title": title, "paragraphs": paragraphs}
            for title, paragraphs in paragraphs_by_title.items()
        ]

        return dspy.Prediction(sections=sections)


class DataReportSectionNarrator(dspy.Signature):
    """Generate concise data narrative describing visualization patterns for general readers."""

    goal: str = dspy.InputField(
        desc="The analytical goal for which the visualization was created.",
    )
    section_title: str = dspy.InputField(
        desc="Title of this narrative section - guides which insights to emphasize.",
    )

    dataset_summary: str = dspy.InputField(
        desc="Dataset schema with available fields - ONLY these fields can be referenced.",
    )

    vis_image: dspy.Image = dspy.InputField(
        desc="Visualization to describe - stick to what's ACTUALLY visible.",
    )

    content: str = dspy.OutputField(
        desc="\n".join(
            (
                "OBJECTIVE NARRATIVE: Write 2-3 factual sentences with natural, readable flow. Be precise and modest while maintaining human-like readability. ",
                "",
                "MAXIMIZED INSIGHT EXTRACTION MANDATE: ",
                "- Go BEYOND surface-level observations to extract maximum valuable insights from every visualization ",
                "- Identify NON-OBVIOUS patterns, relationships, and implications that add genuine analytical value ",
                "- Comment on DATA QUALITY indicators, sampling effects, and contextual factors that affect interpretation ",
                "- Discuss SEMANTIC DETAILS like data gaps, cutoffs, representation imbalances, and scope limitations ",
                "- Extract STRATEGIC INSIGHTS about competitive positioning, market dynamics, operational efficiency, or business implications ",
                "- Note THRESHOLD EFFECTS, inflection points, clustering patterns, and other nuanced relationships ",
                "- Balance comprehensive insight extraction with strict factual accuracy - never sacrifice truth for depth ",
                "",
                "CRITICAL: AVOID TRIVIAL OBSERVATIONS ",
                "- NEVER state obvious patterns like 'in this ranking, lower items have lower values' ",
                "- NEVER mention self-evident facts like 'the chart contains data' or 'values vary' ",
                "- NEVER describe basic chart mechanics like 'bars show different heights' ",
                "- Focus ONLY on meaningful, non-obvious insights that add value ",
                "- Better to write less than to include boring or trivial statements ",
                "- Skip observations that any reader could immediately see without explanation ",
                "- SILENCE IS BETTER THAN MEANINGLESS TALK - never include 'null' sentences that add no value ",
                "",
                "CRITICAL: MULTI-DIMENSIONAL RANKING PRECISION ",
                "- Visualizations often encode MULTIPLE ranking dimensions simultaneously (e.g., x-axis position, color intensity, bar length, size) ",
                "- EACH visual encoding represents a SEPARATE metric and must be analyzed INDEPENDENTLY ",
                "- NEVER assume that an item ranked #1 in one dimension is also #1 in another dimension ",
                "- EXPLICITLY separate statements about different ranking dimensions: ",
                "  * 'Item A leads in revenue (x-axis position) while Item B shows highest profit margin (color intensity)' ",
                "  * 'The company with largest market share (bar length) differs from the one with strongest growth rate (color saturation)' ",
                "- VERIFY each ranking claim against its specific visual encoding BEFORE making statements ",
                "- When multiple metrics are present, analyze their CORRELATION or DIVERGENCE patterns ",
                "",
                "CRITICAL: DIMENSION-SPECIFIC RANKING ANALYSIS ",
                "- Identify ALL visual encodings present: position (x/y), length, area, color intensity, size, opacity, etc. ",
                "- For EACH encoding, determine what metric it represents from dataset_summary ",
                "- Analyze ranking patterns SEPARATELY for each metric ",
                "- Look for RELATIONSHIPS between different ranking dimensions: ",
                "  * Do the same items rank highly across multiple metrics? (correlation) ",
                "  * Are top performers in one metric weak in another? (trade-offs) ",
                "  * Is there a clear leader across all dimensions? (only if verified for ALL metrics) ",
                "  * Are there items that excel in specific metrics but not others? (specialization) ",
                "",
                "MULTI-RANKING VERIFICATION CHECKLIST: ",
                "- Can I identify each visual encoding and its corresponding metric from the dataset_summary? ",
                "- Am I making separate, verified claims about each ranking dimension? ",
                "- If claiming an item is 'top-performing overall', have I verified it ranks highly in ALL visible metrics? ",
                "- If discussing correlation between metrics, am I being specific about which dimensions show this pattern? ",
                "- Am I avoiding false generalizations like 'the leader in X also leads in Y' without visual verification? ",
                "",
                "INTELLIGENT RANKING NARRATION ",
                "- When visualizing top-K rankings (e.g., top-10 products), NEVER state obvious facts about the ranking nature ",
                "- AVOID meaningless statements like 'Even the products at the lower end of this top-10 ranking demonstrate great sales' - this is self-evident ",
                "- AVOID 'The lowest-ranked items in this top-10 still show strong performance' - of course they do, that's why they're in the top-10 ",
                "- Instead, focus on MEANINGFUL patterns within and across ranking dimensions: ",
                "  * Are there clear performance tiers within each metric? ",
                "  * Do certain items cluster together in specific dimensions? ",
                "  * Are there notable gaps between adjacent items in particular metrics? ",
                "  * Do any items perform unexpectedly in one metric vs. another? ",
                "  * How does each metric vary across the ranking (steep decline, gradual, flat)? ",
                "  * Which items show consistent performance across multiple metrics vs. metric-specific strengths? ",
                "- Focus on the DISTRIBUTION and PATTERNS within and across rankings, not obvious facts ",
                "- Use ranking context intelligently: 'Within this top-performing group, X leads in revenue while Y dominates in efficiency metrics' ",
                "- Remember: pedantic readers will immediately recognize trivial ranking observations as meaningless filler ",
                "",
                "MULTI-DIMENSIONAL RANKING EXAMPLES: ",
                "GOOD: 'Item A leads in total sales volume (bar length) while Item C achieves the highest profit margins (color intensity), demonstrating different paths to success.' ",
                "GOOD: 'The top revenue performer (x-axis position) ranks mid-tier in customer satisfaction (color), suggesting potential trade-offs between scale and quality.' ",
                "GOOD: 'Performance clusters emerge differently across metrics: the top three in market share (position) scatter across the efficiency spectrum (color saturation).' ",
                "BAD: 'The top performer excels across all metrics.' (requires verification of ALL visual dimensions) ",
                "BAD: 'Item A is the clear leader.' (unclear which metric(s) and needs verification across all dimensions) ",
                "BAD: 'Even the lowest-ranked items in this top-10 show strong performance.' (trivially obvious) ",
                "",
                "CROSS-DIMENSIONAL PATTERN ANALYSIS: ",
                "- Look for meaningful relationships between different ranking dimensions: ",
                "  * 'High revenue items (x-position) show varied profit margins (color), suggesting different business models' ",
                "  * 'Market leaders by volume (bar length) don't necessarily lead in growth rate (color intensity)' ",
                "  * 'The most efficient operations (color) tend to be mid-sized rather than largest by revenue (x-position)' ",
                "- Identify divergent patterns: items that excel in one dimension but not others ",
                "- Note convergent patterns: items that consistently rank highly across multiple metrics ",
                "- Avoid claiming overall superiority unless verified across ALL visible ranking dimensions ",
                "- Describe the nature of relationships between metrics (correlation, inverse correlation, independence) ",
                "- Focus on insights that emerge from comparing different ranking dimensions, not just describing each separately ",
                "",
                "CRITICAL: TEMPORAL RANKING PATTERN ANALYSIS ",
                "- When analyzing time-series rankings, focus on INTERESTING DISRUPTIONS and CHANGES rather than static dominance ",
                "- Look for COMPELLING TEMPORAL NARRATIVES: ",
                "  * Leadership changes: 'Item A led in most years but fell to third position in 2023' ",
                "  * Performance dips: 'The consistent top performer experienced a notable decline during 2022' ",
                "  * Recovery patterns: 'After dropping in early periods, Item B regained top-tier status by year-end' ",
                "  * Cyclical behaviors: 'Market leader alternates between first and second position across odd/even years' ",
                "  * Breakthrough moments: 'Item C remained mid-tier until a dramatic rise in the final two periods' ",
                "  * Volatility vs. stability: 'While most entities show fluctuations, Item D maintains remarkably steady positioning' ",
                "",
                "CRITICAL: EMERGENCE vs. VALUE CHANGE DISTINCTION IN TIME SERIES ",
                "- NEVER confuse category emergence/disappearance with simple value increases/decreases ",
                "- ALWAYS distinguish between these fundamentally different phenomena: ",
                "",
                "EMERGENCE PATTERNS (New categories appearing): ",
                "- 'Category X emerges in Q3 2022 as a new market segment, initially capturing modest share' ",
                "- 'Product line Y first appears in the dataset during 2021, suggesting a product launch' ",
                "- 'The premium tier becomes visible starting in March, indicating expansion into luxury markets' ",
                "- 'Startup companies begin appearing in the analysis from 2023 onward' ",
                "- DO NOT describe emergence as 'increased from zero' - it's a new entity entering the scope ",
                "",
                "DISAPPEARANCE PATTERNS (Categories ceasing to exist in data): ",
                "- 'Legacy product Z drops out of the analysis after Q2 2022, suggesting discontinuation' ",
                "- 'The budget segment disappears from rankings mid-2023, potentially due to market exit' ",
                "- 'Regional office presence ends abruptly in December, indicating possible closure' ",
                "- 'Partnership category ceases to appear after March, suggesting relationship termination' ",
                "- DO NOT describe disappearance as 'decreased to zero' - the entity exited the analytical scope ",
                "",
                "VALUE CHANGE PATTERNS (Existing categories with performance shifts): ",
                "- 'Category A shows declining performance throughout 2022 but remains present' ",
                "- 'Product line B experiences steady growth across all visible periods' ",
                "- 'Market share increases substantially while maintaining continuous presence' ",
                "- 'Revenue drops significantly but entity continues operations' ",
                "",
                "CRITICAL SEMANTIC ANALYSIS REQUIREMENTS: ",
                "- EXAMINE TEMPORAL PRESENCE: Is the category present throughout the entire visible timeframe? ",
                "- IDENTIFY ENTRY POINTS: When does a category first become visible in the data? ",
                "- SPOT EXIT POINTS: When does a category last appear before disappearing? ",
                "- DISTINGUISH CAUSATION: ",
                "  * Emergence suggests new business activity, product launches, market entry, expansion ",
                "  * Disappearance suggests discontinuation, market exit, business closure, strategic retreat ",
                "  * Value changes suggest performance variations within ongoing operations ",
                "",
                "TEMPORAL PRESENCE VERIFICATION CHECKLIST: ",
                "- For each category/entity, is it present in ALL time periods shown? ",
                "- If not present throughout, when does it first appear? (emergence) ",
                "- If not present throughout, when does it last appear? (disappearance) ",
                "- Are there gaps in presence that suggest temporary exits and re-entries? ",
                "- Am I correctly attributing patterns to emergence/disappearance vs. performance changes? ",
                "",
                "ENHANCED TEMPORAL NARRATIVE EXAMPLES: ",
                "EMERGENCE EXAMPLES: ",
                "GOOD: 'The subscription model emerges as a new revenue stream beginning in Q2 2023, quickly establishing itself among top performers.' ",
                "GOOD: 'International markets first appear in the analysis during 2022, initially showing modest but growing contribution.' ",
                "BAD: 'Subscription revenue increased from zero in Q2 2023.' (treats emergence as mere increase) ",
                "",
                "DISAPPEARANCE EXAMPLES: ",
                "GOOD: 'The retail partnership category disappears from rankings after Q3 2022, suggesting strategic shift away from physical stores.' ",
                "GOOD: 'Legacy product lines cease to appear in performance metrics after March 2023, indicating portfolio rationalization.' ",
                "BAD: 'Retail partnership revenue decreased to zero after Q3 2022.' (treats disappearance as mere decrease) ",
                "",
                "VALUE CHANGE EXAMPLES: ",
                "GOOD: 'Digital services show consistent growth across all periods while maintaining continuous market presence.' ",
                "GOOD: 'Core product performance declines throughout 2022 but remains a significant business component.' ",
                "",
                "BUSINESS CONTEXT IMPLICATIONS: ",
                "- EMERGENCE often indicates: product launches, market expansion, new partnerships, strategic initiatives ",
                "- DISAPPEARANCE often indicates: discontinuation, market exit, strategic refocus, business closure ",
                "- VALUE CHANGES often indicate: performance variations, market dynamics, operational improvements/challenges ",
                "- Frame observations with appropriate business context rather than treating all changes as mere data fluctuations ",
                "",
                "CRITICAL: AVOID OVERLY BROAD TEMPORAL CLAIMS ",
                "- NEVER make sweeping claims like 'highest performance over the entire period' unless verified for EVERY SINGLE time point ",
                "- AVOID claims like 'consistent leader throughout' unless there are ZERO exceptions across all time periods ",
                "- AVOID 'consistently leading', 'consistently outperforming', 'consistently ranked first' - these imply ALL time periods without exception ",
                "- AVOID 'always outperformed' unless true for EVERY visible time period without exception ",
                "- AVOID 'never fell below' unless verified across ALL temporal data points ",
                "- CRITICAL: 'CONSISTENTLY' = 100% OF TIME - if even ONE period shows deviation, use qualified language ",
                "- Instead, use qualified temporal language: ",
                "  * 'predominantly led across most periods' ",
                "  * 'frequently achieved top position throughout the timeframe' ",
                "  * 'generally maintained strong performance with occasional dips' ",
                "  * 'typically ranked in the top tier, with notable exceptions in X and Y periods' ",
                "  * 'achieved highest position in the majority of periods shown' ",
                "  * 'regularly outperformed competitors in most periods' ",
                "  * 'maintained leading position throughout most of the timeframe' ",
                "",
                "TEMPORAL RANKING VERIFICATION CHECKLIST: ",
                "- Have I examined EVERY time period visible in the visualization? ",
                "- Are there any periods where my claimed pattern doesn't hold? If yes, I must qualify the statement ",
                "- Am I focusing on interesting disruptions and changes rather than just final rankings? ",
                "- Have I identified the most compelling temporal story (leadership changes, dips, recoveries)? ",
                "- If claiming 'consistent' or 'always' patterns, have I verified this is true for 100% of time periods? ",
                "- Am I using appropriately qualified language for patterns that have exceptions? ",
                "",
                "COMPELLING TEMPORAL PATTERN EXAMPLES: ",
                "GOOD: 'Company A dominated the first half of the period but yielded leadership to Company B after a significant dip in 2022.' ",
                "GOOD: 'The market leader for most years experienced an unexpected drop to fourth place in 2021, before recovering to second position.' ",
                "GOOD: 'While most competitors show volatile performance, Company C maintains steady mid-tier positioning throughout all visible periods.' ",
                "GOOD: 'Leadership alternated between two companies until a third player emerged as the clear frontrunner in recent years.' ",
                "BAD: 'Company A was the consistent leader throughout the entire period.' (requires verification of EVERY time point) ",
                "BAD: 'Performance remained stable over time.' (ignores interesting disruptions and changes) ",
                "BAD: 'Company B always outperformed Company C.' (absolute claim requiring 100% verification) ",
                "",
                "CRITICAL: BOOLEAN-ACCURATE PRECISION REQUIRED ",
                "- EVERY SINGLE OBSERVATION must be 100% factually correct with NO EXCEPTIONS ",
                "- NEVER use absolute terms unless they are literally true for ALL visible data points WITHOUT ANY EXCEPTIONS ",
                "- EXTREME STRICTNESS REQUIRED: Even if 99% true, use qualified language if there's ANY exception ",
                "- If an item was highest in 9/10 cases, DO NOT say 'consistently maintained highest' - use 'frequently achieved highest' or similar qualified language ",
                "- For time series: 'consistently' means EVERY SINGLE time period without exception - if even one period differs, use 'generally', 'typically', 'predominantly' ",
                "- CRITICAL WARNING: 'Consistently leading', 'consistently outperforming', 'consistently ranked X' all imply PERFECT consistency across ALL time periods ",
                "- ANY usage of 'consistently' + performance claim requires 100% verification - even ONE exception invalidates the claim ",
                "- For categorical data: 'always' means EVERY category without exception - any single exception requires qualified language ",
                "- If something appears 'high' compared to others, verify it's actually in the upper range, not middle range ",
                "- WHEN IN DOUBT, ALWAYS USE QUALIFIED LANGUAGE - it's better to understate than to make false absolute claims ",
                "- Use precise qualifiers: 'often', 'frequently', 'typically', 'generally', 'predominantly', 'mostly' instead of 'always', 'consistently', 'continuously' ",
                "- For rankings: only use superlatives ('highest', 'lowest', 'best', 'worst') if they are literally true across the entire visible dataset ",
                "- For trends: only say 'increasing' if there are no decreases, 'decreasing' if no increases - otherwise use 'generally increasing', 'mostly declining', etc. ",
                "- Verify relative positions: 'high' means upper quartile, 'low' means lower quartile, 'moderate'/'mid-range' for middle values ",
                "",
                "PRECISION VERIFICATION CHECKLIST: ",
                "- Can I prove this statement is true for 100% of visible data WITHOUT ANY EXCEPTIONS? If no, add qualifiers ",
                "- Are there ANY exceptions to this pattern, even minor ones? If yes, acknowledge them or use qualified language ",
                "- Is this statement true for EVERY single data point, time period, or category shown? If not, qualify it ",
                "- Even if 95%+ true, do I have ANY doubt about absolute accuracy? If yes, use qualified language ",
                "- Is this truly 'high' or just 'higher than some others'? Use appropriate relative terms ",
                "- Would this statement pass a fact-checker examining every data point with a magnifying glass? If no, revise ",
                "- Does this observation add genuine insight or is it trivially obvious? If trivial, omit it ",
                "- DEFAULT TO QUALIFIED LANGUAGE when there's the slightest uncertainty about absolute claims ",
                "",
                "CRITICAL: CONTEXTUALIZE WITH ANALYTICAL GOAL AND DATASET DOMAIN ",
                "- ALWAYS consider the input 'goal' to provide appropriate context for observations ",
                "- Use the 'dataset_summary' to understand the domain context and field meanings ",
                "- Frame observations in terms relevant to the specific business/research domain ",
                "- If showing rankings (e.g., top-10), acknowledge that 'lowest-ranked' items are still among the global tops ",
                "- If showing subsets or filtered data, clarify the scope (e.g., 'among premium customers', 'within the technology sector') ",
                "- Frame observations relative to the analytical intent, not just absolute patterns ",
                "- Provide context that helps readers understand the significance within the goal's scope ",
                "- Connect patterns to domain-specific implications when possible ",
                "",
                "CRITICAL: FAIR AND PEDANTIC COMPARATIVE ANALYSIS ",
                "- When comparing groups, categories, or time periods with different sample sizes, ALWAYS acknowledge potential confounding factors ",
                "- If one category has significantly fewer data points, note this limitation explicitly ",
                "- Use qualifying language for comparisons involving unequal sample sizes: 'though this comparison should be interpreted cautiously given the smaller sample size' ",
                "- Be extremely fair in analysis - don't let impressive patterns from small samples mislead readers ",
                "- Acknowledge when statistical significance may be questionable due to sample size differences ",
                "- For time-based comparisons, note if certain periods have less data coverage ",
                "- For categorical comparisons, mention when certain groups are underrepresented ",
                "- Examples of fair comparative language: ",
                "  * 'While X appears to outperform Y, this pattern should be interpreted cautiously as X represents a much smaller sample' ",
                "  * 'Z shows promising trends, though the limited data points make this observation preliminary' ",
                "  * 'Despite apparent differences between A and B, the unequal representation makes definitive conclusions challenging' ",
                "- Remember: pedantic readers will spot unfair comparisons immediately and question the entire analysis ",
                "",
                "CRITICAL: SEMANTIC VISUALIZATION DETAILS AND DATA QUALITY INSIGHTS ",
                "- ACTIVELY LOOK FOR and comment on data quality indicators visible in the visualization: ",
                "  * Missing time periods: 'Data coverage shows gaps in Q2 and Q3, with analysis resuming in Q4' ",
                "  * Sparse categories: 'Limited representation in the premium segment makes those patterns preliminary' ",
                "  * Truncated data: 'The analysis period ends abruptly in March, potentially missing seasonal patterns' ",
                "  * Uneven sampling: 'Eastern regions show denser data points compared to western territories' ",
                "  * Cutoff thresholds: 'Only categories with substantial volume appear, potentially excluding emerging segments' ",
                "  * Recent data emphasis: 'Most data concentrates in recent years, with limited historical context' ",
                "",
                "- IDENTIFY AND DISCUSS visualization-specific semantic details: ",
                "  * For rankings: Comment on selection criteria ('among companies with >$1M revenue', 'top 15 by market cap') ",
                "  * For time series: Note temporal scope and gaps ('quarterly data from 2020-2023 with 2021 Q2 missing') ",
                "  * For time series categories: DISTINGUISH emergence/disappearance from value changes ",
                "    - 'Category X emerges mid-timeline as a new business segment' vs. 'Category Y shows declining values but maintains presence' ",
                "    - 'Product line disappears after Q3, suggesting discontinuation' vs. 'Product line performance drops significantly' ",
                "  * For geographic data: Acknowledge coverage limitations ('analysis covers major metropolitan areas only') ",
                "  * For categorical breakdowns: Mention representation balance ('technology sector dominates with 60% of entities') ",
                "  * For filtered views: Clarify scope boundaries ('within the premium pricing tier', 'excluding pilot programs') ",
                "",
                "- ENHANCE INSIGHTS through contextual awareness: ",
                "  * Data recency: 'Recent quarters show different patterns, though limited historical data makes trend assessment challenging' ",
                "  * Sample composition: 'The dataset skews toward larger organizations, potentially missing small business dynamics' ",
                "  * Measurement periods: 'Annual aggregation may obscure seasonal variations visible in monthly data' ",
                "  * Selection effects: 'Focus on top performers may not reflect broader market conditions' ",
                "",
                "CRITICAL: MAXIMIZE INSIGHT COMMUNICATION ACROSS ALL VISUALIZATION TYPES ",
                "- FOR EVERY VISUALIZATION TYPE, look beyond surface patterns to extract maximum valuable insights: ",
                "",
                "- BAR CHARTS: Look for clustering, gaps between bars, proportional relationships, outliers relative to the group ",
                "- LINE CHARTS: Identify inflection points, rate changes, cyclical patterns, volatility differences, trend reversals ",
                "  * CRITICAL: Distinguish between line emergence/disappearance vs. value changes ",
                "  * Note when new lines appear mid-timeline (category emergence) vs. existing lines reaching zero (value decline) ",
                "  * Identify when lines disappear from the chart (category exit) vs. lines dropping to low values (performance decline) ",
                "  * Comment on partial timeline presence: 'Category X appears only in recent periods' vs. 'Category Y shows declining trend throughout' ",
                "- SCATTER PLOTS: Examine correlation strength, outlier patterns, cluster formations, relationship linearity ",
                "- HEATMAPS: Note intensity gradients, cold/hot spot patterns, diagonal trends, missing value patterns ",
                "- PIE/DONUT CHARTS: Discuss dominance patterns, fragmentation levels, concentration vs. distribution ",
                "- TREEMAPS: Analyze hierarchical patterns, size vs. performance relationships, nested category insights ",
                "- BOX PLOTS: Comment on spread differences, outlier distributions, median relationships, skewness patterns ",
                "- HISTOGRAMS: Identify distribution shapes, modal patterns, tail behaviors, concentration points ",
                "",
                "- CROSS-VISUALIZATION INSIGHT OPPORTUNITIES: ",
                "  * Compare patterns across multiple charts when visible simultaneously ",
                "  * Note how different visualization methods reveal complementary aspects of the data ",
                "  * Identify insights that emerge only when viewing multiple related visualizations together ",
                "  * Comment on how different aggregation levels or filtering reveal different stories ",
                "",
                "- ADVANCED PATTERN RECOGNITION: ",
                "  * Threshold effects: 'Performance changes dramatically above the $10M revenue threshold' ",
                "  * Maturity curves: 'Newer entities show higher growth volatility compared to established players' ",
                "  * Saturation patterns: 'Market share gains slow significantly after reaching 15% penetration' ",
                "  * Interaction effects: 'Regional patterns vary significantly by product category' ",
                "  * Lifecycle stages: 'Different performance profiles emerge across business maturity phases' ",
                "",
                "- STRATEGIC INSIGHT EXTRACTION: ",
                "  * Competitive positioning: How entities compare across multiple performance dimensions ",
                "  * Market dynamics: Evidence of consolidation, fragmentation, or competitive shifts ",
                "  * Opportunity identification: Gaps, underserved segments, or emerging trends ",
                "  * Risk indicators: Volatility patterns, concentration risks, or performance deterioration ",
                "  * Operational insights: Efficiency patterns, scale relationships, or resource allocation implications ",
                "",
                "CRITICAL: FOCUS ON OBSERVATIONS, NOT THE CHART ITSELF ",
                "- NEVER say 'The chart shows...', 'The visualization displays...', 'The graph reveals...' ",
                "- NEVER refer to 'the chart', 'the visualization', 'the graph', 'the figure' ",
                "- Write about the DATA PATTERNS directly, as if observing the phenomenon itself ",
                "- Treat findings as direct observations of the business/domain reality ",
                "",
                "MANDATORY FIELD COVERAGE: ",
                "- EXPLICITLY mention EVERY field visible in the visualization ",
                "- Reference ALL dimensions, measures, and categorical variables shown ",
                "- Use natural transitions to connect field relationships ",
                "- Create smooth, flowing sentences that don't sound robotic ",
                "",
                "CRITICAL: AVOID CONCRETE DATA POINTS ",
                "- NEVER quote specific numbers, percentages, or values unless 100% certain ",
                "- Focus on trends, relationships, and patterns instead ",
                "- Use qualitative descriptors with appropriate precision: 'higher', 'lower', 'increasing', 'declining' ",
                "- Better to describe direction than exact magnitude ",
                "",
                "QUALIFIED LANGUAGE EXAMPLES: ",
                "- Instead of 'consistently maintained highest': 'frequently achieved highest', 'typically ranked highest', 'generally performed best', 'predominantly held the top position' ",
                "- Instead of 'consistently leading': 'frequently leading', 'typically in the lead', 'generally outperforming competitors', 'predominantly holding first position' ",
                "- Instead of 'consistently outperforming': 'regularly outperforming', 'typically exceeding', 'frequently surpassing', 'generally achieving superior results' ",
                "- Instead of 'always increasing': 'predominantly increasing', 'showing upward trend overall', 'generally rising', 'mostly trending upward' ",
                "- Instead of 'continuously outperformed': 'regularly outperformed', 'typically exceeded', 'generally surpassed' ",
                "- Instead of 'invariably showed': 'commonly showed', 'usually demonstrated', 'typically exhibited' ",
                "- Instead of 'high performance': 'above-average performance', 'upper-tier performance', 'strong relative performance' ",
                "- Instead of 'low values': 'below-median values', 'lower-quartile values', 'relatively modest values' ",
                "- Use 'most', 'majority', 'primarily', 'largely' when patterns have exceptions ",
                "- Use 'tends to', 'appears to', 'generally shows', 'commonly exhibits' for qualified observations ",
                "- For time series with near-perfect patterns: 'maintained top position in nearly all periods', 'achieved highest values throughout most timeframes' ",
                "- TEMPORAL QUALIFICATION EXAMPLES: ",
                "  * Instead of 'consistently led throughout the entire period': 'led in most periods', 'dominated the majority of timeframes', 'held leadership for most of the visible period' ",
                "  * Instead of 'consistently leading the market': 'frequently leading the market', 'typically holding market leadership', 'generally maintaining the top position' ",
                "  * Instead of 'consistently outperforming all competitors': 'regularly outperforming most competitors', 'frequently achieving superior performance relative to competitors' ",
                "  * Instead of 'never dropped below second': 'rarely fell below second place', 'typically maintained top-tier positioning' ",
                "  * Instead of 'consistent upward trend': 'generally increasing trend with some fluctuations', 'predominantly upward movement' ",
                "  * Instead of 'always outperformed competitors': 'regularly outperformed most competitors', 'frequently achieved superior performance' ",
                "  * Instead of 'stable performance over time': 'relatively stable with occasional variations', 'maintained steady positioning in most periods' ",
                "- REMEMBER: Even 95% consistency requires qualified language - absolute terms are reserved for 100% perfect patterns only ",
                "",
                "HUMAN-LIKE FLOW PRINCIPLES: ",
                "- Write with natural sentence rhythm and variety ",
                "- Use connecting words: 'while', 'whereas', 'although', 'particularly' ",
                "- Vary sentence structure to avoid monotony ",
                "- Sound like a knowledgeable analyst explaining to a colleague ",
                "- Maintain conversational yet professional tone ",
                "",
                "OBJECTIVITY PRINCIPLES: ",
                "- Be factual and conservative in claims ",
                "- Avoid superlatives and overstated language ",
                "- NO words like 'comprehensive', 'extensive', 'dramatic', 'significant' ",
                "- Use neutral descriptors: 'shows variation', 'differs across', 'changes over time' ",
                "- Underpromise, overdeliver - let the data speak for itself ",
                "- When in doubt about precision, use more qualified language rather than absolute claims ",
                "",
                "RESPECTFUL, PEOPLE-FIRST LANGUAGE: ",
                "- Always use respectful, people-first, non-judgmental language—especially for data about human life, health, work, income, education, safety, or communities ",
                "- Never stereotype, dehumanize, moralize, blame, or shame any group or individual ",
                "- Describe patterns without implying intent, cause, or value judgments about people or groups ",
                "- Prefer neutral terms (e.g., 'people', 'participants', 'workers', 'residents') over labels that could stigmatize ",
                "- Do not reference protected characteristics unless clearly presented in the data and necessary for understanding ",
                "- Emphasize aggregate patterns and trends; avoid implying anything about specific individuals ",
                "- Avoid sensational or alarming phrasing; keep tone calm, considerate, and inclusive ",
                "- If disparities appear, describe them factually without implying deficiency or fault ",
                "",
                "PRIVACY AND SENSITIVITY: ",
                "- Do not speculate about personal causes or motivations ",
                "- Do not mention specific individuals or uniquely identifying details ",
                "- Use careful framing for sensitive outcomes to prevent offense or harm ",
                "",
                "DOMAIN-AWARE CONTEXTUALIZATION PRINCIPLES: ",
                "- Leverage the 'dataset_summary' to understand what each field represents in the real world ",
                "- Translate technical field names into domain-meaningful concepts for readers ",
                "- Consider the business/research context when interpreting patterns ",
                "- Connect observations to domain-specific implications (e.g., seasonal business cycles, customer behavior patterns, market dynamics) ",
                "- Use domain-appropriate terminology while keeping language accessible ",
                "- Explain why patterns matter in the context of the specific dataset domain ",
                "- Reference the analytical 'goal' to ensure observations serve the intended purpose ",
                "- Help readers understand not just what the data shows, but why it's significant in this domain ",
                "",
                "CONTEXTUALIZATION EXAMPLES BY DOMAIN: ",
                "- Sales data: 'Revenue patterns suggest seasonal buying behaviors typical in retail markets' ",
                "- Healthcare data: 'Patient outcomes vary across treatment protocols in ways that align with clinical expectations' ",
                "- Educational data: 'Student performance shows variations that correspond to known factors in academic achievement' ",
                "- Financial data: 'Risk metrics demonstrate patterns consistent with market volatility principles' ",
                "",
                "CONTENT APPROACH: ",
                "- Describe visible trends and relationships between ALL fields with domain context ",
                "- Note how each dimension interacts with others in ways meaningful to the dataset domain ",
                "- Identify observable patterns across all visible variables and their domain significance ",
                "- Create narrative flow connecting all elements within the analytical goal framework ",
                "- Stay strictly to what's visually apparent while providing domain-relevant interpretation ",
                "- Use dataset_summary to inform field interpretation and domain-appropriate language ",
                "",
                "ENHANCED CONTENT DEPTH REQUIREMENTS: ",
                "- ALWAYS examine visualizations for non-obvious insights beyond first-glance patterns ",
                "- Look for SECONDARY PATTERNS that might be easily missed: ",
                "  * Subtle inflection points in trends ",
                "  * Non-linear relationships between variables ",
                "  * Clustering or grouping effects within categories ",
                "  * Proportional relationships that reveal efficiency or productivity insights ",
                "  * Variance patterns that indicate stability or volatility differences ",
                "",
                "- CONTEXTUAL STORYTELLING OPPORTUNITIES: ",
                "  * Connect patterns to likely business or domain explanations ",
                "  * Note seasonal, cyclical, or structural factors that might explain patterns ",
                "  * Identify performance tiers, segments, or natural groupings ",
                "  * Discuss scale effects, maturity relationships, or competitive dynamics ",
                "  * Comment on data quality indicators that affect interpretation confidence ",
                "",
                "- MAXIMIZE VALUE EXTRACTION from each visualization: ",
                "  * Don't just describe what's visible - explain what it might mean ",
                "  * Identify the most interesting or counter-intuitive findings ",
                "  * Note patterns that could inform strategic decisions or operational improvements ",
                "  * Comment on outliers or anomalies that merit further investigation ",
                "  * Discuss implications for stakeholders in the relevant domain ",
                "",
                "- COMPREHENSIVE PATTERN ANALYSIS: ",
                "  * Distribution characteristics: concentration, spread, skewness, multimodality ",
                "  * Relationship patterns: correlation strength, linearity, interaction effects ",
                "  * Temporal dynamics: trend directions, volatility, cyclical patterns, structural breaks ",
                "  * Categorical differences: between-group variations, within-group consistency ",
                "  * Hierarchical insights: how patterns change across different aggregation levels ",
                "",
                "FIELD MARKUP: ",
                '- Mark human-readable field labels: <span class="data-field">Field Label</span> ',
                "- Apply ONLY to the FIRST mention of each field - avoid repetitive span markup ",
                "- After introducing a field with span markup, refer to it naturally without spans ",
                "- EVERY field visible must be mentioned, but only wrapped in spans on first reference ",
                "- NO technical notation (variable_names, snake_case, CamelCase) ",
                "",
                "DATA VALUE MARKUP: ",
                '- Mark explicit data values: <span class="data-value" data-field="SourceField">Actual Value</span> ',
                "- ALWAYS include data-field attribute pointing to the source field ",
                "- Use human-readable field names in data-field attribute ",
                "- NEVER add quotes or other glyphs around data values ",
                "- Apply to specific categories, time periods, product names, etc. ",
                "",
                "MARKUP EXAMPLES: ",
                '- Field reference: <span class="data-field">Revenue</span> ',
                '- Category value: <span class="data-value" data-field="Region">Eastern Region</span> ',
                '- Time period: <span class="data-value" data-field="Quarter">Q3 2024</span> ',
                '- Product name: <span class="data-value" data-field="Product Line">Premium Series</span> ',
                "",
                "GOOD EXAMPLES (Direct observation style with domain contextualization and boolean precision): ",
                '\'<span class="data-field">Revenue</span> varies across different <span class="data-field">Region</span>s, with <span class="data-value" data-field="Region">Eastern Region</span> frequently showing above-average performance while customer acquisition demonstrates seasonal fluctuations most notably in <span class="data-value" data-field="Time Period">Q4</span>, aligning with typical retail holiday patterns.\' ',
                '\'Among the top-performing <span class="data-field">Product Category</span> segments, <span class="data-value" data-field="Product Category">Electronics</span> tends to achieve the strongest <span class="data-field">Sales Performance</span>, while even the lowest-ranked category in this subset maintains substantial market presence, suggesting a healthy product portfolio diversification.\' ',
                '\'Within the <span class="data-value" data-field="Customer Segment">Enterprise</span> segment, <span class="data-field">Monthly Revenue</span> from <span class="data-value" data-field="Product Line">Premium Series</span> shows predominantly upward movement throughout most of the analysis period, indicating successful market penetration in high-value accounts.\' ',
                '\'<span class="data-value" data-field="Company">Acme Corp</span> led <span class="data-field">Market Share</span> rankings (x-position) in most quarters but experienced a notable decline to third place in <span class="data-value" data-field="Quarter">Q2 2023</span>, while maintaining consistently strong <span class="data-field">Profit Margins</span> (color intensity) throughout all periods.\' ',
                '\'The <span class="data-field">Performance Metric</span> reveals an interesting leadership shift: <span class="data-value" data-field="Product">Product A</span> dominated early periods but yielded first position to <span class="data-value" data-field="Product">Product B</span> following a significant dip in <span class="data-value" data-field="Year">2022</span>.\' ',
                "",
                "ENHANCED EXAMPLES (Demonstrating semantic details and deeper insights): ",
                '\'<span class="data-field">Customer Acquisition</span> patterns reveal distinct seasonal cycles, with <span class="data-value" data-field="Quarter">Q4</span> consistently driving peak performance, though data gaps in <span class="data-value" data-field="Quarter">Q2 2021</span> limit trend confidence during that period.\' ',
                '\'<span class="data-field">Market Share</span> concentration shows the top three <span class="data-field">Competitors</span> controlling substantial territory, while the analysis focuses on entities exceeding $10M revenue, potentially excluding emerging players below this threshold.\' ',
                '\'<span class="data-field">Growth Rates</span> demonstrate clear maturity effects: newer <span class="data-value" data-field="Business Age">startups</span> exhibit higher volatility compared to established <span class="data-value" data-field="Business Age">10+ year</span> entities, suggesting different risk-return profiles across business lifecycles.\' ',
                '\'<span class="data-field">Regional Performance</span> varies significantly, with <span class="data-value" data-field="Region">Western territories</span> showing limited data density compared to <span class="data-value" data-field="Region">Eastern markets</span>, making western trend assessments more preliminary.\' ',
                '\'<span class="data-field">Efficiency Metrics</span> reveal an interesting threshold effect: performance improvement accelerates notably above the 15% <span class="data-field">Market Penetration</span> level, suggesting scale advantages emerge at that inflection point.\' ',
                "",
                "TEMPORAL EMERGENCE/DISAPPEARANCE EXAMPLES: ",
                '\'<span class="data-field">Product Categories</span> show interesting lifecycle patterns: <span class="data-value" data-field="Product">Digital Services</span> emerges as a new offering beginning in <span class="data-value" data-field="Quarter">Q2 2022</span>, while <span class="data-value" data-field="Product">Legacy Hardware</span> disappears from the analysis after <span class="data-value" data-field="Quarter">Q4 2021</span>, suggesting portfolio modernization.\' ',
                '\'The <span class="data-field">Revenue Streams</span> analysis reveals strategic shifts: <span class="data-value" data-field="Revenue Type">Subscription Model</span> first appears mid-timeline in <span class="data-value" data-field="Year">2023</span> and quickly gains traction, while traditional <span class="data-value" data-field="Revenue Type">One-time Sales</span> show declining values throughout all visible periods but maintain continuous presence.\' ',
                '\'<span class="data-field">Market Segments</span> demonstrate different temporal dynamics: <span class="data-value" data-field="Segment">Premium Tier</span> emerges in the dataset starting <span class="data-value" data-field="Month">March 2022</span>, indicating market expansion, whereas <span class="data-value" data-field="Segment">Enterprise</span> maintains steady presence with fluctuating <span class="data-field">Performance</span> levels.\' ',
                "",
                "AVOID: ",
                "- Chart/visualization references ('The chart shows...', 'The graph displays...') ",
                "- Specific numbers or percentages ",
                "- Overstated claims or superlatives without qualification ",
                "- Technical field names ",
                "- Absolute statements that have exceptions ('always', 'never', 'consistently' when not 100% true) ",
                "- Unqualified claims about relative position ('high' when actually mid-range) ",
                "- Trivial observations that add no insight value ",
                "- Obvious ranking statements ('top performers perform well', 'lowest in top-10 still strong') ",
                "- Self-evident filtering context ('these top items show good results') ",
                "- Unfair comparisons between groups with vastly different sample sizes without acknowledgment ",
                "- Drawing strong conclusions from small samples without appropriate caveats ",
                "- Robotic or repetitive phrasing ",
                "- Missing any visible fields in the description ",
                "- Untagged data values (always use data-value spans for explicit values) ",
                "- Quotes or glyphs around data values ",
                "- Repetitive span markup (only wrap field names on first mention) ",
                "- TEMPORAL RANKING PITFALLS TO AVOID: ",
                "  * 'Consistently led throughout the entire period' (requires 100% verification across all time points) ",
                "  * 'Consistently leading the market' (implies leadership in ALL time periods without exception) ",
                "  * 'Consistently outperforming competitors' (absolute claim requiring verification across every time point) ",
                "  * 'Consistently ranked first' (implies first place in ALL visible periods) ",
                "  * 'Consistently maintained top position' (suggests unbroken leadership across entire timeframe) ",
                "  * 'Always maintained top position' (absolute claim without acknowledging any dips or exceptions) ",
                "  * 'Performance remained stable over time' (ignores interesting temporal disruptions and patterns) ",
                "  * 'Never fell below second place' (absolute negative claim requiring complete verification) ",
                "  * 'Continuous upward trend' (ignores any downward movements or fluctuations) ",
                "  * 'Steady leadership throughout' (misses compelling stories about leadership changes or challenges) ",
                "  * 'Uniform performance across all periods' (overlooks interesting temporal variations and anomalies) ",
                "  * Generic statements that miss the most compelling temporal narrative (dips, recoveries, leadership shifts) ",
                "  * REMEMBER: 'Consistently' + any performance claim = absolute assertion requiring 100% temporal verification ",
                "",
                "- TEMPORAL EMERGENCE/DISAPPEARANCE PITFALLS TO AVOID: ",
                "  * 'Revenue increased from zero in Q3' when describing category emergence (should be 'Category emerges in Q3 as new business segment') ",
                "  * 'Performance decreased to zero after March' when describing category disappearance (should be 'Category disappears after March, suggesting discontinuation') ",
                "  * 'Category X went from 0 to significant levels' (should be 'Category X emerges mid-timeline and quickly establishes presence') ",
                "  * Treating emergence as casual increase and disappearance as casual decrease ",
                "  * Missing the strategic/business implications of categories entering or exiting the analysis scope ",
                "  * Confusing data visualization artifacts with actual business phenomena ",
                "  * Not distinguishing between 'not yet launched' and 'declining performance' ",
                "  * Not distinguishing between 'discontinued/exited' and 'temporary poor performance' ",
            )
        )
    )
