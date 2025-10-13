/*
 * Copyright (c) 2025. Jason Cameron
 * All Rights Reserved
 */

import { getAllTutorials } from '$lib/content/tutorials';
import { createListingPage } from '$lib/utils/pagemeta';

export const { load } = createListingPage(getAllTutorials, 'tutorials');
