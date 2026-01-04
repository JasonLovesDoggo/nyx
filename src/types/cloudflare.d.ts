declare module '@cloudflare/workers-types' {
	export interface KVNamespace {
		get(key: string): Promise<string | null>;
		get(key: string, type: 'text'): Promise<string | null>;
		get(key: string, type: 'arrayBuffer'): Promise<ArrayBuffer | null>;
		get<Result = unknown>(key: string, type: 'json'): Promise<Result | null>;
		put(
			key: string,
			value: string | ArrayBuffer | ReadableStream,
			options?: {
				expiration?: number;
				expirationTtl?: number;
				metadata?: Record<string, unknown>;
			}
		): Promise<void>;
		delete(key: string): Promise<void>;
	}
}
