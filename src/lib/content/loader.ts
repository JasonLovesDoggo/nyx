import path from 'path';
import type { ProjectEntry, ProjectMetadata, WithMetadata } from '$types/projects';
import type { SvelteComponent } from 'svelte';
// Potentially add Blog types here too if reusing: import type { BlogEntry, BlogMetadata } from '$types/blog';

// --- Project Loading ---

// Eagerly load all project metadata at build time
const projectModules = import.meta.glob('/src/content/projects/*.svx', { eager: true });

const allProjects: ProjectEntry[] = Object.entries(projectModules).map(([filePath, module]) => {
	const typedModule = module as WithMetadata; // Cast to ensure metadata property exists
	const metadata = typedModule.metadata as unknown as ProjectMetadata; // Cast metadata
	const slug = path.parse(filePath).name;
	return {
		slug,
		metadata
	};
});

// Filter for published projects and sort them once
const publishedProjects = allProjects
	.filter((project) => project.metadata.published)
	.sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime());

// Create a map for quick slug lookup
const projectsBySlug = new Map(publishedProjects.map((project) => [project.slug, project]));

/**
 * Gets all published projects, sorted by date descending.
 */
export function getAllPublishedProjects(): ProjectEntry[] {
	return publishedProjects;
}

/**
 * Gets a specific published project by its slug.
 */
export function getProjectBySlug(slug: string): ProjectEntry | undefined {
	return projectsBySlug.get(slug);
}

/**
 * Gets all published project slugs (for prerendering).
 */
export function getAllPublishedProjectSlugs(): { slug: string }[] {
	return publishedProjects.map((p) => ({ slug: p.slug }));
}

// --- Blog Post Loading (Example - Adapt as needed) ---

// Uncomment and adapt if you add blog posts following the same pattern
/*
const blogModules = import.meta.glob('/src/content/blog/*.svx', { eager: true });

const allBlogPosts: BlogEntry[] = Object.entries(blogModules).map(([filePath, module]) => {
    // ... similar logic to projects ...
    // const metadata = module.metadata as BlogMetadata;
    // ...
});

const publishedBlogPosts = allBlogPosts
    .filter(post => post.metadata.published)
    .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime());

const blogPostsBySlug = new Map(publishedBlogPosts.map(post => [post.slug, post]));

export function getAllPublishedBlogPosts(): BlogEntry[] {
    return publishedBlogPosts;
}

export function getBlogPostBySlug(slug: string): BlogEntry | undefined {
    return blogPostsBySlug.get(slug);
}
*/

// --- Dynamic Component Loader ---
// Non-eager glob for loading the actual Svelte components on demand
const componentImporters = import.meta.glob('/src/content/projects/*.svx');
// Add blog importers if needed: const blogComponentImporters = import.meta.glob('/src/content/blog/*.svx');

/**
 * Dynamically imports the Svelte component for a given project slug.
 */
export async function loadProjectComponent(slug: string): Promise<SvelteComponent | undefined> {
	const importPath = `/src/content/projects/${slug}.svx`;
	const importer = componentImporters[importPath];
	if (!importer) {
		return undefined;
	}
	const module = (await importer()) as { default?: SvelteComponent };
	return module.default;
}
