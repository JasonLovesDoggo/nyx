<script lang="ts">
	import { formatDate } from '$lib/utils/date';
	import type { TutorialPageData } from '$lib/content/tutorials';

	export let data: TutorialPageData;
	import '$lib/styles/content.css';
	import { page } from '$app/state';
	import { getRandomAccentColor } from '$lib/stores/theme';

	const Content = data.content;

	// Assign a random color to each tag
	let tagColors =
		data.metadata.tags?.reduce(
			(acc, tag) => {
				acc[tag] = getRandomAccentColor();
				return acc;
			},
			{} as Record<string, string>
		) || {};
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
					{#if tagColors[tag]}
						<span
							class="rounded px-2 py-1 text-xs font-semibold"
							style="background-color: var(--color-surface0); color: var(--color-{tagColors[tag]})"
						>
							{tag}
						</span>
					{/if}
				{/each}
			</div>
		{/if}
		{#if data.metadata.sources && data.metadata.sources.length > 0}
			<div class="mt-4">
				<h3 class="text-lg font-semibold">Sources</h3>
				<ul class="mt-2 list-disc pl-5">
					{#each data.metadata.sources as source (data.slug + source.title)}
						<li>
							<a
								href={source.url}
								target="_blank"
								rel="noopener noreferrer"
								class="text-accent hover:underline"
							>
								{source.title}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</header>

	<hr />

	<div class="mt-8">
		<Content />
	</div>
</article>
