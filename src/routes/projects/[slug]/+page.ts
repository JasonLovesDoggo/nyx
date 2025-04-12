// src/routes/projects/[slug]/+page.ts
import type { Load } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import type { ProjectMetadata, ProjectPageData } from '$types/projects';

export const load: Load = async ({ params }) => {
	const { slug } = params;

	// Use import.meta.glob NON-eagerly to get import functions
	// The key needs to match the structure Vite expects for dynamic imports
	const modules = import.meta.glob('/src/content/projects/*.svx');

	const modulePath = `/src/content/projects/${slug}.svx`;

	if (!modules[modulePath]) {
		throw error(404, `Project not found: ${slug}`);
	}

	try {
		// Dynamically import the module using the function from the glob result
		const module = (await modules[modulePath]()) as { metadata: ProjectMetadata; default: any };

		if (!module || !module.metadata || !module.default) {
			throw new Error(`Invalid project file structure for ${slug}`);
		}

		// Ensure the project is published (optional check, could rely on index filtering)
		if (!module.metadata.published) {
			throw error(404, `Project not found: ${slug}`);
		}

		return {
			slug: slug as string,
			metadata: module.metadata,
			content: module.default // Pass the compiled Svelte component
		} satisfies Omit<ProjectPageData, 'metadata'> & { metadata: ProjectMetadata }; // Ensure structure matches type
	} catch (e) {
		console.error(`Error loading project ${slug}:`, e);
		throw error(500, `Could not load project: ${slug}`);
	}
};

// --- For Prerendering ---
export const prerender = true;

export async function entries() {
	const modules = import.meta.glob('/src/content/projects/*.svx', { eager: true });
	const entries = [];

	for (const filePath in modules) {
		const module = modules[filePath] as { metadata: ProjectMetadata | undefined };
		const metadata = module?.metadata as ProjectMetadata | undefined;

		// Only generate pages for published projects
		if (metadata && metadata.published) {
			const slug = filePath.split('/').pop()?.replace('.svx', '');
			if (slug) {
				entries.push({ slug });
			}
		}
	}
	return entries;
}
