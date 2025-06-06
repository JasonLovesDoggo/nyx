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

export interface ExperienceTimelineItem {
	company: string;
	role: string;
	url: string;
	logoUrl: string;
	logoAlt: string;
	startDate: string;
	endDate?: string; // optional endDate. If present, it's a past role.
	details?: string; // Optional details for expansion
}

export const experienceTimeline: ExperienceTimelineItem[] = [
	{
		company: 'RBC',
		role: 'Incoming Intern',
		url: 'https://www.rbc.com/about-rbc.html',
		logoUrl: '/logos/rbc.svg',
		logoAlt: 'RBC Logo',
		startDate: '2025-07-02',
		details: 'I will be joining RBC as an intern in the summer of 2025.'
	},
	{
		company: 'StorageBox',
		role: 'CTO',
		url: 'https://storagebox.app/',
		logoUrl: '/logos/storagebox.svg',
		logoAlt: 'StorageBox Logo',
		startDate: '2024-09-01',
		details:
			'As CTO, I lead the development of StorageBox, an innovative startup revolutionizing eco-friendly Shopify fulfillment with edge based sustainable warehousing technology and seamless logistics integrations.'
	},
	{
		company: 'Hack Canada',
		role: 'Cofounder',
		url: 'https://hackcanada.org/',
		logoUrl: '/logos/hackcanada.svg',
		logoAlt: 'Hack Canada Logo',
		startDate: '2024-09-01',
		endDate: '2025-05-01',
		details:
			"Co-launched Hack Canada, Hackathons Canada's premier national hackathon series. Organized the inaugural event (February 21–23, 2025), secured partnerships with Google, WarpDev, and Microsoft and more, oversaw all development, workshops, and mentorship sessions for 400+ participants."
	}
];
