import type { Icon } from '@tabler/icons-svelte';

interface NavItem {
	title: string;
	href: string;
	icon?: Icon; // Keeping icon prop for potential future use
	external?: boolean; // Flag for external links
}

// Separate main nav items from the 'More' items
export const mainNavItems: NavItem[] = [
	{ title: 'About', href: '/about' },
	{ title: 'Projects', href: '/projects' },
	{ title: 'Resume', href: '/resume.pdf', external: true }
];

export const moreNavItems: NavItem[] = [
	{ title: 'Posts', href: '/posts' },
	{ title: 'Tutorials', href: '/tutorials' }
];
// Example 'More' items - add your 20+ items here
// export const moreNavItems: NavItem[] = [
// 	{ title: 'Blog', href: '/blog' }, // Example internal
// 	{ title: 'Guestbook', href: '/guestbook' },
// 	{ title: 'Contact', href: '/contact' },
// 	{ title: 'Archives', href: '/archives' },
// 	{ title: 'Tool A', href: '/tools/a' },
// 	{ title: 'Tool B', href: '/tools/b' },
// 	{ title: 'Old Site', href: 'https://old.jasoncameron.dev', external: true },
// 	{ title: 'Resource 1', href: '/resources/1' },
// 	{ title: 'Resource 2', href: '/resources/2' },
// 	{ title: 'Resource 3', href: '/resources/3' },
// 	{ title: 'Policy', href: '/policy' },
// 	{ title: 'Terms', href: '/terms' },
// 	// ... add many more items here
// 	{ title: 'Item 13', href: '/more/13' },
// 	{ title: 'Item 14', href: '/more/14' },
// 	{ title: 'Item 15', href: '/more/15' },
// 	{ title: 'Item 16', href: '/more/16' },
// 	{ title: 'Item 17', href: '/more/17' },
// 	{ title: 'Item 18', href: '/more/18' },
// 	{ title: 'Item 19', href: '/more/19' },
// 	{ title: 'Item 20', href: '/more/20' }
// ];
