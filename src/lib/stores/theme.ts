/*
 * Copyright (c) 2025. Jason Cameron
 * All Rights Reserved
 */

import { browser } from '$app/environment';
import { persistentWritable } from './persistance';

function handleTransition(callback: () => void) {
	if (!browser) return;
	if (document.startViewTransition) {
		document.startViewTransition(callback);
	} else {
		callback();
	}
}

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

export const Accent = persistentWritable<AccentColorName>('accent', {
	defaultValue: 'peach',
	validValues: accentColorNames,
	onUpdate: (value, isFirstLoad) => {
		const apply = () =>
			document.documentElement.style.setProperty('--current-accent-color', `var(--color-${value})`);
		if (isFirstLoad) {
			apply();
		} else {
			handleTransition(apply);
		}
	}
});

// --- Palettes ---
export const paletteNames = ['latte', 'frappe', 'macchiato', 'mocha'] as const;
export type PaletteName = (typeof paletteNames)[number];

function getDefaultPalette(): PaletteName {
	if (!browser) return 'mocha';
	const stored = localStorage.getItem('palette') as PaletteName | null;
	if (stored && paletteNames.includes(stored)) return stored;
	return window.matchMedia('(prefers-color-scheme: light)').matches ? 'latte' : 'mocha';
}

export const Palette = persistentWritable<PaletteName>('palette', {
	defaultValue: getDefaultPalette,
	validValues: paletteNames,
	onUpdate: (value, isFirstLoad) => {
		const apply = () => {
			document.documentElement.classList.remove(...paletteNames);
			document.documentElement.classList.add(value);
		};
		if (isFirstLoad) {
			apply();
		} else {
			handleTransition(apply);
		}
	}
});
