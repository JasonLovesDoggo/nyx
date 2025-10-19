import { measurePerformance } from '$lib/utils/performance';
import { getKV, setKV, isCacheStale } from '$lib/utils/edge-cache';
import type { KVNamespace } from '@cloudflare/workers-types';
export interface CommitLanguage {
	size: number;
	name: string;
	color: string;
}

export interface V2CommitItem {
	repo: string;
	additions: number;
	deletions: number;
	commitUrl: string;
	committedDate: string;
	oid: string;
	messageHeadline: string;
	messageBody: string;
}

export interface KatibV2Response {
	commits: V2CommitItem[];
	languages: CommitLanguage[];
	stats: { totalAdditions: number; totalDeletions: number; totalCommits: number };
}

export interface ProcessedCommit {
	repo: string;
	message: string;
	href: string;
	sha: string;
	date: string;
	additions?: number;
	deletions?: number;
}

export interface CommitData {
	commits: ProcessedCommit[];
	languages: CommitLanguage[];
	totalAdditions: number;
	totalDeletions: number;
	totalCommits: number;
}

const KV_KEY = 'katib:commits';
const TTL_MS = 60 * 60 * 1000; // 1 hour

// Fallback data as provided (v2 shape)
const FALLBACK_RAW: KatibV2Response = {
	commits: [
		{
			repo: 'JasonLovesDoggo/nyx',
			additions: 305,
			deletions: 23,
			commitUrl:
				'https://github.com/JasonLovesDoggo/nyx/commit/d73346658330be57a5f34bf2391b5ad32b519341',
			committedDate: '2025-09-07T05:24:05Z',
			oid: 'd733466',
			messageHeadline: 'feat: integrate latest commits fetching and display in project overview',
			messageBody: ''
		},
		{
			repo: 'JasonLovesDoggo/Katib',
			additions: 41,
			deletions: 8,
			commitUrl:
				'https://github.com/JasonLovesDoggo/Katib/commit/dca9afc8c1c732d9ccbf9391e77b1fe289e2e05c',
			committedDate: '2025-09-07T05:19:28Z',
			oid: 'dca9afc',
			messageHeadline: 'Merge pull request #4 from JasonLovesDoggo/feature/github-streak-endp…',
			messageBody: '…oint'
		},
		{
			repo: 'JasonLovesDoggo/Katib',
			additions: 41,
			deletions: 8,
			commitUrl:
				'https://github.com/JasonLovesDoggo/Katib/commit/e1e1d7df68e7c9e975d35f7394b7509ace215c80',
			committedDate: '2025-09-07T05:17:01Z',
			oid: 'e1e1d7d',
			messageHeadline: 'Add author filtering to GetMostRecentCommit function',
			messageBody: ''
		}
	],
	languages: [
		{ size: 776600, name: 'Go', color: '#00ADD8' },
		{ size: 666900, name: 'HTML', color: '#e34c26' },
		{ size: 281021, name: 'TypeScript', color: '#3178c6' },
		{ size: 148482, name: 'Svelte', color: '#ff3e00' },
		{ size: 99269, name: 'Shell', color: '#89e051' },
		{ size: 66735, name: 'CSS', color: '#663399' },
		{ size: 49218, name: 'JavaScript', color: '#f1e05a' },
		{ size: 9141, name: 'templ', color: '#66D0DD' }
	],
	stats: { totalAdditions: 55150, totalDeletions: 23115, totalCommits: 55 }
};

function processResponse(data: KatibV2Response): CommitData {
	const commits: ProcessedCommit[] = (data.commits || []).map((c) => ({
		repo: c.repo,
		message: c.messageHeadline,
		href: c.commitUrl,
		sha: c.oid,
		date: c.committedDate,
		additions: c.additions,
		deletions: c.deletions
	}));

	const totalAdditions =
		data.stats?.totalAdditions ?? commits.reduce((acc, c) => acc + (c.additions || 0), 0);
	const totalDeletions =
		data.stats?.totalDeletions ?? commits.reduce((acc, c) => acc + (c.deletions || 0), 0);
	const totalCommits = data.stats?.totalCommits ?? commits.length;

	return {
		commits,
		languages: data.languages || [],
		totalAdditions,
		totalDeletions,
		totalCommits
	};
}

/**
 * Fetches the latest commits from the katib API with KV cache (stale-while-revalidate)
 */
export async function fetchLatestCommits(kv?: KVNamespace): Promise<CommitData> {
	// If KV available, try cache-first approach
	if (kv) {
		const cached = await getKV<CommitData>(kv, KV_KEY);
		if (cached) {
			// Check if stale before refreshing
			if (isCacheStale(cached, TTL_MS)) {
				console.log('[PERF] fetchLatestCommits: Cache stale, refreshing in background');
				void refreshCache(kv);
			} else {
				console.log('[PERF] fetchLatestCommits: Cache fresh, using cached data');
			}
			return cached.data;
		}
	}

	// No KV or no cache - fetch directly
	console.log('[PERF] fetchLatestCommits: NO CACHE - fetching from katib...');
	return await refreshCache(kv);
}

async function refreshCache(kv?: KVNamespace): Promise<CommitData> {
	return await measurePerformance('katib-api-fetch', async () => {
		try {
			const response = await fetch(
				'https://katib.jasoncameron.dev/v2/commits/latest?username=JasonLovesDoggo&limit=5',
				{
					headers: { Accept: 'application/json', 'User-Agent': 'nyx-website/1.0' },
					signal: AbortSignal.timeout(800) // 800ms timeout (lowered from 2500ms)
				}
			);

			if (!response.ok) throw new Error(`HTTP ${response.status}`);
			const json: KatibV2Response = await response.json();
			console.log(`[PERF] katib-response-size: ${JSON.stringify(json).length} bytes`);
			const data = processResponse(json);
			if (kv) await setKV(kv, KV_KEY, data);
			return data;
		} catch (err) {
			console.warn('katib fetch failed:', err);
			// Try KV cache if available
			if (kv) {
				const cached = await getKV<CommitData>(kv, KV_KEY);
				if (cached) {
					console.log('Using stale KV cache after fetch failure');
					return cached.data;
				}
			}
			console.log('Using fallback data after fetch failure');
			return processResponse(FALLBACK_RAW);
		}
	});
}
