import Site from '$lib/config';

interface AbacusResponse {
		value: number;
}

export async function load() {
	const { instance, namespace, key } = Site.abacus;

	const footerData = await fetch(`${instance}/hit/${namespace}/${key}`).then(res => res.json());
	return { footerData } as { footerData: AbacusResponse };
}
