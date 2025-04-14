// import Site from '$lib/config/common'
// import { getAllPosts } from '$lib/content/posts';
//
// export async function GET({ fetch }) {
// 	const posts = getAllPosts()
//
// 	const headers = { 'Content-Type': 'application/xml' }
//
// 	const xml = `
// 		<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
// 			<channel>
// 				<title>${Site.title}</title>
// 				<description>${Site.description}</description>
// 				<link>${Site.url}</link>
// 				<atom:link href="${Site.url}/posts/rss.xml" rel="self" type="application/rss+xml"/>
// 				${posts
// 		.map(
// 			(post) => `
// 						<item>
// 							<title>${post.metadata.title}</title>
// 							<description>${post.metadata.description}</description>
// 							<link>${Site.url}/posts/${post.slug}</link>
// 							<guid isPermaLink="true">${Site.url}/posts/${post.slug}</guid>
// 							<pubDate>${new Date(post.metadata.published_at).toUTCString()}</pubDate>
// 						</item>
// 					`
// 		)
// 		.join('')}
// 			</channel>
// 		</rss>
// 	`.trim()
//
// 	return new Response(xml, { headers })
// }
