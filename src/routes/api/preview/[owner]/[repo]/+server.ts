import type { RequestHandler } from '@sveltejs/kit';

// todo: rewrite to output an IMAGE  instead of JSON
export const GET: RequestHandler = (async ({ params }) => {
	const { owner, repo } = params;

	if (!owner || !repo) {
		return new Response('Owner and repo parameters are required', { status: 400 });
	}

	try {
		const { fetchGitHubRepo } = await import('$lib/preview/github');
		const data = await fetchGitHubRepo(owner, repo);
		return new Response(JSON.stringify(data), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Error fetching GitHub repository:', error);
		return new Response('Failed to fetch repository data', { status: 500 });
	}
}) satisfies RequestHandler;
