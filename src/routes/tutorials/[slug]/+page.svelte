<!--
  - Copyright (c) 2025. Jason Cameron
  - All Rights Reserved
  -->

<script lang="ts">
	import { formatDate } from '$lib/utils/date';
	import type { TutorialPageData } from '$lib/content/tutorials';

	export let data: TutorialPageData;
	import '$lib/styles/syntax.css';
	import { page } from '$app/state';

	// Component generated from mdsvex
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
	<header class="mb-8 space-y-2">
		<h1 class="text-3xl font-bold">{data.metadata.title}</h1>
		<p class="text-subtext0 text-sm">
			{#if data.metadata.published_at}
				{formatDate(data.metadata.published_at)}
			{:else}
				Draft
			{/if}
			{#if data.metadata.updated_at}
				| Updated {formatDate(data.metadata.updated_at)}
			{/if}
		</p>
		{#if data.metadata.tags}
			<div class="flex flex-wrap gap-2">
				{#each data.metadata.tags as tag (data.slug + tag)}
					<span class="bg-surface1 rounded px-2 py-1 text-xs">{tag}</span>
				{/each}
			</div>
		{/if}
	</header>

	<hr />

	<div class="mt-8">
		<Content />
	</div>
</article>
