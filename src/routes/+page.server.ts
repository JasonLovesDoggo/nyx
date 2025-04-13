// src/routes/+page.server.ts
import type { PageServerLoad } from './$types';
import { getAllPublishedProjects } from '$lib/content/loader';
import type { ProjectMetadata } from '$types/projects'; // Import from shared loader
// Remove 'path' import if no longer needed

// You might want to move this definition if used elsewhere, maybe $types/projects?
interface FeaturedProject {
	slug: string;
	metadata: ProjectMetadata; // Assuming ProjectMetadata is globally available or imported from $types/projects
}

export const load: PageServerLoad = async () => {
	const allPublished = getAllPublishedProjects();

	const featuredProjects: FeaturedProject[] = allPublished
		.filter((project) => project.metadata.featured === true)
		// No need to sort by date again if getAllPublishedProjects already does
		.map((project) => ({
			slug: project.slug,
			metadata: project.metadata
		}));

	// You might want to limit the number of featured projects, e.g., .slice(0, 5)

	return {
		featuredProjects
	};
};
