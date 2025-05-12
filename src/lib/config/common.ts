import {
	type Icon,
	IconBrandBluesky,
	IconBrandGithub,
	IconBrandInstagram,
	IconBrandLinkedin
} from '@tabler/icons-svelte';
import { dev } from '$app/environment';
import Wakatime from '$lib/icons/Wakatime.svelte';
interface SocialLink {
	url: string;
	label: string;
	icon: Icon;
}

interface Site {
	name: string;
	url: string;
	description: string;
	tags: string[];
	abacus: { instance: string; namespace: string; key: string };
	out: {
		github: string;
		linkedin: string;
		calcom: string;
		wakatime: string;
		bluesky: string;
	};
	socials: SocialLink[];
	repo: { url: string; commitBaseUrl: string };
}

const Site: Site = {
	name: 'Portfolio',
	url: dev ? 'http://localhost:5173' : 'https://nyx.jasoncameron.dev',
	description: "Jason Cameron's Portfolio",
	tags: [
		'Jason Cameron',
		'Portfolio',
		'Software Engineer',
		'Toronto',
		'Canada',
		'Golang',
		'Python',
		'DevOps',
		'Hackathon',
		'Anubis',
		'Developer'
	],
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
		bluesky: 'https://bsky.app/profile/jsn.cam'
	},
	socials: [
		{
			url: 'https://github.com/jasonlovesdoggo',
			label: 'GitHub Profile',
			icon: IconBrandGithub
		},
		{
			url: 'https://www.linkedin.com/in/jsoncameron/',
			label: 'LinkedIn Profile',
			icon: IconBrandLinkedin
		},
		{
			url: 'https://bsky.app/profile/jsn.cam',
			label: 'Bluesky Profile',
			icon: IconBrandBluesky
		},
		{
			url: 'https://www.instagram.com/jasonlovesdoggo/',
			label: 'Instagram Profile',
			icon: IconBrandInstagram
		}
	],
	repo: {
		url: 'https://github.com/JasonLovesDoggo/nyx',
		commitBaseUrl: 'https://github.com/JasonLovesDoggo/nyx/commit/'
	}
};

export default Site;

interface SocialEntry {
	url: string;
	label: string;
	icon: Icon;
}

export const Socials: SocialEntry[] = [
	{
		url: Site.out.github,
		label: 'GitHub',
		icon: IconBrandGithub
	},
	{
		url: Site.out.linkedin,
		label: 'LinkedIn',
		icon: IconBrandLinkedin
	},
	{
		url: Site.out.wakatime,
		label: 'WakaTime',
		icon: Wakatime as unknown as Icon
	}
];
