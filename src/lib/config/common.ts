import {
	type Icon,
	IconBrandBluesky,
	IconBrandGithub,
	IconBrandInstagram,
	IconBrandLinkedin,
} from '@tabler/icons-svelte';

interface SocialLink {
	url: string;
	label: string;
	icon: Icon;
}

interface Site {
	name: string;
	abacus: { instance: string; namespace: string; key: string };
	out: {
		github: string;
		linkedin: string;
		calcom: string;
	};
	socials: SocialLink[]
	repo: { url: string; commitBaseUrl: string }}


const Site: Site = {
	name: 'Portfolio',
	abacus: {
		instance: 'https://abacus.jasoncameron.dev',
		namespace: 'jasoncameron',
		key: 'portfolio'
	},
	out: {
		github: "https://github.com/JasonLovesDoggo",
		linkedin: "https://www.linkedin.com/in/jsoncameron/",
		calcom: "https://cal.com/jsoncam/15min"
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
