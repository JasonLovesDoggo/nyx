import Site from '#lib/config/common.js';
import type { AbacusResponse } from '#lib/types/abacus.js';
import type { LayoutServerLoad } from './$types';
import { measurePerformance } from '#lib/utils/performance.js';

export const load: LayoutServerLoad = async () => {
	const { instance, namespace, key } = Site.abacus;
	let footerData;
	try {
		footerData = await measurePerformance('abacus-api-fetch', async () => {
			const response = await fetch(`${instance}/hit/${namespace}/${key}`, {
				signal: AbortSignal.timeout(600) // 600ms timeout
			});
			const data = (await response.json()) as AbacusResponse;
			return { value: data.value.toLocaleString() };
		});
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
