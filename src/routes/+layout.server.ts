import Site from '$lib/config/common';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const { instance, namespace, key } = Site.abacus;
	let footerData;
	try {
		footerData = await fetch(`${instance}/hit/${namespace}/${key}`, {
			signal: AbortSignal.timeout(2500) // 2.5 second timeout
		}).then((res) => res.json());
		footerData.value = footerData.value.toLocaleString();
	} catch (error) {
		console.error('Error fetching footer data:', error);
		return {
			footerData: {
				value: 'infinite'
			}
		};
	}
	return { footerData };
};
