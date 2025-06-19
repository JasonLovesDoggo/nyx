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
	{ paths: ['/insta'], url: Site.out.linkedin },
	{ paths: ['/cal', '/chat'], url: Site.out.calcom },
	{ paths: '/repo', url: Site.repo.url },
	{ paths: '/abacus', url: 'https://v2.jasoncameron.dev/abacus' },
	{ paths: '/resume', url: '/resume.pdf' },
	{ paths: '/foodle', url: 'https://foodle.jasoncameron.dev' },
	{ paths: '/random-color', url: 'https://pickacolor.jasoncameron.dev' }
]);

export default redirects;
