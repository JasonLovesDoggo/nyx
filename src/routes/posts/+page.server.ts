import { getAllPosts } from '$lib/content/posts';
import { createListingPage } from '$lib/utils/pagemeta';

export const { load } = createListingPage(getAllPosts, 'posts');
