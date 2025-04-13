import type { PageServerLoad } from './$types';
import { getAllPublishedProjects } from '$lib/content/loader'; // Import from shared loader

export const load: PageServerLoad = async () => {
	const projects = getAllPublishedProjects();

	// No need to sort here, already sorted in contentLoader
	return {
		projects
	};
};
