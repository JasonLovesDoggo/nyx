import { IconBuildingFactory2 } from '@tabler/icons-svelte';

export const organizations = [
	{ name: 'JAMHacks Lead', href: 'https://jamhacks.ca', icon: IconBuildingFactory2, external: true } // Example Link
];

export const codingStats = { language: 'golang', hours: '1,200+' }; // todo: wakatime api based :pray:
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
