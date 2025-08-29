import { defineConfig, type HeadConfig } from "vitepress";

// --- Analytics Setup ---
const umamiScript: HeadConfig = [
	"script",
	{
		defer: "true",
		src: "https://umami.peter.gy/script.js",
		"data-website-id": "d17da906-f3aa-4ace-b492-c520366e2a0c",
	},
];

const baseHeaders: HeadConfig[] = [];

// Enable analytics only in production
const headers =
	process.env.NODE_ENV === "production"
		? [...baseHeaders, umamiScript]
		: baseHeaders;

const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME || "VISxGenAI-2025";

// --- Site Configuration ---
// https://vitepress.dev/reference/site-config
export default defineConfig({
	head: headers,
	title: "Agentic Visual Reporting",
	description: "Submission for the 2025 IEEE VISxGenAI Workshop Challenge.",

	// Sets the base path for deployment to GitHub Pages
	base: process.env.NODE_ENV === "production" ? `/${GITHUB_REPO_NAME}/` : "/",
	srcDir: ".",

	// Clean URLs remove the .html extension
	cleanUrls: true,

	themeConfig: {
		// Optional: Add a small logo in docs/public/logo.svg
		logo: {
			light: "/assets/logo-light.svg",
			dark: "/assets/logo-dark.svg",
			alt: "Site logo",
		},

		nav: [
			{ text: "Overview", link: "/" },
			{ text: "Report Gallery", link: "/gallery/" },
			{ text: "Principles", link: "/principles/" },
			{ text: "System Design", link: "/paper/" },
		],

		sidebar: {
			// Fallback sidebar for root pages like Home and Submission
			"/": [
				{
					text: "Project Overview",
					items: [
						{
							text: "Read Challenge Submission",
							link: "/gallery/vispub-submission",
						},
						{ text: "Explore the Report Gallery", link: "/gallery/" },
						{ text: "See Design Principles in Action", link: "/principles/" },
						{ text: "Read our Whitepaper", link: "/paper/" },
					],
				},
			],

			// Sidebar for the Report Gallery section
			"/gallery/": [
				{
					text: "Report Gallery",
					collapsed: false,
					items: [
						{
							text: "Challenge Dataset",
							collapsed: false,
							items: [
								{
									text: "Challenge Submission",
									link: "/gallery/vispub-submission",
								},
								{
									text: "Case Study: A Flawed Insight",
									link: "/gallery/vispub-flawed-insight",
								},
								{
									text: "Clear Insights",
									link: "/gallery/vispub-minimalistic",
								},
								{
									text: "Complex Patterns",
									link: "/gallery/vispub-multifaceted",
								},
							],
						},
						{
							text: "General Domain Datasets",
							collapsed: false,
							items: [
								{ text: "Barley", link: "/gallery/barley" },
								{ text: "Cars", link: "/gallery/cars" },
								{ text: "Cars 93", link: "/gallery/cars93" },
								{ text: "Diamonds", link: "/gallery/diamonds" },
								{ text: "Driving", link: "/gallery/driving" },
								{ text: "Iris", link: "/gallery/iris" },
								{ text: "Mammal Sleep", link: "/gallery/mammal-sleep" },
							],
						},
					],
				},
			],

			"/principles/": [
				{
					text: "Principles",
					collapsed: false,
					items: [
						{
							text: "🧩 Composability & Modularity",
							link: "/principles/composability-and-modularity",
						},
						{
							text: "🔍 Explainability & Trust",
							link: "/principles/explainability-and-trust",
						},
						{
							text: "🧭 Interactive Exploration",
							link: "/principles/interactive-exploration",
						},
						{
							text: "🎯 Granularity & Agency",
							link: "/principles/granularity-and-agency",
						},
					],
				},
			],
		},

		footer: {
			message: `Collaboration between <a href="https://vda.cs.univie.ac.at/" target="_blank" rel="noopener noreferrer">UniWien Visualization and Data Analysis Group</a>, <a href="https://dig.cmu.edu/" target="_blank" rel="noopener noreferrer">CMU Data Interaction Group</a>, and <a href="https://mbzuai.ac.ae/" target="_blank" rel="noopener noreferrer">MBZUAI Human-computer interaction Group</a>.`,
			copyright: `A submission to the <a href="https://visxgenai.github.io/" target="_blank" rel="noopener noreferrer">2025 IEEE VISxGenAI Workshop Challenge</a>`,
		},

		// Improves search functionality
		search: {
			provider: "local",
		},

		socialLinks: [
			{ icon: "github", link: "https://github.com/peter-gy/VISxGenAI-2025" },
		],
	},
});
