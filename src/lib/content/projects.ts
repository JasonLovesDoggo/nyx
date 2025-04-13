import { error } from '@sveltejs/kit';
import type { ProjectMetadata, ProjectEntry, ProjectPageData } from '$types/projects';
import type { SvelteComponent } from 'svelte';

const projectModules = import.meta.glob('/src/content/projects/*.svx', { eager: true });

function slugFrom(path: string) {
	return path.split('/').pop()!.replace('.svx', '');
}

let _allProjects: ProjectEntry[];
export function getAllProjects(): ProjectEntry[] {
	if (!_allProjects) {
		_allProjects = Object.entries(projectModules)
			.map(([path, mod]) => ({
				slug: slugFrom(path),
				metadata: (mod as ProjectEntry).metadata as ProjectMetadata
			}))
			.filter((p) => p.metadata.published)
			.sort((a, b) => +new Date(b.metadata.date) - +new Date(a.metadata.date));
	}
	return _allProjects;
}

let _featuredProjects: ProjectEntry[];
export function getFeaturedProjects(): ProjectEntry[] {
	if (!_featuredProjects) {
		_featuredProjects = getAllProjects().filter((p) => p.metadata.featured);
	}
	return _featuredProjects;
}

export function getProjectBySlug(slug: string): ProjectPageData {
	const path = `/src/content/projects/${slug}.svx`;
	const mod = (projectModules as Record<string, SvelteComponent>)[path];
	if (!mod || !mod.metadata?.published) throw error(404, `Project not found: ${slug}`);
	return { slug, metadata: mod.metadata, content: mod.default } satisfies ProjectPageData;
}
