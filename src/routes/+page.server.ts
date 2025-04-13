import type { PageServerLoad } from './$types';
import { getFeaturedProjects } from '$lib/content/projects';

export const load: PageServerLoad = () => ({
	featuredProjects: getFeaturedProjects()
});
