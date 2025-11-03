import {
	type Icon,
	IconBrandBluesky,
	IconBrandGithub,
	IconBrandInstagram,
	IconBrandLinkedin,
	IconBrandX
} from '@tabler/icons-svelte';
import { dev } from '$app/environment';
import Wakatime from '$lib/icons/Wakatime.svelte';

interface Site {
	name: string;
	url: string;
	description: string;
	tags: string[];
	seo: {
		author: string;
		birthDate: string;
		worksFor: {
			name: string;
			url: string;
		};
		location: {
			city: string;
			region: string;
			country: string;
		};
	};
	abacus: { instance: string; namespace: string; key: string };
	out: {
		github: string;
		linkedin: string;
		calcom: string;
		wakatime: string;
		bluesky: string;
		instagram: string;
		x: string;
	};
	repo: { url: string; commitBaseUrl: string };
}

const Site: Site = {
	name: 'Jason Cameron',
	url: dev ? 'http://localhost:5173' : 'https://jasoncameron.dev',
	description:
		'Jason Cameron - Senior Software Engineer in Toronto, Canada. I like occasionally building cool shit',
	tags: [
		'Jason Cameron',
		'Senior Software Engineer',
		'Toronto Software Developer',
		'Canada',
		'Golang Developer',
		'Python Developer',
		'DevOps Engineer',
		'Software Engineering',
		'Backend Developer',
		'Full Stack Developer',
		'Hackathon Developer',
		'Toronto Tech',
		'Canadian Developer',
		'Web Development',
		'Cloud Computing',
		'API Development',
		'Software Architecture'
	],
	seo: {
		author: 'Jason Cameron',
		birthDate: '2006-04-19',
		worksFor: {
			name: 'Stan',
			url: 'https://stan.store'
		},
		location: {
			city: 'Toronto',
			region: 'Ontario',
			country: 'Canada'
		}
	},
	abacus: {
		instance: 'https://abacus.jasoncameron.dev',
		namespace: 'jasoncameron',
		key: 'portfolio'
	},
	out: {
		github: 'https://github.com/JasonLovesDoggo',
		linkedin: 'https://www.linkedin.com/in/jsoncameron/',
		calcom: 'https://cal.com/jsoncam/15min',
		wakatime: 'https://wakatime.com/@jasonlovesdoggo',
		bluesky: 'https://bsky.app/profile/jsn.cam',
		instagram: 'https://www.instagram.com/jsn.cam/',
		x: 'https://x.com/tomlparser'
	},
	repo: {
		url: 'https://github.com/JasonLovesDoggo/nyx',
		commitBaseUrl: 'https://github.com/JasonLovesDoggo/nyx/commit/'
	}
};

export default Site;

export const Socials = [
	{
		url: Site.out.github,
		label: 'GitHub',
		icon: IconBrandGithub,
		footer: true
	},
	{
		url: Site.out.linkedin,
		label: 'LinkedIn',
		icon: IconBrandLinkedin,
		footer: true
	},
	{
		url: Site.out.x,
		label: 'X',
		icon: IconBrandX,
		footer: true
	},
	{
		url: Site.out.bluesky,
		label: 'Bluesky',
		icon: IconBrandBluesky,
		footer: false
	},
	{
		url: Site.out.instagram,
		label: 'Instagram',
		icon: IconBrandInstagram,
		footer: true
	},
	{
		url: Site.out.wakatime,
		label: 'WakaTime',
		icon: Wakatime as unknown as Icon,
		footer: false
	}
];
