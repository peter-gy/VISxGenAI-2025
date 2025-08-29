// Utility function to generate environment-aware URLs
export function withBase(path: string): string {
	// Get the base path from VitePress site data or fallback to environment check
	const base =
		typeof window !== "undefined" && (window as any).__VP_SITE_DATA__?.base
			? (window as any).__VP_SITE_DATA__.base
			: process.env.NODE_ENV === "production"
				? `/${process.env.GITHUB_REPO_NAME || "VISxGenAI-2025"}/`
				: "/";

	// Remove leading slash from path to avoid double slashes
	const cleanPath = path.startsWith("/") ? path.slice(1) : path;

	// Combine base and path, ensuring proper slash handling
	return base.endsWith("/") ? `${base}${cleanPath}` : `${base}/${cleanPath}`;
}

// Make it available globally for markdown files
declare global {
	interface Window {
		withBase: typeof withBase;
	}
}

export default withBase;
