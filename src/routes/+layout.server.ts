import Site from '$lib/config';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const { instance, namespace, key } = Site.abacus;
	let footerData;
	try {
		footerData = await fetch(`${instance}/hit/${namespace}/${key}`, {
			signal: AbortSignal.timeout(3000) // 3 second timeout
		}).then((res) => res.json());
	} catch (error) {
		console.error('Error fetching footer data:', error);
		return { footerData: '000000' };
	}
	return { footerData };
};
