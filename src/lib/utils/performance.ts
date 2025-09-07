import { dev } from '$app/environment';

export async function measurePerformance<T>(name: string, fn: () => Promise<T>): Promise<T> {
	if (!dev) {
		return await fn();
	}

	const start = performance.now();
	try {
		const result = await fn();
		const duration = performance.now() - start;
		console.log(`[PERF] ${name}: ${duration.toFixed(2)}ms`);
		return result;
	} catch (error) {
		const duration = performance.now() - start;
		console.error(`[PERF] ${name}: FAILED after ${duration.toFixed(2)}ms`, error);
		throw error;
	}
}

export function measureSync<T>(name: string, fn: () => T): T {
	if (!dev) {
		return fn();
	}

	const start = performance.now();
	try {
		const result = fn();
		const duration = performance.now() - start;
		console.log(`[PERF] ${name}: ${duration.toFixed(2)}ms`);
		return result;
	} catch (error) {
		const duration = performance.now() - start;
		console.error(`[PERF] ${name}: FAILED after ${duration.toFixed(2)}ms`, error);
		throw error;
	}
}
