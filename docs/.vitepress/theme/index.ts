import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { h } from "vue";
import ReportIframe from "./components/ReportIframe.vue";
import ReportLink from "./components/ReportLink.vue";
import GalleryGrid from "./components/GalleryGrid.vue";
import GalleryCard from "./components/GalleryCard.vue";
import "./custom.css";
import { withBase } from "./utils";

export default {
	extends: DefaultTheme,
	Layout: () => {
		return h(DefaultTheme.Layout, null, {
			// https://vitepress.dev/guide/extending-default-theme#layout-slots
		});
	},
	enhanceApp({ app, router, siteData }) {
		// https://vitepress.dev/guide/extending-default-theme#registering-global-components

		// Register the report components globally
		app.component("ReportIframe", ReportIframe);
		app.component("ReportLink", ReportLink);

		// Register the gallery components globally
		app.component("GalleryGrid", GalleryGrid);
		app.component("GalleryCard", GalleryCard);

		// Make withBase available globally for use in markdown files
		if (typeof window !== "undefined") {
			window.withBase = withBase;
		}

		// Also make it available as a global property
		app.config.globalProperties.$withBase = withBase;
	},
} satisfies Theme;
