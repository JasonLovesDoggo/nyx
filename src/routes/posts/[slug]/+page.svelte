<script lang="ts">
	import { formatDate } from '$lib/utils/date';
	import type { PostPageData } from '$lib/content/posts';
	import SlabTitle from '$components/SlabTitle.svelte';
	import PostTags from '$components/posts/PostTags.svelte';
	import { initSidenoteCounter } from '$lib/stores/sidenote';
	import '$lib/styles/content.css';
	import { page } from '$app/state';

	export let data: PostPageData;

	// Initialize sidenote counter for this post
	initSidenoteCounter();

	// Component generated from mdsvex
	const Content = data.content;
</script>

<svelte:head>
	<title>{data.metadata.title.text}</title>
	<meta name="description" content={data.metadata.description} />
	{#if data.metadata.tags}
		<meta name="keywords" content={data.metadata.tags.join(', ')} />
	{/if}
	<meta property="og:title" content={data.metadata.title.text} />
	<meta property="og:description" content={data.metadata.description} />
	{#if data.metadata.image}
		<meta property="og:image" content={new URL(data.metadata.image.url, page.url.origin).href} />
	{/if}
	<meta property="og:type" content="article" />
	<meta name="twitter:title" content={data.metadata.title.text} />
	<meta name="twitter:description" content={data.metadata.description} />
	{#if data.metadata.image}
		<meta
			name="twitter:image:src"
			content={new URL(data.metadata.image.url, page.url.origin).href}
		/>
	{/if}
</svelte:head>

<div class="mx-auto max-w-4xl">
	<header class="post-header mb-12 space-y-4 px-4">
		<SlabTitle
			title={data.metadata.title.text}
			slug={data.slug}
			config={data.metadata.title?.config}
			hash={data.metadata.title?.hash}
		/>
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
		<PostTags post={data} />
	</header>

	<article class="prose relative mb-6 max-w-none overflow-visible px-4">
		<Content />
	</article>

	<p class="post-footer text-overlay0 mt-8 px-4 pb-8 text-center text-sm">
		Thanks for reading! Hope you found this useful.
	</p>
</div>
