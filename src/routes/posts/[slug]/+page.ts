import { getAllPosts, getPostBySlug } from '$lib/content/posts';
import { createContentPage } from '$lib/utils/pagemeta';

const { prerender, entries, load } = createContentPage({
	getAll: getAllPosts,
	getBySlug: getPostBySlug
});

export { prerender, entries, load };
