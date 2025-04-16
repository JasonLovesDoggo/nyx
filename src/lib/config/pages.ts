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

interface ExperienceTimelineItem {
	company: string;
	role: string;
	url: string;
	logoUrl: string;
	logoAlt: string;
	endDate?: string; // Use optional endDate. If present, it's a past role.
	details?: string; // Optional details for expansion
}

export const experienceTimeline: ExperienceTimelineItem[] = [
	{
		company: 'RBC',
		role: 'Incoming Intern',
		url: 'https://www.rbc.com',
		logoUrl: '/logos/rbc.svg',
		logoAlt: 'RBC Logo',
		details:
			'I will be joining RBC as an intern in the summer of 2024. I am excited to work with a team that is at the forefront of innovation in the financial services industry.'
	},
	{
		company: 'StorageBox',
		role: 'CTO',
		url: 'https://storagebox.app/',
		logoUrl: '/logos/storagebox.svg',
		logoAlt: 'StorageBox Logo',
		details:
			'As CTO, I lead the technical vision and development of StorageBox, a platform that simplifies file management and sharing.'
	},
	{
		company: 'Hack Canada',
		role: 'Cofounder',
		url: 'https://hackcanada.org/',
		logoUrl: '/logos/hackcanada.svg',
		logoAlt: 'Hack Canada Logo',
		endDate: '2025-05-01',
		details:
			'Hack Canada is a national hackathon series that brings together students from across Canada to innovate and create impactful projects. As a cofounder, I am involved in organizing events and fostering a community of young developers.'
	}
];
