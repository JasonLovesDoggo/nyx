/*
 * Copyright (c) 2025. Jason Cameron
 * All Rights Reserved
 */

// Define redirects with proper types
import Site from '$lib/config/common';

const redirects: Record<string, string> = {
	'/github': Site.out.github,
	'/linkedin': Site.out.linkedin,
	'/bluesky': Site.out.bluesky,
	'/resume': '/resume.pdf'
};

export default redirects;
