/*
 * Copyright (c) 2025. Jason Cameron
 * All Rights Reserved
 */

import { getAllTutorials } from '#lib/content/tutorials.js';
import { createListingPage } from '#lib/utils/pagemeta.js';

export const { load } = createListingPage(getAllTutorials, 'tutorials');
