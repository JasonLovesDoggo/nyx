import type { Load } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import type { ProjectMetadata, ProjectPageData } from '$types/projects';

const modules = import.meta.glob('/src/content/projects/*.svx');

// --- Load Function ---
export const load: Load = async ({ params }) => {
	const { slug } = params;
	const modulePath = `/src/content/projects/${slug}.svx`;

	if (!modules[modulePath]) {
		throw error(404, `Project not found: ${slug}`);
	}

	try {
		const module = (await modules[modulePath]()) as { metadata: ProjectMetadata; default: any };

		if (!module || !module.metadata || !module.default) {
			throw new Error(`Invalid project file structure for ${slug}`);
		}

		if (!module.metadata.published) {
			throw error(404, `Project not found: ${slug}`);
		}

		return {
			slug: slug as string,
			metadata: module.metadata,
			content: module.default
		} satisfies Omit<ProjectPageData, 'metadata'> & { metadata: ProjectMetadata };
	} catch (e) {
		console.error(`Error loading project ${slug}:`, e);
		throw error(500, `Could not load project: ${slug}`);
	}
};

// --- Prerendering ---
export const prerender = true;

export async function entries() {
	const metadataModules = import.meta.glob('/src/content/projects/*.svx', { eager: true });
	const entries = [];

	for (const filePath in metadataModules) {
		const module = metadataModules[filePath] as { metadata?: ProjectMetadata };
		if (module?.metadata?.published) {
			const slug = filePath.split('/').pop()?.replace('.svx', '');
			if (slug) {
				entries.push({ slug });
			}
		}
	}
	return entries;
}
