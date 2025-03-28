interface AbacusResponse {
		value: number;
}
export async function load() {
	const footerData = await fetch('https://abacus.jasoncameron.dev/hit/jasoncameron/portfolio').then(res => res.json());
	return { footerData } as { footerData: AbacusResponse };
}
