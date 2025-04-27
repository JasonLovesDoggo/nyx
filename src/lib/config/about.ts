export type AchievementItem =
	| string
	| {
			title: string;
			description?: string;
			href: string;
			date?: string;
	  };

export const codingStats = { language: 'golang', hours: '1,200+' }; // todo: wakatime api based :pray:
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
	'Anubis Hackathon Finalist',
	'Anubis Hackathon Participant',

	// Academic Achievements
	'University of Toronto Computer Science Student',
	{
		title: 'University of Toronto Engineering Student',
		description: 'Specializing in Software Engineering',
		href: 'https://engineering.utoronto.ca',
		date: '2022-present'
	},
	'University of Toronto Hackathon Participant',
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
		repo: 'jasonlovesdoggo/nyx',
		message: 'feat: Implement bento grid styling',
		href: 'https://github.com/JasonLovesDoggo/nyx/commit/abc1234',
		sha: 'abc1234'
	},
	{
		repo: 'jasonlovesdoggo/caddy-defender',
		message: 'fix: Improve detection heuristic',
		href: 'https://github.com/jasonlovesdoggo/caddy-defender/commit/def5678',
		sha: 'def5678'
	}
];
