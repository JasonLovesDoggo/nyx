import type { Handle } from '@sveltejs/kit';
import redirects from '$lib/config/redirects';

// This hook handles redirects for specific paths to their corresponding URLs.
// I.E. A redirect from '/github' to Site.out.github or so.
export const handle: Handle = async ({ event, resolve }) => {
	const url = event.url.pathname.replace(/\/$/, '');
	const redirectTo = redirects[url];
	if (redirectTo) {
		console.log('[REDIRECTS] Handling redirect for:', url);
		return new Response(null, {
			status: 302,
			headers: { Location: redirectTo }
		});
	}

	return resolve(event);
};
