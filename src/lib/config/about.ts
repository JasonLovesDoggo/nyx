import { IconBuildingFactory2 } from '@tabler/icons-svelte';

export const organizations = [
	{ name: 'JAMHacks Lead', href: 'https://jamhacks.ca', icon: IconBuildingFactory2, external: true } // Example Link
];

export const codingStats = { language: 'golang', hours: '1,200+' }; // todo: wakatime api based :pray:

// Achievements for the about page
export const professionalAchievements = [
	'Hack Canada Co-Founder',
	'StorageBox CTO',
	'RBC Incoming Intern',
	'Anubis Lead Developer',
	'Anubis Hackathon Winner',
	'Anubis Hackathon Finalist',
	'Anubis Hackathon Participant'
];

export const academicAchievements = [
	'University of Toronto Computer Science Student',
	'University of Toronto Engineering Student',
	'University of Toronto Hackathon Participant',
	'University of Toronto Hackathon Winner',
	'University of Toronto Hackathon Finalist',
	"Dean's List Scholar",
	'Academic Excellence Award',
	'Computer Science Society Member',
	'Research Assistant - AI Lab',
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
