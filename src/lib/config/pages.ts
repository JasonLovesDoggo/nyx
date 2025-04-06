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
