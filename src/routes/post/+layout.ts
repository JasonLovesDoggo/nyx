import type { LayoutLoad } from './$types';

export const load: LayoutLoad = () => {
	return {
		sections: [
			{ slug: 'Recent Posts', title: 'Profile' },
			{ slug: 'RSS FEED', title: 'woah' }
		]
	};
};