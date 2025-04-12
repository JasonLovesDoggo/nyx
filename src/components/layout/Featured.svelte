<script lang="ts">
	import { IconArrowRight, IconStar } from '@tabler/icons-svelte';
	import type { ProjectMetadata } from '$types/projects';

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
	<section class="px-0 py-8 md:px-4">
		<div class="mb-8 flex items-center justify-between">
			<h2 class="flex items-center gap-3 text-2xl font-semibold md:text-3xl">
				<IconStar size={28} class="text-accent" />
				<span>Featured Projects</span>
			</h2>
			<a
				href="/projects"
				class="group text-accent hidden items-center gap-1 text-sm hover:underline sm:inline-flex"
			>
				<span>View all</span>
				<IconArrowRight
					size={14}
					class="transition-transform duration-200 group-hover:translate-x-0.5"
				/>
			</a>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			{#each projects as project (project.slug)}
				<a
					href={`/projects/${project.slug}`}
					class="border-surface0 bg-mantle hover:border-accent focus-visible:border-accent group block overflow-hidden rounded-xl border shadow-lg transition-all duration-300 hover:shadow-xl focus:outline-none"
					style:view-transition-name="project-card-{project.slug}"
				>
					{#if project.metadata.imageUrl}
						<div class="overflow-hidden">
							<img
								src={project.metadata.imageUrl}
								alt={project.metadata.imageAlt}
								class="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
								style:view-transition-name="project-banner-{project.slug}"
							/>
						</div>
					{/if}

					<div class="space-y-3 p-5">
						<h3
							class="text-text group-hover:text-accent text-xl font-semibold transition-colors"
							style:view-transition-name="project-title-{project.slug}"
						>
							{project.metadata.title}
						</h3>
						<p class="text-subtext0 line-clamp-2 text-sm">{project.metadata.description}</p>

						{#if project.metadata.tags && project.metadata.tags.length > 0}
							<div class="flex flex-wrap gap-2 pt-1">
								{#each project.metadata.tags as tag ('feat' + project.slug + tag)}
									<span class="bg-surface0 text-subtext1 rounded px-2 py-0.5 text-xs font-medium"
										>{tag}</span
									>
								{/each}
							</div>
						{/if}
					</div>
				</a>
			{/each}
		</div>

		<!-- Link for smaller screens -->
		<div class="mt-6 text-center sm:hidden">
			<a
				href="/projects"
				class="group text-accent inline-flex items-center gap-1 text-sm hover:underline"
			>
				<span>View all projects</span>
				<IconArrowRight
					size={14}
					class="transition-transform duration-200 group-hover:translate-x-0.5"
				/>
			</a>
		</div>
	</section>
{/if}
