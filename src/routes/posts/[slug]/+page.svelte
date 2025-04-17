<script lang="ts">
	import { formatDate } from '$lib/utils/date';
	import type { PostPageData } from '$lib/content/posts';

	export let data: PostPageData;
	import '$static/css/markdown.css';

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

<article class="prose mx-auto max-w-4xl">
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
