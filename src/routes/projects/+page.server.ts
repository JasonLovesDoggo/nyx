import { getAllProjects } from '$lib/content/projects';
import { createListingPage } from '$lib/utils/pagemeta';

export const { load } = createListingPage(getAllProjects, 'projects');
