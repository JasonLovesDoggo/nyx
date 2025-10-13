/*
 * Copyright (c) 2025. Jason Cameron
 * All Rights Reserved
 */

import { createContentService, type ContentEntry } from './factory';

export interface TutorialImage {
	url: string;
	alt: string;
}

export interface TutorialSource {
	title: string;
	url: string;
}

export interface TutorialMetadata {
	title: string;
	description: string;
	image?: TutorialImage;
	updated_at?: string;
	published_at?: string; // if it's not set, it won't be published
	tags?: string[];
	sources?: TutorialSource[];
}

export type TutorialEntry = ContentEntry<TutorialMetadata>;

const tutorialService = createContentService<TutorialMetadata>({
	modules: import.meta.glob('/content/tutorials/*.svx', { eager: true }),
	contentType: 'tutorial',
	filter: (p) => {
		const publishedAt = p.metadata.published_at;
		return !!publishedAt && !isNaN(new Date(publishedAt).getTime());
	},
	sort: (a, b) => +new Date(b.metadata.published_at!) - +new Date(a.metadata.published_at!)
});

export const getAllTutorials = tutorialService.getAll;
export const getTutorialBySlug = tutorialService.getBySlug;

const TUTORIAL_COUNT = 3; // Show 3 latest tutorials
export const getLatestTutorials = () => tutorialService.getLatest(TUTORIAL_COUNT);
