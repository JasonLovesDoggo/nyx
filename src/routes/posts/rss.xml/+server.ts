import Site from '$lib/config/common';
import { getAllPosts } from '$lib/content/posts';

export const prerender = true;

export async function GET() {
	const posts = (await getAllPosts()).filter((post) => post.metadata?.published_at);

	const headers = { 'Content-Type': 'application/xml' };

	const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
	<channel>
		<title>${Site.name}'s Posts</title>
		<description>${Site.description}</description>
		<link>${Site.url}</link>
		<atom:link href="${Site.url}/posts/rss.xml" rel="self" type="application/rss+xml"/>
		<language>en-us</language>
		<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
		${posts
			.map(
				(post) => `
		<item>
			<title><![CDATA[${post.metadata!.title.text}]]></title>
			<description><![CDATA[${post.metadata!.description}]]></description>
			<link>${Site.url}/posts/${post.slug}</link>
			<guid isPermaLink="true">${Site.url}/posts/${post.slug}</guid>
			<pubDate>${new Date(post.metadata!.published_at!).toUTCString()}</pubDate>
		</item>`
			)
			.join('')}
	</channel>
</rss>`.trim();

	return new Response(xml, { headers });
}
