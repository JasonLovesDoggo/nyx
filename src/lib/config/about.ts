import {
	IconBrandInstagram,
	IconBriefcase,
	IconBuildingFactory2,
	IconCode
} from '@tabler/icons-svelte';

export const organizations = [
	{ name: 'JAMHacks Lead', href: 'https://jamhacks.ca', icon: IconBuildingFactory2, external: true } // Example Link
];
export const workExperience = [
	{
		company: 'Homeless',
		role: 'Incoming Intern',
		href: 'https://shopify.com',
		icon: IconBriefcase,
		external: true
	}
];
export const featuredProjects = [
	{
		title: 'Anti-Scraper Development',
		description: 'Engineered systems to identify, analyze, and block malicious web scraping bots.',
		icon: IconBrandInstagram,
		href: '/projects/anti-scraping', // Example internal link
		external: false,
		githubHref: 'https://github.com/jasonlovesdoggo/caddy-defender' // Example real link
	},
	{
		title: 'CVE Discovery & Reporting',
		description: 'Contributed to web security by discovering and reporting vulnerabilities.',
		icon: IconBrandInstagram,
		href: 'https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-YYYY-XXXXX', // Example external link (replace YYYY-XXXXX)
		external: true,
		githubHref: null // Usually no repo for just a CVE
	},
	{
		title: 'Deep Learning Framework (C++)',
		description: 'Built a foundational deep learning framework from the ground up using C++.',
		icon: IconCode,
		href: '/projects/dl-framework', // Example internal link
		external: false,
		githubHref: 'https://github.com/jasonlovesdoggo/deep-learning-cpp' // Example repo link
	},
	{
		title: 'AI Agent for 3D Models (UofTHacks Winner)',
		description: 'Created an award-winning AI agent converting text/images to 3D-printable models.',
		icon: IconCode,
		href: '/projects/ai-3d-agent', // Example internal link
		external: false,
		githubHref: 'https://github.com/jasonlovesdoggo/UofTHacks-AI-3D' // Example repo link
	}
];
export const latestPosts = [
	// todo: fetch dynamically
	{ title: 'Understanding Web Scraper Tactics & Defenses', href: '/posts/scraper-tactics' },
	{ title: 'My First CVE Discovery Journey', href: '/posts/first-cve' }
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
