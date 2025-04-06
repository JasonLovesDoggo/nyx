import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// --- Accent Colors ---
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

const initialAccent = 'peach';
export const Accent = writable<AccentColorName>(initialAccent);

Accent.subscribe((value) => {
	if (browser) {
		document.documentElement.style.setProperty('--current-accent-color', `var(--color-${value})`);
	}
});

// --- Palettes ---
export const paletteNames = ['latte', 'frappe', 'macchiato', 'mocha'] as const;
export type PaletteName = (typeof paletteNames)[number];

let initialPalette = 'mocha' as PaletteName;
if (browser) {
	// if prefers light mode, set to latte
	if (window.matchMedia('(prefers-color-scheme: light)').matches) {
		initialPalette = 'latte' as PaletteName;
	}
}
export const Palette = writable<PaletteName>(initialPalette);
