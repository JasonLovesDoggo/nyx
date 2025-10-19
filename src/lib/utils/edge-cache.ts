import type { KVNamespace } from '@cloudflare/workers-types';

interface CacheEntry<T> {
	data: T;
	ts: number;
}

/**
 * Get data from KV cache
 */
export async function getKV<T>(
	kv: KVNamespace | undefined,
	key: string
): Promise<CacheEntry<T> | null> {
	if (!kv) return null;
	try {
		const raw = await kv.get(key, 'text');
		if (!raw) return null;
		return JSON.parse(raw) as CacheEntry<T>;
	} catch (err) {
		console.warn(`KV get failed for ${key}:`, err);
		return null;
	}
}

/**
 * Set data in KV cache with timestamp
 */
export async function setKV<T>(kv: KVNamespace | undefined, key: string, data: T): Promise<void> {
	if (!kv) return;
	try {
		const entry: CacheEntry<T> = { data, ts: Date.now() };
		await kv.put(key, JSON.stringify(entry));
	} catch (err) {
		console.warn(`KV set failed for ${key}:`, err);
	}
}

/**
 * Check if cache entry is stale
 */
export function isCacheStale(entry: CacheEntry<unknown>, ttlMs: number): boolean {
	return Date.now() - entry.ts >= ttlMs;
}
