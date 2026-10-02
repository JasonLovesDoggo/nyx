import { getAllPosts, getPostBySlug } from '#lib/content/posts.js';
import { createContentPage } from '#lib/utils/pagemeta.js';

const { prerender, entries, load } = createContentPage({
	getAll: getAllPosts,
	getBySlug: getPostBySlug
});

export { prerender, entries, load };
