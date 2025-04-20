/*
 * Copyright (c) 2025. Jason Cameron
 * All Rights Reserved
 */

import { getAllTutorials } from '$lib/content/tutorials';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = () => ({
	tutorials: getAllTutorials()
});
