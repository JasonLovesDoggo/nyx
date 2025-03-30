import Site from '$lib/config';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const { instance, namespace, key } = Site.abacus;

	const footerData = await fetch(`${instance}/hit/${namespace}/${key}`).then((res) => res.json());
	return { footerData };
};
