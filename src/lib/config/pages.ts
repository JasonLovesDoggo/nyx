import { IconBrandGithub, IconBrandLinkedin, IconFileCv } from '@tabler/icons-svelte';
import Site from '$lib/config/common';

export const Home = {
	socialLinks: [
		{
			href: Site.out.github,
			text: 'GitHub',
			icon: IconBrandGithub
		},
		{
			href: Site.out.linkedin,
			text: 'LinkedIn',
			icon: IconBrandLinkedin
		},
		{ href: '/resume.pdf', text: 'Resume', icon: IconFileCv }
	]
};

export const experienceTimeline = [
	{
		company: 'RBC',
		role: 'Incoming Intern',
		url: 'https://www.rbc.com',
		logoUrl: '/logos/rbc.png',
		logoAlt: 'RBC Logo'
	},
	{
		company: 'StorageBox',
		role: 'CTO',
		url: 'https://storagebox.app/',
		logoUrl: '/logos/storagebox.svg',
		logoAlt: 'StorageBox Logo'
	},
	{
		company: 'Hack Canada',
		role: 'Cofounder',
		url: 'https://hackcanada.org/',
		logoUrl: '/logos/hackcanada.svg',
		logoAlt: 'Hack Canada Logo'
	}
];
