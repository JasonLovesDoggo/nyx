import type { PageLoad, EntryGenerator } from './$types';
import { getProjectBySlug, getAllProjects } from '$lib/content/projects';

export const load: PageLoad = ({ params }) => getProjectBySlug(params.slug);

export const prerender = true;
export const entries: EntryGenerator = () => getAllProjects().map((p) => ({ slug: p.slug }));
