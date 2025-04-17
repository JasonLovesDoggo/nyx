<script lang="ts">
	import { IconCalendarEvent, IconTag } from '@tabler/icons-svelte';
	import type { ProjectPageData } from '$types/projects'; // Add relevant icons
	import { page } from '$app/state';
	import { formatDate } from '$utils/date';

	import '$static/css/markdown.css';
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
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.metadata.title} />
	<meta name="twitter:description" content={data.metadata.description} />
	{#if data.metadata.imageUrl}
		<meta
			name="twitter:image:src"
			content={new URL(data.metadata.imageUrl, page.url.origin).href}
		/>
	{/if}
</svelte:head>

<article class="prose mx-auto max-w-4xl">
	<!-- Banner Image -->
	{#if data.metadata.imageUrl}
		<div class="mb-8 overflow-hidden rounded-lg shadow-lg md:rounded-xl">
			<img
				src={data.metadata.imageUrl}
				alt={data.metadata.imageAlt}
				class="aspect-[16/7] w-full object-cover"
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

			{#if data.metadata.tags && data.metadata.tags.length > 0}
				<div class="flex items-center gap-1.5">
					<IconTag size={16} />
					<div class="flex flex-wrap gap-1.5">
						{#each data.metadata.tags as tag ('root' + tag)}
							<span class="bg-surface0 text-subtext1 rounded px-1.5 py-0.5 text-xs font-medium"
								>{tag}</span
							>
						{/each}
					</div>
				</div>
			{/if}
			{#if data.metadata.githubUrl}
				<a
					href={data.metadata.githubUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="hover:text-accent flex items-center gap-1 transition-colors">...GitHub Icon...</a
				>
			{/if}
			{#if data.metadata.projectUrl}
				<a
					href={data.metadata.projectUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="hover:text-accent flex items-center gap-1 transition-colors">...Link Icon...</a
				>
			{/if}
		</div>
	</header>

	<hr class="border-surface1 mb-8" />

	<Content />
</article>
