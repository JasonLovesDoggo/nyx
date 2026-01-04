import type { ProjectMetadata } from '$types/projects';
import { IconBrandGithub, IconExternalLink, IconFileText, IconCode } from '@tabler/icons-svelte';
import { createContentService, type ContentEntry } from './factory';

const DevpostIcon = () => import('$lib/icons/Devpost.svelte');

// Type-safe function to get icon component by name
export function getIconByName(name?: string) {
	switch (name) {
		case 'github':
			return IconBrandGithub;
		case 'external':
			return IconExternalLink;
		case 'docs':
			return IconFileText;
		case 'code':
			return IconCode;
		case 'devpost':
			return DevpostIcon;
		default:
			return IconExternalLink;
	}
}

export type ProjectEntry = ContentEntry<ProjectMetadata>;

const projectService = createContentService<ProjectMetadata>({
	modules: import.meta.glob('/content/projects/*.svx', { eager: true }),
	contentType: 'project',
	filter: (p) => p.metadata.published,
	sort: (a, b) => +new Date(b.metadata.date) - +new Date(a.metadata.date)
});

export const getAllProjects = projectService.getAll;
export const getProjectBySlug = projectService.getBySlug;

let featuredProjectsPromise: Promise<ProjectEntry[]> | null = null;
export function getFeaturedProjects(): Promise<ProjectEntry[]> {
	if (!featuredProjectsPromise) {
		featuredProjectsPromise = getAllProjects().then((projects) =>
			projects.filter((p) => p.metadata.featured)
		);
	}
	return featuredProjectsPromise;
}
