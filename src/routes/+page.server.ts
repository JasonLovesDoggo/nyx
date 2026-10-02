import { env } from 'cloudflare:workers';
import type { PageServerLoad } from './$types';
import { getFeaturedProjects } from '#lib/content/projects.js';
import { fetchLatestCommits } from '#lib/api/commits.js';
import { getLatestPosts } from '#lib/content/posts.js';
import { measurePerformance } from '#lib/utils/performance.js';

export const load: PageServerLoad = async () => {
	const kv = env.NYXCACHE;

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
