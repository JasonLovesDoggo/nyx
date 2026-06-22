import Site from '$lib/config/common';
import type { PostPageData } from '$lib/content/posts';
import type { BlogPosting, Graph, Person, ProfilePage, WebSite, WithContext } from 'schema-dts';

const siteId = `${Site.url}/#website`;
const personId = `${Site.url}/#person`;
type JsonLd = Graph | WithContext<BlogPosting>;

export function siteUrl(path: string): string {
	return new URL(path, Site.url).href;
}

export function jsonLd(data: JsonLd): string {
	return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function baseJsonLd(pathname: string): Graph {
	const graph: Array<WebSite | Person | ProfilePage> = [
		{
			'@type': 'WebSite',
			'@id': siteId,
			url: Site.url,
			name: Site.name,
			description: Site.description,
			inLanguage: 'en-CA',
			publisher: { '@id': personId }
		},
		{
			'@type': 'Person',
			'@id': personId,
			name: Site.seo.author,
			givenName: 'Jason',
			familyName: 'Cameron',
			alternateName: ['jsoncam', 'jasonlovesdoggo', 'json'],
			url: Site.url,
			image: siteUrl('/images/avatar.webp'),
			description: 'Senior Software Engineer based in Toronto, Canada.',
			jobTitle: 'Senior Software Engineer',
			birthDate: Site.seo.birthDate,
			worksFor: {
				'@type': 'Organization',
				name: Site.seo.worksFor.name,
				url: Site.seo.worksFor.url
			},
			address: {
				'@type': 'PostalAddress',
				addressLocality: Site.seo.location.city,
				addressRegion: Site.seo.location.region,
				addressCountry: Site.seo.location.country
			},
			sameAs: [
				Site.out.github,
				Site.out.linkedin,
				Site.out.instagram,
				Site.out.bluesky,
				Site.out.wakatime
			],
			knowsAbout: [
				'Software Engineering',
				'DevOps',
				'Golang',
				'Python',
				'Web Development',
				'Backend Development'
			]
		}
	];

	if (pathname === '/') {
		graph.push({
			'@type': 'ProfilePage',
			'@id': `${Site.url}/#webpage`,
			url: Site.url,
			isPartOf: { '@id': siteId },
			name: `About ${Site.seo.author}`,
			inLanguage: 'en-CA',
			mainEntity: { '@id': personId }
		});
	}

	return { '@context': 'https://schema.org', '@graph': graph };
}

export function postJsonLd(post: PostPageData): WithContext<BlogPosting> {
	const url = siteUrl(`/posts/${post.slug}`);

	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		'@id': `${url}#blogposting`,
		url,
		mainEntityOfPage: { '@id': `${url}#webpage` },
		headline: post.metadata.title.text,
		description: post.metadata.description,
		keywords: post.metadata.tags?.join(', ') ?? '',
		inLanguage: 'en-CA',
		datePublished: post.metadata.published_at ?? '',
		dateModified: post.metadata.updated_at ?? post.metadata.published_at ?? '',
		author: { '@id': personId },
		publisher: { '@id': personId },
		image: post.metadata.image
			? {
					'@type': 'ImageObject',
					'@id': `${url}#image`,
					url: siteUrl(post.metadata.image.url)
				}
			: siteUrl('/og-image.png')
	};
}
