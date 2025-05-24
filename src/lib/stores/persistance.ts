/*
 * Copyright (c) 2025. Jason Cameron
 * All Rights Reserved
 */

// --- Generic Persistent Store with Cross‑Tab Sync ---
import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * Options for the persistentWritable store.
 * @template T - The type of the data to be stored.
 */
export interface PersistentWritableOptions<T> {
	/** Default value or a function returning it. Used if no valid stored value is found. */
	defaultValue: T | (() => T);
	/** Optional array of valid values. */
	validValues?: readonly T[];
	/** Optional callback on value update. @param value - New value. @param isFirstLoad - True if initial load. */
	onUpdate?: (value: T, isFirstLoad: boolean) => void;
	/** Optional: disable JSON stringification (use for simple strings only). Defaults to false. */
	rawString?: boolean;
}

/**
 * Creates a Svelte writable store that persists in localStorage and syncs across tabs.
 *
 * @template T - The type of data to store.
 * @param key - localStorage key.
 * @param options - Configuration options.
 * @returns A Svelte Writable store.
 */
export function persistentWritable<T>(
	key: string,
	options: PersistentWritableOptions<T>
): Writable<T> {
	const { validValues, onUpdate, rawString = false } = options;

	const tryParse = (jsonString: string | null): T | null => {
		if (jsonString === null) return null;
		if (rawString) return jsonString as unknown as T;
		try {
			return JSON.parse(jsonString) as T;
		} catch (e) {
			console.warn(`Failed to parse stored value for key "${key}":`, e);
			return null;
		}
	};

	const toStringify = (value: T): string => {
		if (rawString) return String(value);
		return JSON.stringify(value);
	};

	let initialValue: T =
		typeof options.defaultValue === 'function'
			? (options.defaultValue as () => T)()
			: options.defaultValue;

	if (browser) {
		const storedValueString = localStorage.getItem(key);
		const parsedStoredValue = tryParse(storedValueString);

		if (parsedStoredValue !== null) {
			if (validValues && validValues.length > 0) {
				if (validValues.includes(parsedStoredValue)) {
					initialValue = parsedStoredValue;
				} else {
					console.warn(
						`Stored value for key "${key}" ("${parsedStoredValue}") is not in validValues. Using default.`
					);
				}
			} else {
				initialValue = parsedStoredValue;
			}
		}
	}

	const store = writable<T>(initialValue);

	if (browser) {
		let isFirstUpdate = true;

		store.subscribe((currentValue) => {
			localStorage.setItem(key, toStringify(currentValue));
			onUpdate?.(currentValue, isFirstUpdate);
			isFirstUpdate = false;
		});

		const handleStorageEvent = (event: StorageEvent) => {
			if (event.key === key) {
				const newStringValue = event.newValue;

				if (newStringValue === null) {
					// Item was removed or set to null in another tab
					const defaultValue =
						typeof options.defaultValue === 'function'
							? (options.defaultValue as () => T)()
							: options.defaultValue;
					if (validValues && validValues.length > 0 && !validValues.includes(defaultValue)) {
						console.warn(
							`Default value for key "${key}" is not in validValues. Store might be in an unexpected state if item is removed from local storage.`
						);
					}
					store.set(defaultValue);
					return;
				}

				const parsedNewValue = tryParse(newStringValue);

				if (parsedNewValue !== null) {
					if (validValues && validValues.length > 0) {
						if (validValues.includes(parsedNewValue)) {
							store.set(parsedNewValue);
						} else {
							console.warn(
								`Received value from another tab for key "${key}" ("${parsedNewValue}") which is not in validValues. Ignoring.`
							);
						}
					} else {
						store.set(parsedNewValue);
					}
				} else {
					console.warn(
						`Failed to parse incoming storage event value for key "${key}". Value: "${newStringValue}"`
					);
				}
			}
		};

		window.addEventListener('storage', handleStorageEvent);
	}

	return store;
}
