<script lang="ts">
	import { IconCalendarEvent } from '@tabler/icons-svelte';
	import type { ProjectPageData } from '$types/projects';
	import { page } from '$app/state';
	import { formatDate } from '$utils/date';
	import { getIconByName } from '$lib/content/projects';

	import '$lib/styles/content.css';
	import ProjectTags from '$components/projects/ProjectTags.svelte';

	type PageData = ProjectPageData;

	let { data }: { data: PageData } = $props();

	const Content = data.content;
</script>

<svelte:head>
	<title>{data.metadata.title}</title>
	<meta name="description" content={data.metadata.description} />
	{#if data.metadata.tags}
		<meta name="keywords" content={data.metadata.tags.join(', ')} />
	{/if}
	<meta property="og:title" content={data.metadata.title} />
	<meta property="og:description" content={data.metadata.description} />
	{#if data.metadata.imageUrl}
		<meta property="og:image" content={new URL(data.metadata.imageUrl, page.url.origin).href} />
	{/if}
	<meta property="og:type" content="article" />
	<meta name="twitter:title" content={data.metadata.title} />
	<meta name="twitter:description" content={data.metadata.description} />
	{#if data.metadata.imageUrl}
		<meta
			name="twitter:image:src"
			content={new URL(data.metadata.imageUrl, page.url.origin).href}
		/>
	{/if}
</svelte:head>

<article class="prose mx-auto mb-6 max-w-4xl">
	<!-- Banner Image -->
	{#if data.metadata.imageUrl}
		<div class=" bg-red mb-8 rounded-lg md:rounded-xl">
			<img
				src={data.metadata.imageUrl}
				alt={data.metadata.imageAlt}
				class="aspect-video rounded-lg md:rounded-xl"
			/>
		</div>
	{/if}

	<!-- Header Section -->
	<header class="mb-8 space-y-4">
		<h1 class="text-3xl font-bold md:text-4xl">
			{data.metadata.title}
		</h1>

		<div class="text-subtext0 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
			{#if data.metadata.date}
				<div class="flex items-center gap-1.5">
					<IconCalendarEvent size={16} />
					<span>{formatDate(data.metadata.date)}</span>
				</div>
			{/if}
			{#if data.metadata.links && data.metadata.links.length > 0}
				{#each data.metadata.links as link (data.slug + link.text)}
					{@const Icon = getIconByName(
						link.icon || (link.text.toLowerCase().includes('github') ? 'github' : 'external')
					)}
					<a
						href={link.url}
						title={link.text}
						target="_blank"
						rel="noopener noreferrer"
						class="group hover:text-accent flex items-center gap-1.5 transition-colors"
					>
						<Icon size={16} class="transition-transform duration-200 group-hover:scale-120" />
					</a>
				{/each}
			{/if}
		</div>

		<!-- Tags on a new line -->
		<div class="text-subtext0 mt-2 flex items-center gap-x-2 text-sm">
			<ProjectTags project={data} />
		</div>
	</header>

	<hr class="border-surface1 mb-8" />

	<Content />
</article>
