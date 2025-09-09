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
	};
	socials: SocialLink[];
	repo: { url: string; commitBaseUrl: string };
}

const Site: Site = {
	name: 'Jason Cameron',
	url: dev ? 'http://localhost:5173' : 'https://jasoncameron.dev',
	description:
		'Jason Cameron - Senior Software Engineer in Toronto, Canada. I occasionally like building cool shit',
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
		instagram: 'https://www.instagram.com/jsn.cam/'
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
			url: 'https://www.instagram.com/jsn.cam/',
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
