import { error } from '@sveltejs/kit';
import type { SvelteComponent } from 'svelte';

export interface PostMetadata {
	title: string;
	description: string;
	date: string;
	updated?: string;
	published: boolean;
	featured?: boolean;
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
const postModules = import.meta.glob('/src/content/posts/*.svx', { eager: true });

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
			.filter((p) => p.metadata.published)
			.sort((a, b) => +new Date(b.metadata.date) - +new Date(a.metadata.date));
	}
	return _allPosts;
}

let _featuredPosts: PostEntry[];
export function getFeaturedPosts(): PostEntry[] {
	if (!_featuredPosts) {
		_featuredPosts = getAllPosts().filter((p) => p.metadata.featured);
	}
	return _featuredPosts;
}

export function getPostBySlug(slug: string): PostPageData {
	const path = `/src/content/posts/${slug}.svx`;
	const mod = (postModules as Record<string, SvelteComponent>)[path];
	if (!mod || !mod.metadata.published) throw error(404, `Post not found: ${slug}`);
	return { slug, metadata: mod.metadata, content: mod.default } satisfies PostPageData;
}
