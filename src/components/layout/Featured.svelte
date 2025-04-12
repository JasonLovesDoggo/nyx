<script lang="ts">
	import { IconFolders, IconArrowRight } from '@tabler/icons-svelte';

	// Define the expected prop structure and type
	interface ProjectMetadata {
		title: string;
		description: string;
		date: string;
		tags?: string[];
		// Add other expected fields
	}

	interface FeaturedProject {
		slug: string;
		metadata: ProjectMetadata;
	}

	type Props = {
		projects: FeaturedProject[];
	};

	let { projects }: Props = $props();
</script>

{#if projects.length > 0}
	<section class="px-4 md:px-0">
		<h2 class="mb-6 flex items-center gap-2 text-2xl font-semibold">
			<IconFolders size={24} class="text-accent" />
			Featured Projects
		</h2>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			{#each projects as project (project.slug)}
				<a
					href={`/projects/${project.slug}`}
					class="border-surface0 bg-base hover:border-accent group block rounded-xl border p-5 shadow-lg transition-colors duration-200"
				>
					<h3 class="text-text group-hover:text-accent mb-2 text-lg font-semibold">
						{project.metadata.title}
					</h3>
					<p class="text-subtext0 mb-3 text-sm leading-relaxed">{project.metadata.description}</p>
					{#if project.metadata.tags && project.metadata.tags.length > 0}
						<div class="flex flex-wrap gap-2">
							{#each project.metadata.tags as tag (project.slug + tag)}
								<span class="bg-surface1 text-subtext1 rounded px-2 py-0.5 text-xs font-medium"
									>{tag}</span
								>
							{/each}
						</div>
					{/if}
				</a>
			{/each}
		</div>
		<a
			href="/projects"
			class="group text-accent mt-6 inline-flex items-center gap-1 text-sm hover:underline"
		>
			<span>All projects</span>
			<IconArrowRight
				size={14}
				class="transition-transform duration-200 group-hover:translate-x-0.5"
			/>
		</a>
	</section>
{/if}
