import { getAllProjects, getProjectBySlug } from '$lib/content/projects';
import { createContentPage } from '$lib/utils/pagemeta';

const { prerender, entries, load } = createContentPage({
	getAll: getAllProjects,
	getBySlug: getProjectBySlug
});

export { prerender, entries, load };
