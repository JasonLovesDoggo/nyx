import type { PageServerLoad } from './$types';
import path from 'path';

interface hasMetadata {
	metadata: Record<string, unknown>;
}

// Define a simple type for your project frontmatter (adjust as needed)
// You might want to move this to a shared types file like src/lib/types.ts
interface ProjectMetadata {
	title: string;
	description: string;
	date: string;
	published: boolean;
	featured?: boolean;
	tags?: string[];
}

// Define the structure of the project data we'll pass to the page
interface FeaturedProject {
	slug: string;
	metadata: ProjectMetadata;
}

export const load: PageServerLoad = async () => {
	// Use Vite's import.meta.glob to find all .svx files in the projects folder
	// `eager: true` imports them immediately at build time
	// The path starts from the project root directory
	const modules: Record<string, hasMetadata> = import.meta.glob('/src/content/projects/*.svx', {
		eager: true
	});

	const featuredProjects: FeaturedProject[] = [];

	for (const filePath in modules) {
		const module = modules[filePath];
		const metadata = module?.metadata as unknown as ProjectMetadata | undefined;

		if (metadata && metadata.published && metadata.featured === true) {
			// Extract the slug from the filename (e.g., 'cool-project-a.svx' -> 'cool-project-a')
			const slug = path.parse(filePath).name;

			featuredProjects.push({
				slug: slug,
				metadata: metadata
			});
		}
	}

	// Sort featured projects, for example, by date descending
	featuredProjects.sort(
		(a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
	);

	return {
		featuredProjects // Return only the projects loaded by this page server load
	};
};
