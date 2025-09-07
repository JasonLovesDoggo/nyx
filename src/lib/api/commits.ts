export interface CommitLanguage {
	size: number;
	name: string;
	color: string;
}

export interface ParentCommit {
	additions: number;
	deletions: number;
	commitUrl: string;
	committedDate: string;
	messageHeadline: string;
}

export interface KatibCommitResponse {
	repo: string;
	additions: number;
	deletions: number;
	commitUrl: string;
	committedDate: string;
	oid: string;
	messageHeadline: string;
	messageBody: string;
	languages: CommitLanguage[];
	parentCommits: ParentCommit[];
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
}

// Simple in-memory cache with TTL
let CACHE: { data: CommitData; ts: number } | null = null;
const TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

// Fallback data as provided
const FALLBACK_RAW: KatibCommitResponse = {
	repo: 'TecharoHQ/anubis',
	additions: 207,
	deletions: 57,
	commitUrl: 'https://github.com/TecharoHQ/anubis/commit/82099d9e05d154277c3121675968ea20d2b182b4',
	committedDate: '2025-09-07T02:35:19Z',
	oid: '82099d9',
	messageHeadline: 'fix(robots2policy): handle multiple user agents under one block (#925)',
	messageBody: '',
	languages: [
		{ size: 101, name: 'Ruby', color: '#701516' },
		{ size: 385752, name: 'Go', color: '#00ADD8' },
		{ size: 9141, name: 'templ', color: '#66D0DD' },
		{ size: 28663, name: 'JavaScript', color: '#f1e05a' },
		{ size: 2814, name: 'CSS', color: '#663399' }
	],
	parentCommits: [
		{
			additions: 32,
			deletions: 32,
			commitUrl:
				'https://github.com/TecharoHQ/anubis/commit/87c2f1e0e6919619d93cbaece2c954cc40f0b0a8',
			committedDate: '2025-09-07T02:30:43Z',
			messageHeadline: 'build(deps): bump the github-actions group across 1 directory with 8 …'
		},
		{
			additions: 6,
			deletions: 3,
			commitUrl:
				'https://github.com/TecharoHQ/anubis/commit/f0199d014f1af2f050e46cfb31975d73f55f4c0d',
			committedDate: '2025-09-07T01:34:42Z',
			messageHeadline: 'docs: document some missing env vars (#1087)'
		},
		{
			additions: 4,
			deletions: 1,
			commitUrl:
				'https://github.com/TecharoHQ/anubis/commit/75109f6b737df65c4545302835000a0006adb171',
			committedDate: '2025-09-07T00:59:02Z',
			messageHeadline: 'docs(installation): add SLOG_LEVEL environment variable to configurat…'
		},
		{
			additions: 90,
			deletions: 0,
			commitUrl:
				'https://github.com/TecharoHQ/anubis/commit/c43d7ca68686c02f4a1a2629c51a57e381b6427e',
			committedDate: '2025-09-06T23:42:23Z',
			messageHeadline: 'docs(botstopper): add HTML templating support'
		}
	]
};

function processResponse(data: KatibCommitResponse): CommitData {
	const commits: ProcessedCommit[] = [];
	commits.push({
		repo: data.repo,
		message: data.messageHeadline,
		href: data.commitUrl,
		sha: data.oid,
		date: data.committedDate,
		additions: data.additions,
		deletions: data.deletions
	});

	data.parentCommits.slice(0, 3).forEach((parent) => {
		commits.push({
			repo: data.repo,
			message: parent.messageHeadline,
			href: parent.commitUrl,
			sha: parent.commitUrl.split('/').pop()?.substring(0, 7) || 'unknown',
			date: parent.committedDate,
			additions: parent.additions,
			deletions: parent.deletions
		});
	});

	const totalAdditions = commits.reduce((acc, c) => acc + (c.additions || 0), 0);
	const totalDeletions = commits.reduce((acc, c) => acc + (c.deletions || 0), 0);

	return {
		commits,
		languages: data.languages || [],
		totalAdditions,
		totalDeletions
	};
}

/**
 * Fetches the latest commits from the katib API with timeout + cache (6h)
 */
export async function fetchLatestCommits(): Promise<CommitData> {
	// Serve from cache if fresh
	if (CACHE && Date.now() - CACHE.ts < TTL_MS) {
		return CACHE.data;
	}

	try {
		const controller = new AbortController();
		const id = setTimeout(() => controller.abort(), 3000);
		const response = await fetch('https://katib.jasoncameron.dev/commits/latest', {
			headers: { Accept: 'application/json', 'User-Agent': 'nyx-website/1.0' },
			signal: controller.signal
		});
		clearTimeout(id);

		if (!response.ok) throw new Error(`HTTP ${response.status}`);
		const json: KatibCommitResponse = await response.json();
		const data = processResponse(json);
		CACHE = { data, ts: Date.now() };
		return data;
	} catch (err) {
		console.warn('katib fetch failed, using fallback or cache:', err);
		if (CACHE) return CACHE.data; // stale cache if available
		const data = processResponse(FALLBACK_RAW);
		CACHE = { data, ts: Date.now() };
		return data;
	}
}
