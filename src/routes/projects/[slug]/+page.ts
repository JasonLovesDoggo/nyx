import type { Load } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import {
	getProjectBySlug,
	getAllPublishedProjectSlugs,
	loadProjectComponent
} from '$lib/content/loader'; // Import from shared loader
import type { ProjectPageData } from '$types/projects';

// --- Load Function ---
export const load: Load = async ({ params }) => {
	const { slug } = params;

	if (!slug) {
		throw error(400, 'Slug is required');
	}

	// 1. Get pre-compiled metadata
	const projectMeta = getProjectBySlug(slug);

	if (!projectMeta) {
		// No need to check published status here, getProjectBySlug only returns published ones
		throw error(404, `Project not found: ${slug}`);
	}

	// 2. Dynamically load the component content
	const component = await loadProjectComponent(slug);

	if (!component) {
		// This indicates an issue with the dynamic import glob or file structure
		console.error(`Could not dynamically load component for slug: ${slug}`);
		throw error(500, `Could not load project content: ${slug}`);
	}

	// Combine metadata and content
	return {
		slug: slug, // projectMeta.slug is the same
		metadata: projectMeta.metadata,
		content: component
	} satisfies ProjectPageData; // Ensure the return type matches
};

// --- Prerendering ---
export const prerender = true;

// Use the shared loader to get slugs for prerendering
export async function entries() {
	return getAllPublishedProjectSlugs();
}
