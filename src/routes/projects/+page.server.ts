import { getAllProjects } from '#lib/content/projects.js';
import { createListingPage } from '#lib/utils/pagemeta.js';

export const { load } = createListingPage(getAllProjects, 'projects');
