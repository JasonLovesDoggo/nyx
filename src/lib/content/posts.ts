import { error } from '@sveltejs/kit';
import type { SvelteComponent } from 'svelte';

export interface PostMetadata {
	title: string;
	description: string;
	imageUrl?: string; // a header image
	updated_at?: string;
	published_at?: string; // if it's not set, it won't be published
	tags?: string[];
}

export interface PostEntry {
	slug: string;
	metadata: PostMetadata;
}

export interface PostPageData extends PostEntry {
	content: ConstructorOfATypedSvelteComponent;
}

// Eager‑glob at build time
const postModules = import.meta.glob('/content/posts/*.svx', { eager: true });

// Helpers
function slugFrom(path: string) {
	return path.split('/').pop()!.replace('.svx', '');
}

let _allPosts: { slug: string; metadata: PostMetadata | undefined }[];
export function getAllPosts(): { slug: string; metadata: PostMetadata | undefined }[] {
	if (!_allPosts) {
		_allPosts = Object.entries(postModules)
			.map(([path, mod]) => {
				const metadata = (mod as PostEntry)?.metadata as PostMetadata | undefined;

				if (!metadata) {
					console.error('❌ Invalid post module (YAML frontmatter failed to parse):', {
						path,
						suggestion:
							'Check for unquoted colons, em-dashes, or invalid YAML syntax in frontmatter'
					});
				} else if (!metadata.published_at) {
					console.error('❌ Invalid post module (missing published_at):', { path });
				}

				return {
					slug: slugFrom(path),
					metadata
				};
			})
			.filter((p) => {
				const publishedAt = p.metadata?.published_at;
				return publishedAt && !isNaN(new Date(publishedAt).getTime());
			})
			.sort((a, b) => +new Date(b.metadata!.published_at!) - +new Date(a.metadata!.published_at!));
	}
	return _allPosts;
}

export function getPostBySlug(slug: string): PostPageData {
	const path = `/content/posts/${slug}.svx`;
	const mod = (postModules as Record<string, SvelteComponent>)[path];
	if (!mod || !mod.metadata.published_at) throw error(404, `Post not found: ${slug}`);
	return { slug, metadata: mod.metadata, content: mod.default } satisfies PostPageData;
}

let _latestPosts: { slug: string; metadata: PostMetadata | undefined }[];
const postcount = 2;
export function getLatestPosts(): { slug: string; metadata: PostMetadata | undefined }[] {
	if (!_latestPosts) {
		_latestPosts = getAllPosts().slice(0, postcount);
	}
	return _latestPosts;
}
