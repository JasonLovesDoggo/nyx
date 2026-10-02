import { getAllProjects, getProjectBySlug } from '#lib/content/projects.js';
import { createContentPage } from '#lib/utils/pagemeta.js';

const { prerender, entries, load } = createContentPage({
	getAll: getAllProjects,
	getBySlug: getProjectBySlug
});

export { prerender, entries, load };
