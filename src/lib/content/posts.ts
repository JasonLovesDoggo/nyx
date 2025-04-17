import { error } from '@sveltejs/kit';
import type { SvelteComponent } from 'svelte';

export interface PostMetadata {
	title: string;
	description: string;
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

let _allPosts: PostEntry[];
export function getAllPosts(): PostEntry[] {
	if (!_allPosts) {
		_allPosts = Object.entries(postModules)
			.map(([path, mod]) => ({
				slug: slugFrom(path),
				metadata: (mod as PostEntry).metadata as PostMetadata
			}))
			.filter((p) => {
				const publishedAt = p.metadata.published_at;
				return publishedAt && !isNaN(new Date(publishedAt).getTime());
			})
			.sort((a, b) => +new Date(b.metadata.published_at!) - +new Date(a.metadata.published_at!));
	}
	return _allPosts;
}

export function getPostBySlug(slug: string): PostPageData {
	const path = `/content/posts/${slug}.svx`;
	const mod = (postModules as Record<string, SvelteComponent>)[path];
	if (!mod || !mod.metadata.published_at) throw error(404, `Post not found: ${slug}`);
	return { slug, metadata: mod.metadata, content: mod.default } satisfies PostPageData;
}

let _latestPosts: PostEntry[];
const postcount = 2;
export function getLatestPosts(): PostEntry[] {
	if (!_latestPosts) {
		_latestPosts = getAllPosts().slice(0, postcount);
	}
	return _latestPosts;
}
