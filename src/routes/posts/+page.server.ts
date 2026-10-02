import { getAllPosts } from '#lib/content/posts.js';
import { createListingPage } from '#lib/utils/pagemeta.js';

export const { load } = createListingPage(getAllPosts, 'posts');
