/*
 * Copyright (c) 2025. Jason Cameron
 * All Rights Reserved
 */

import { getAllTutorials, getTutorialBySlug } from '$lib/content/tutorials';
import { createContentPage } from '$lib/utils/pagemeta';

const { prerender, entries, load } = createContentPage({
	getAll: getAllTutorials,
	getBySlug: getTutorialBySlug
});

export { prerender, entries, load };
