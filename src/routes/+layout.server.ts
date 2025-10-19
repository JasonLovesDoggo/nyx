import Site from '$lib/config/common';
import type { LayoutServerLoad } from './$types';
import { measurePerformance } from '$lib/utils/performance';

export const load: LayoutServerLoad = async () => {
	const { instance, namespace, key } = Site.abacus;
	let footerData;
	try {
		footerData = await measurePerformance('abacus-api-fetch', async () => {
			const response = await fetch(`${instance}/hit/${namespace}/${key}`, {
				signal: AbortSignal.timeout(600) // 600ms timeout
			});
			return response.json();
		});
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
