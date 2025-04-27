import { IconBuildingFactory2 } from '@tabler/icons-svelte';

type AchievementItem =
	| string
	| {
			title: string;
			description?: string;
			href: string;
	  };

export const organizations = [
	{ name: 'JAMHacks Lead', href: 'https://jamhacks.ca', icon: IconBuildingFactory2, external: true } // Example Link
];

export const codingStats = { language: 'golang', hours: '1,200+' }; // todo: wakatime api based :pray:

// Achievements for the about page
export const professionalAchievements: AchievementItem[] = [
	'Hack Canada Co-Founder',
	'StorageBox CTO',
	{
		title: 'RBC Incoming Intern',
		description: 'Summer 2023 internship at Royal Bank of Canada',
		href: 'https://rbc.com'
	},
	'Anubis Lead Developer',
	{
		title: 'Anubis Hackathon Winner',
		description: 'First place at the Anubis Hackathon 2022',
		href: 'https://anubis.com/hackathon'
	},
	'Anubis Hackathon Finalist',
	'Anubis Hackathon Participant'
];

export const academicAchievements: AchievementItem[] = [
	'University of Toronto Computer Science Student',
	{
		title: 'University of Toronto Engineering Student',
		description: 'Specializing in Software Engineering',
		href: 'https://engineering.utoronto.ca'
	},
	'University of Toronto Hackathon Participant',
	{
		title: 'University of Toronto Hackathon Winner',
		description: 'First place at UofT Hacks 2023',
		href: 'https://uofthacks.com'
	},
	'University of Toronto Hackathon Finalist',
	"Dean's List Scholar",
	'Academic Excellence Award',
	'Computer Science Society Member',
	{
		title: 'Research Assistant - AI Lab',
		description: 'Working on machine learning algorithms for computer vision',
		href: 'https://ai.utoronto.ca'
	},
	'Teaching Assistant - Data Structures',
	'Programming Competition Finalist',
	'Undergraduate Research Symposium Presenter',
	'Student Leadership Award',
	'Peer Mentor Program',
	'Technical Writing Award',
	'Open Source Contributor'
];

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
