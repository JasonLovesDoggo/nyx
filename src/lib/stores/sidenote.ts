import { getContext, setContext } from 'svelte';

const SIDENOTE_KEY = 'sidenote-counter';

interface SidenoteContext {
	next: () => number;
}

export function initSidenoteCounter(): void {
	let counter = 0;
	setContext<SidenoteContext>(SIDENOTE_KEY, {
		next: () => ++counter
	});
}

export function nextSidenoteNumber(): number {
	const ctx = getContext<SidenoteContext>(SIDENOTE_KEY);
	if (!ctx) {
		console.warn('Sidenote used outside of initSidenoteCounter context');
		return 0;
	}
	return ctx.next();
}
