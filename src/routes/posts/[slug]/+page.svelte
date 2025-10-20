<script lang="ts">
	import { formatDate } from '$lib/utils/date';
	import type { PostPageData } from '$lib/content/posts';
	import SlabTitle from '$components/SlabTitle.svelte';
	import PostTags from '$components/posts/PostTags.svelte';

	export let data: PostPageData;
	import '$lib/styles/content.css';
	import { page } from '$app/state';

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

<div class="mx-auto max-w-4xl px-4">
	<header class="mb-12 space-y-4">
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
		<PostTags post={data} slug={data.slug} />
	</header>

	<article class="prose mx-auto mb-6 max-w-4xl">
		<Content />
	</article>
</div>
