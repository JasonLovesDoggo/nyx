/*
 * Copyright (c) 2025. Jason Cameron
 * All Rights Reserved
 */
import Site from '$lib/config/common';
import createRedirects from '$utils/redirects';

const redirects = createRedirects([
	{ paths: ['/github', '/gh'], url: Site.out.github },
	{ paths: ['/linkedin', '/li'], url: Site.out.linkedin },
	{ paths: ['/bluesky'], url: Site.out.bluesky },
	{ paths: ['/cal'], url: Site.out.calcom },
	{ paths: '/resume', url: '/resume.pdf' },
	{ paths: '/foodle', url: 'https://foodle.jasoncameron.dev' },
	{ paths: '/random-color', url: 'https://pickacolor.jasoncameron.dev' }
]);

export default redirects;
