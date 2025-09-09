export type AchievementItem =
	| string
	| {
			title: string;
			description?: string;
			href: string;
			date?: string;
	  };

export const achievements: AchievementItem[] = [
	// Professional Achievements
	'Hack Canada Co-Founder',
	'StorageBox CTO',
	'Lab Assistant @ York University',
	{ title: 'Medici Grant Recipient', href: 'https://www.1517fund.com/medici-project' },
	{
		title: 'Stan Sr Full Stack Engineer',
		description: 'Senior Full Stack Engineer at Stan',
		href: 'https://stan.store',
		date: '2025'
	},
	'11x Hackathon Winner'
];

export const latestCommits = [
	// todo: fetch using katib
	{
		repo: 'JasonLovesDoggo/nyx',
		message: 'docs: Update page.svelte with out-of-scope note and link to photo gallery',
		href: 'https://github.com/JasonLovesDoggo/nyx/commit/e852287456bb4763c6fb889e4f724875ccebf3b9',
		sha: 'e852287'
	},
	{
		repo: 'TecharoHQ/anubis',
		message: 'feat(og): Foward host header (#370)',
		href: 'https://github.com/TecharoHQ/anubis/commit/4184b42282501e40f068a68e54e1e80deb642483',
		sha: '4184b42'
	},
	{
		repo: 'TecharsoHQ/anubis',
		message: 'feat: enable Open Graph tag passthrough by default (#348)',
		href: 'https://github.com/TecharoHQ/anubis/commit/06a762959f03d8316bc6054838ac6331537b98f5',
		sha: '06a7629'
	},
	{
		repo: 'JasonLovesDoggo/caddy-defender',
		message: 'chore:  move CNAME to docs root',
		href: 'https://github.com/JasonLovesDoggo/caddy-defender/commit/2bc6e5aa33fa8de334dfca784d3a4e2f06d8d92e',
		sha: '2bc6e5a'
	}
];
