/*
 * Copyright (c) 2025. Jason Cameron
 * All Rights Reserved
 */

import { error } from '@sveltejs/kit';
import type { SvelteComponent } from 'svelte';

export interface TutorialMetadata {
	title: string;
	description: string;
	imageUrl?: string; // a header image
	updated_at?: string;
	published_at?: string; // if it's not set, it won't be published
	tags?: string[];
}

export interface TutorialEntry {
	slug: string;
	metadata: TutorialMetadata;
}

export interface TutorialPageData extends TutorialEntry {
	content: ConstructorOfATypedSvelteComponent;
}

// Eager‑glob at build time
const tutorialModules = import.meta.glob('/content/tutorials/*.svx', { eager: true });

// Helpers
function slugFrom(path: string) {
	return path.split('/').pop()!.replace('.svx', '');
}

let _allTutorials: TutorialEntry[];
export function getAllTutorials(): TutorialEntry[] {
	if (!_allTutorials) {
		_allTutorials = Object.entries(tutorialModules)
			.map(([path, mod]) => ({
				slug: slugFrom(path),
				metadata: (mod as TutorialEntry).metadata as TutorialMetadata
			}))
			.filter((p) => {
				const publishedAt = p.metadata.published_at;
				return publishedAt && !isNaN(new Date(publishedAt).getTime());
			})
			.sort((a, b) => +new Date(b.metadata.published_at!) - +new Date(a.metadata.published_at!));
	}
	return _allTutorials;
}

export function getTutorialBySlug(slug: string): TutorialPageData {
	const path = `/content/tutorials/${slug}.svx`;
	const mod = (tutorialModules as Record<string, SvelteComponent>)[path];
	if (!mod || !mod.metadata.published_at) throw error(404, `Tutorial not found: ${slug}`);
	return { slug, metadata: mod.metadata, content: mod.default } satisfies TutorialPageData;
}

let _latestTutorials: TutorialEntry[];
const tutorialcount = 3; // Show 3 latest tutorials
export function getLatestTutorials(): TutorialEntry[] {
	if (!_latestTutorials) {
		_latestTutorials = getAllTutorials().slice(0, tutorialcount);
	}
	return _latestTutorials;
}
