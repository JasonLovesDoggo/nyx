<script lang="ts">
	import { formatDate } from '$lib/utils/date';
	import type { PostPageData } from '$lib/content/posts';

	export let data: PostPageData;

	// Component generated from mdsvex
	const Content = data.content;
</script>

<svelte:head>
	<title>{data.metadata.title}</title>
	<meta name="description" content={data.metadata.description} />
	{#if data.metadata.tags}
		<meta name="keywords" content={data.metadata.tags.join(', ')} />
	{/if}
</svelte:head>

<article class="prose prose-invert prose-headings:text-accent mx-auto max-w-4xl">
	<header class="mb-8 space-y-2">
		<h1 class="text-3xl font-bold">{data.metadata.title}</h1>
		<p class="text-subtext0 text-sm">
			{formatDate(data.metadata.date)}
			{#if data.metadata.updated}
				| Updated {formatDate(data.metadata.updated)}
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

<style>
	:global(html.latte .shiki),
	:global(html.latte .shiki span) {
		background-color: var(--shiki-latte-bg) !important;
		color: var(--shiki-latte) !important;
	}

	:global(html.frappe .shiki),
	:global(html.frappe .shiki span) {
		background-color: var(--shiki-frappe-bg) !important;
		color: var(--shiki-frappe) !important;
	}

	:global(html.macchiato .shiki),
	:global(html.macchiato .shiki span) {
		background-color: var(--shiki-macchiato-bg) !important;
		color: var(--shiki-macchiato) !important;
	}

	:global(html.mocha .shiki),
	:global(html.mocha .shiki span),
	:global(.shiki),
	:global(.shiki span) {
		background-color: var(--shiki-mocha-bg) !important;
		color: var(--shiki-mocha) !important;
	}
</style>
