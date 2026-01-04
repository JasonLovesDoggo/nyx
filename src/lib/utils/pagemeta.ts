/*
 * Copyright (c) 2025. Jason Cameron
 * All Rights Reserved
 */

import type { Load, ServerLoad } from '@sveltejs/kit';

interface ContentService<T> {
	getAll: () => Promise<T[]>;
	getBySlug: (slug: string) => Promise<unknown>;
}

interface ContentEntry {
	slug: string;
}

type MaybePromise<T> = T | Promise<T>;
type RouteEntry = { slug: string };
type GenericEntryGenerator = () => MaybePromise<RouteEntry[]>;
type GenericPageLoad = Load<Record<string, string>>;
type GenericPageServerLoad = ServerLoad<Record<string, string>>;

export function createContentPage<T extends ContentEntry>({
	getAll,
	getBySlug
}: ContentService<T>) {
	const prerender = true;
	const entries: GenericEntryGenerator = async () =>
		(await getAll()).map((p) => ({ slug: p.slug }));
	const load: GenericPageLoad = async (event) => getBySlug(event.params.slug);
	return { prerender, entries, load };
}

export function createListingPage<T>(getAll: () => Promise<T[]>, key: string) {
	const load: GenericPageServerLoad = async () => ({
		[key]: await getAll()
	});
	return { load };
}
