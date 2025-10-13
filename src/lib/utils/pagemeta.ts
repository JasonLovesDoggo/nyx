/*
 * Copyright (c) 2025. Jason Cameron
 * All Rights Reserved
 */

import type { PageLoad, EntryGenerator, PageServerLoad } from '$types';

interface ContentService<T> {
	getAll: () => T[];
	getBySlug: (slug: string) => unknown;
}

interface ContentEntry {
	slug: string;
}

export function createContentPage<T extends ContentEntry>({
	getAll,
	getBySlug
}: ContentService<T>) {
	const prerender = true;
	const entries: EntryGenerator = () => getAll().map((p) => ({ slug: p.slug }));
	const load: PageLoad = ({ params }) => getBySlug(params.slug);
	return { prerender, entries, load };
}

export function createListingPage<T>(getAll: () => T[], key: string) {
	const load: PageServerLoad = () => ({
		[key]: getAll()
	});
	return { load };
}
