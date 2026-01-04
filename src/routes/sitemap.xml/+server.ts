import Site from '$lib/config/common';
import { getAllPosts } from '$lib/content/posts';
import { getAllProjects } from '$lib/content/projects';
import { getAllTutorials } from '$lib/content/tutorials';

export const prerender = true;

export async function GET() {
	const [posts, projects, tutorials] = await Promise.all([
		getAllPosts(),
		getAllProjects(),
		getAllTutorials()
	]);
	const publishedPosts = posts.filter((post) => post.metadata?.published_at);
	const publishedProjects = projects.filter((project) => project.metadata?.published);
	const publishedTutorials = tutorials.filter((tutorial) => tutorial.metadata?.published_at);

	const staticPages = [
		{ path: '', priority: '1.0', changefreq: 'weekly' },
		{ path: '/about', priority: '0.8', changefreq: 'monthly' },
		{ path: '/posts', priority: '0.8', changefreq: 'weekly' },
		{ path: '/projects', priority: '0.8', changefreq: 'monthly' },
		{ path: '/tutorials', priority: '0.8', changefreq: 'monthly' },
		{ path: '/socials', priority: '0.5', changefreq: 'monthly' },
		{ path: '/pics', priority: '0.6', changefreq: 'monthly' }
	];

	const headers = { 'Content-Type': 'application/xml' };

	const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	${staticPages
		.map(
			(page) => `
	<url>
		<loc>${Site.url}${page.path}</loc>
		<changefreq>${page.changefreq}</changefreq>
		<priority>${page.priority}</priority>
	</url>`
		)
		.join('')}
	${publishedPosts
		.map(
			(post) => `
	<url>
		<loc>${Site.url}/posts/${post.slug}</loc>
		<lastmod>${new Date(post.metadata!.published_at!).toISOString()}</lastmod>
		<changefreq>monthly</changefreq>
		<priority>0.7</priority>
	</url>`
		)
		.join('')}
	${publishedProjects
		.map(
			(project) => `
	<url>
		<loc>${Site.url}/projects/${project.slug}</loc>
		<lastmod>${project.metadata?.date ? new Date(project.metadata.date).toISOString() : new Date().toISOString()}</lastmod>
		<changefreq>monthly</changefreq>
		<priority>0.6</priority>
	</url>`
		)
		.join('')}
	${publishedTutorials
		.map(
			(tutorial) => `
	<url>
		<loc>${Site.url}/tutorials/${tutorial.slug}</loc>
		<lastmod>${new Date(tutorial.metadata!.published_at!).toISOString()}</lastmod>
		<changefreq>monthly</changefreq>
		<priority>0.6</priority>
	</url>`
		)
		.join('')}
</urlset>`.trim();

	return new Response(xml, { headers });
}
