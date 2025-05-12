import type { Handle } from '@sveltejs/kit';
import redirects from '$lib/config/redirects';

// This hook handles redirects for specific paths to their corresponding URLs.
// I.E. A redirect from '/github' to Site.out.github or so.
export const handle: Handle = async ({ event, resolve }) => {
	const url = event.url;
	const redirectTo = redirects[url.pathname];
	if (redirectTo) {
		return new Response(null, {
			status: 302,
			headers: { Location: redirectTo }
		});
	}

	return resolve(event);
};
