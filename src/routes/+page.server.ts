import type { PageServerLoad } from './$types';
import { getFeaturedProjects } from '$lib/content/projects';
import { fetchLatestCommits } from '$lib/api/commits';
import { getLatestPosts } from '$lib/content/posts';
import { measurePerformance } from '$lib/utils/performance';

export const load: PageServerLoad = async (event) => {
	const kv = event.platform?.env?.NYXCACHE;

	return await measurePerformance('homepage-load-total', async () => {
		const [featuredProjects, commitData, latestPosts] = await Promise.all([
			measurePerformance('get-featured-projects', () => getFeaturedProjects()),
			fetchLatestCommits(kv),
			measurePerformance('get-latest-posts', async () => {
				const posts = await getLatestPosts();
				return posts.filter((post) => post.metadata?.published_at);
			})
		]);

		return {
			featuredProjects,
			commitData,
			latestPosts
		};
	});
};
