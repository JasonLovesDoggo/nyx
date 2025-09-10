import { measurePerformance } from '$lib/utils/performance';

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

// Simple in-memory cache with TTL
let CACHE: { data: CommitData; ts: number } | null = null;
const TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

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
 * Fetches the latest commits from the katib API with timeout + cache (6h)
 */
export async function fetchLatestCommits(): Promise<CommitData> {
	// Return cached data immediately if available
	if (CACHE) {
		// Check if cache is stale
		if (Date.now() - CACHE.ts >= TTL_MS) {
			console.log('[PERF] fetchLatestCommits: STALE CACHE - triggering background refresh...');
			// Trigger background refresh without awaiting
			void refreshCache();
		}
		return CACHE.data;
	}

	// No cache available, must fetch synchronously
	console.log('[PERF] fetchLatestCommits: NO CACHE - fetching from katib...');
	return await refreshCache();
}

async function refreshCache(): Promise<CommitData> {
	return await measurePerformance('katib-api-fetch', async () => {
		try {
			const controller = new AbortController();
			const id = setTimeout(() => controller.abort(), 2500);
			const response = await fetch(
				'https://katib.jasoncameron.dev/v2/commits/latest?username=JasonLovesDoggo&limit=5',
				{
					headers: { Accept: 'application/json', 'User-Agent': 'nyx-website/1.0' },
					signal: controller.signal
				}
			);
			clearTimeout(id);

			if (!response.ok) throw new Error(`HTTP ${response.status}`);
			const json: KatibV2Response = await response.json();
			console.log(`[PERF] katib-response-size: ${JSON.stringify(json).length} bytes`);
			const data = processResponse(json);
			CACHE = { data, ts: Date.now() };
			return data;
		} catch (err) {
			console.warn('katib fetch failed, using fallback or cache:', err);
			if (CACHE) {
				console.log('Using stale cache after fetch failure');
				return CACHE.data;
			}
			console.log('Using fallback data after fetch failure');
			const data = processResponse(FALLBACK_RAW);
			CACHE = { data, ts: Date.now() };
			return data;
		}
	});
}
