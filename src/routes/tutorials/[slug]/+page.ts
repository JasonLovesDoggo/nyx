/*
 * Copyright (c) 2025. Jason Cameron
 * All Rights Reserved
 */

import type { PageLoad, EntryGenerator } from './$types';
import { getAllTutorials, getTutorialBySlug } from '$lib/content/tutorials';

export const prerender = true;

export const entries: EntryGenerator = () => getAllTutorials().map((t) => ({ slug: t.slug }));

export const load: PageLoad = ({ params }) => getTutorialBySlug(params.slug);
