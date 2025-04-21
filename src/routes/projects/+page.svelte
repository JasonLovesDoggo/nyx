<script lang="ts">
	import { IconFolders } from '@tabler/icons-svelte';
	import type { ProjectEntry } from '$types/projects';
	import { formatDate } from '$utils/date';
	import ProjectTags from '$components/projects/ProjectTags.svelte';

	type PageData = {
		projects: ProjectEntry[];
	};

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<meta name="description" content="A collection of projects by Jason Cameron." />
</svelte:head>

<div class="space-y-8">
	<h1 class="mb-8 flex items-center gap-3 text-3xl font-bold">
		<IconFolders size={30} class="text-accent" />
		<span>Projects</span>
	</h1>

	{#if data.projects.length > 0}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each data.projects as project (project.slug)}
				<a
					href={`/projects/${project.slug}`}
					class="border-surface0 bg-base hover:border-accent group block space-y-3 rounded-xl border p-5 shadow-lg transition-colors duration-200"
				>
					{#if project.metadata.imageUrl}
						<img
							src={project.metadata.imageUrl}
							alt={project.metadata.imageAlt}
							class="mb-4 aspect-video w-full rounded-md"
						/>
					{:else}
						<div class="bg-surface2 mb-4 aspect-video w-full rounded-md"></div>
					{/if}
					<div class="flex justify-between pe-3">
						<h2 class="text-text group-hover:text-accent text-xl font-semibold">
							{project.metadata.title}
						</h2>
						<p class="text-overlay1 content-center text-xs">
							{formatDate(project.metadata.date)}
						</p>
					</div>
					<p class="text-subtext0 line-clamp-3 text-sm">{project.metadata.description}</p>

					<ProjectTags {project} />
				</a>
			{/each}
		</div>
	{:else}
		<p class="text-subtext1">No projects published yet.</p>
	{/if}
</div>
