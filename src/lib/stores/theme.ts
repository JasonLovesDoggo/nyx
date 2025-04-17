import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';

// --- Helpers ---
function persistentWritable<T extends string>(
	key: string,
	options: {
		defaultValue: T;
		validValues: readonly T[];
		onUpdate?: (value: T) => void;
	}
): Writable<T> {
	const { defaultValue, validValues, onUpdate } = options;

	let initial = defaultValue;

	if (browser) {
		const stored = localStorage.getItem(key) as T | null;
		if (stored && validValues.includes(stored)) {
			initial = stored;
		}
	}

	const store = writable<T>(initial);

	if (browser) {
		store.subscribe((value) => {
			localStorage.setItem(key, value);
			onUpdate?.(value);
		});
	}

	return store;
}

function handleTransition(callback: () => void) {
	if (!browser) return;
	if (document.startViewTransition) {
		document.startViewTransition(callback);
	} else {
		callback();
	}
}

// --- Accent ---
export const accentColorNames = [
	'rosewater',
	'flamingo',
	'pink',
	'mauve',
	'red',
	'maroon',
	'peach',
	'yellow',
	'green',
	'teal',
	'sky',
	'sapphire',
	'blue',
	'lavender'
] as const;

export type AccentColorName = (typeof accentColorNames)[number];

export const Accent = persistentWritable<AccentColorName>('accent', {
	defaultValue: 'peach',
	validValues: accentColorNames,
	onUpdate: (value) =>
		handleTransition(() => {
			document.documentElement.style.setProperty('--current-accent-color', `var(--color-${value})`);
		})
});

// --- Palette ---
export const paletteNames = ['latte', 'frappe', 'macchiato', 'mocha'] as const;
export type PaletteName = (typeof paletteNames)[number];

function getDefaultPalette(): PaletteName {
	if (!browser) return 'mocha';
	const stored = localStorage.getItem('palette') as PaletteName | null;
	if (stored && paletteNames.includes(stored)) return stored;
	return window.matchMedia('(prefers-color-scheme: light)').matches ? 'latte' : 'mocha';
}

export const Palette = persistentWritable<PaletteName>('palette', {
	defaultValue: getDefaultPalette(),
	validValues: paletteNames,
	onUpdate: (value) =>
		handleTransition(() => {
			document.documentElement.classList.remove(...paletteNames);
			document.documentElement.classList.add(value);
		})
});
