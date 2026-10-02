/*
 * Copyright (c) 2025. Jason Cameron
 * All Rights Reserved
 */
import Site from '#lib/config/common.js';
import createRedirects from '#lib/utils/redirects.js';

const redirects = createRedirects([
	{ paths: ['/github', '/gh'], url: Site.out.github },
	{ paths: ['/twitter', '/x'], url: Site.out.x },
	{ paths: ['/linkedin', '/li'], url: Site.out.linkedin },
	{ paths: '/bluesky', url: Site.out.bluesky },
	{ paths: ['/insta', '/ig'], url: Site.out.instagram },
	{ paths: ['/cal', '/chat'], url: Site.out.calcom },
	{ paths: '/repo', url: Site.repo.url },
	{ paths: '/abacus', url: 'https://v2.jasoncameron.dev/abacus' },
	{ paths: '/resume', url: '/resume.pdf' },
	{ paths: '/foodle', url: 'https://foodle.jasoncameron.dev' },
	{ paths: '/random-color', url: 'https://pickacolor.jasoncameron.dev' }
]);

export default redirects;
