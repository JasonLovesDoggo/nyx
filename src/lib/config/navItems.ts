import type { Icon } from '@tabler/icons-svelte';

interface NavItem {
	title: string;
	href: string;
	icon?: Icon;
	submenu?: NavItem[];
}

export const navItems: NavItem[] = [
	{ title: 'About', href: '/about' },
	{ title: 'Projects', href: '/projects' },
	{ title: 'Resume', href: 'https://jasoncameron.dev/resume.pdf' },
	{
		title: 'More',
		href: '#',
		// submenu: [
			// { title: 'Foodle', href: 'http://jasoncameron.dev/foodle/' },
		// ],
	},
];