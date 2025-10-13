/*
 * Copyright (c) 2025. Jason Cameron
 * All Rights Reserved
 */
import { error } from '@sveltejs/kit';

export interface ContentEntry<T> {
	slug: string;
	metadata: T;
}

export interface ContentPageData<T> extends ContentEntry<T> {
	content: ConstructorOfATypedSvelteComponent;
}

interface CreateContentServiceOptions<T> {
	modules: Record<string, unknown>;
	contentType: string;
	filter?: (entry: ContentEntry<T>) => boolean;
	sort?: (a: ContentEntry<T>, b: ContentEntry<T>) => number;
}

interface MdsvexModule<T> {
	default: ConstructorOfATypedSvelteComponent;
	metadata?: T;
	frontmatter?: T;
}

export function createContentService<T>({
	modules,
	contentType,
	filter = () => true,
	sort = () => 0
}: CreateContentServiceOptions<T>) {
	const contentDir =
		Object.keys(modules).length > 0
			? Object.keys(modules)[0].substring(0, Object.keys(modules)[0].lastIndexOf('/') + 1)
			: '';

	function slugFrom(path: string): string {
		return path.split('/').pop()!.replace('.svx', '');
	}

	let _all: ContentEntry<T>[];

	function getAll(): ContentEntry<T>[] {
		if (!_all) {
			_all = Object.entries(modules)
				.map(([path, mod]) => {
					const module = mod as MdsvexModule<T>;
					const metadata = module.metadata ?? module.frontmatter;
					if (!metadata) {
						throw new Error(`Missing metadata for ${path}`);
					}
					return {
						slug: slugFrom(path),
						metadata
					};
				})
				.filter(filter)
				.sort(sort);
		}
		return _all;
	}

	function getBySlug(slug: string): ContentPageData<T> {
		const path = `${contentDir}${slug}.svx`;
		const module = modules[path] as MdsvexModule<T> | undefined;

		if (!module) {
			throw error(404, `${contentType} not found: ${slug}`);
		}

		const metadata = module.metadata ?? module.frontmatter;

		if (!metadata) {
			throw error(500, `Missing metadata for ${contentType}: ${slug}`);
		}

		const entry = { slug, metadata };
		if (!filter(entry)) {
			throw error(404, `${contentType} not found: ${slug}`);
		}

		return {
			slug,
			metadata,
			content: module.default
		};
	}

	function getLatest(count: number): ContentEntry<T>[] {
		return getAll().slice(0, count);
	}

	return {
		getAll,
		getBySlug,
		getLatest
	};
}
