import { getContext, setContext } from 'svelte';

const MARGINNOTE_KEY = 'marginnote-counter';

interface MarginNoteContext {
	next: () => number;
}

export function initMarginNoteCounter(): void {
	let counter = 0;
	setContext<MarginNoteContext>(MARGINNOTE_KEY, {
		next: () => ++counter
	});
}

export function nextMarginNoteNumber(): number {
	const ctx = getContext<MarginNoteContext>(MARGINNOTE_KEY);
	if (!ctx) {
		console.warn('Margin note used outside of initMarginNoteCounter context');
		return 0;
	}
	return ctx.next();
}
