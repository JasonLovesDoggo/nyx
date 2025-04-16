<script lang="ts">
	import { IconFolders } from '@tabler/icons-svelte';
	import type { ProjectEntry } from '$types/projects';
	import { formatDate } from '$utils/date';

	type PageData = {
		projects: ProjectEntry[];
	};

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Projects</title>
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
					<img
						src={project.metadata.imageUrl}
						alt={project.metadata.imageAlt}
						class="mb-4 aspect-video w-full rounded-md object-cover"
					/>

					<h2 class="text-text group-hover:text-accent text-xl font-semibold">
						{project.metadata.title}
					</h2>
					<p class="text-subtext0 text-sm">{project.metadata.description}</p>

					{#if project.metadata.tags && project.metadata.tags.length > 0}
						<div class="flex flex-wrap gap-2 pt-2">
							{#each project.metadata.tags as tag (project.slug + tag)}
								<span class="bg-surface1 text-subtext1 rounded px-2 py-0.5 text-xs font-medium"
									>{tag}</span
								>
							{/each}
						</div>
					{/if}

					<p class="text-overlay0 pt-2 text-xs">
						{formatDate(project.metadata.date)}
					</p>
				</a>
			{/each}
		</div>
	{:else}
		<p class="text-subtext1">No projects published yet.</p>
	{/if}
</div>
