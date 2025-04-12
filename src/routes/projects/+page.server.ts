// src/routes/projects/+page.server.ts
import type { PageServerLoad } from './$types';
import path from 'path';
import type { ProjectEntry, ProjectMetadata, WithMetadata } from '$types/projects';

export const load: PageServerLoad = async () => {
	const modules = import.meta.glob('/src/content/projects/*.svx', { eager: true });
	const projects: ProjectEntry[] = [];

	for (const filePath in modules) {
		const module = modules[filePath] as WithMetadata;
		const metadata = module?.metadata as unknown as ProjectMetadata | undefined;

		// Only include published projects
		if (metadata && metadata.published) {
			const slug = path.parse(filePath).name;
			projects.push({
				slug: slug,
				metadata: metadata
			});
		}
	}

	// Sort projects by date, newest first
	projects.sort(
		(a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
	);

	return {
		projects
	};
};
