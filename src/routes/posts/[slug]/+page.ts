import type { PageLoad, EntryGenerator } from './$types';
import { getAllPosts, getPostBySlug } from '$lib/content/posts';

export const prerender = true;

export const entries: EntryGenerator = () => getAllPosts().map((p) => ({ slug: p.slug }));

export const load: PageLoad = ({ params }) => getPostBySlug(params.slug);
