import type { PageServerLoad } from './$types';
import { getAllProjects } from '$lib/content/projects';

export const load: PageServerLoad = async () => ({
	projects: getAllProjects()
});
