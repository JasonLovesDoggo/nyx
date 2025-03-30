// src/lib/stores/themeStore.ts
import { writable } from 'svelte/store';

export const accentColorNames = [
	'rosewater', 'flamingo', 'pink', 'mauve', 'red', 'maroon', 'peach',
	'yellow', 'green', 'teal', 'sky', 'sapphire', 'blue', 'lavender'
] as const;

export type AccentColorName = typeof accentColorNames[number];

export const Accent = writable<AccentColorName>('peach'); // Default Peach


export function getCssVarName(colorName: AccentColorName): string {
	// Check if your catppuccin.css uses '--color-{name}' or '--ctp-{name}'
	return `--color-${colorName}`;
}