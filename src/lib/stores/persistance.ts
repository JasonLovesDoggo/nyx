/*
 * Copyright (c) 2025. Jason Cameron
 * All Rights Reserved
 */

// --- Generic Persistent Store with Cross‑Tab Sync ---
import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';

export function persistentWritable<T extends string>(
	key: string,
	options: {
		defaultValue: T | (() => T);
		validValues: readonly T[];
		onUpdate?: (value: T, isFirstLoad: boolean) => void;
	}
): Writable<T> {
	const { validValues, onUpdate } = options;

	// compute initial (lazy if function)
	let initial: T =
		typeof options.defaultValue === 'function'
			? (options.defaultValue as () => T)()
			: options.defaultValue;

	if (browser) {
		const stored = localStorage.getItem(key) as T | null;
		if (stored && validValues.includes(stored)) {
			initial = stored;
		}
	}

	const store = writable<T>(initial);

	if (browser) {
		let isFirst = true;

		// write to localStorage + trigger side‑effect
		store.subscribe((value) => {
			localStorage.setItem(key, value);
			onUpdate?.(value, isFirst);
			isFirst = false;
		});

		// cross‑tab sync (only when newValue ≠ oldValue)
		const handler = (event: StorageEvent) => {
			if (
				event.key === key &&
				event.newValue !== event.oldValue &&
				event.newValue &&
				validValues.includes(event.newValue as T)
			) {
				store.set(event.newValue as T);
			}
		};
		window.addEventListener('storage', handler);
	}

	return store;
}
