export type AchievementItem =
	| string
	| {
			title: string;
			description?: string;
			href: string;
			date?: string;
	  };

export const codingStats = { language: 'golang', hours: '1,600+' }; // todo: wakatime api based :pray:
export const achievements: AchievementItem[] = [
	// Professional Achievements
	'Hack Canada Co-Founder',
	'StorageBox CTO',
	{
		title: 'RBC Incoming Intern',
		description: 'Summer 2023 internship at Royal Bank of Canada',
		href: 'https://rbc.com',
		date: '2023'
	},
	'Anubis Lead Developer',
	{
		title: 'Anubis Hackathon Winner',
		description: 'First place at the Anubis Hackathon 2022',
		href: 'https://anubis.com/hackathon',
		date: '2022'
	},
	'Anubis Hackathon Participant',

	// Academic Achievements
	'University of Toronto Computer Science Student',
	{
		title: 'University of Toronto Engineering Student',
		description: 'Specializing in Software Engineering',
		href: 'https://engineering.utoronto.ca',
		date: '2022-present'
	},
	{
		title: 'University of Toronto Hackathon Winner',
		description: 'First place at UofT Hacks 2023',
		href: 'https://uofthacks.com',
		date: '2023'
	}
];

export const coolStuff: AchievementItem[] = ['highschool hackathon winner'];

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
