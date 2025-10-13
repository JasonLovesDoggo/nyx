import type { PageServerLoad } from '$types';
import { getFeaturedProjects } from '$lib/content/projects';
import { fetchLatestCommits } from '$lib/api/commits';
import { getLatestPosts } from '$lib/content/posts';
import { measurePerformance, measureSync } from '$lib/utils/performance';

export const load: PageServerLoad = async () => {
	return await measurePerformance('homepage-load-total', async () => {
		const [featuredProjects, commitData, latestPosts] = await Promise.all([
			Promise.resolve(measureSync('get-featured-projects', () => getFeaturedProjects())),
			fetchLatestCommits(),
			Promise.resolve(
				measureSync('get-latest-posts', () =>
					getLatestPosts().filter((post) => post.metadata?.published_at)
				)
			)
		]);

		return {
			featuredProjects,
			commitData,
			latestPosts
		};
	});
};
