import { getAllPosts } from '$lib/content/posts';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = () => ({
	posts: getAllPosts()
});
