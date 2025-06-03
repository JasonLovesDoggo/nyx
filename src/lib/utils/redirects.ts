const createRedirects = (config: Array<{ paths: string | string[]; url: string }>) => {
	const redirects: Record<string, string> = {};
	config.forEach(({ paths, url }) => {
		const pathArray = Array.isArray(paths) ? paths : [paths];
		pathArray.forEach((path) => {
			// Validate no trailing slash (except for root '/')
			if (path !== '/' && path.endsWith('/')) {
				throw new Error(`Path "${path}" should not have a trailing slash`);
			} else if (!path.startsWith('/')) {
				throw new Error(`Path "${path}" should start with a leading slash`);
			}
			redirects[path] = url;
		});
	});

	return redirects;
};

export default createRedirects;
