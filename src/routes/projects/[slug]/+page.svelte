<script lang="ts">
	import type { ProjectPageData } from '$types/projects';

	type PageData = ProjectPageData; // Use the detailed type

	let { data }: { data: PageData } = $props();

	// Optional: Format date
	function formatDate(dateString: string) {
		try {
			return new Date(dateString).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
		} catch {
			return dateString; // Fallback
		}
	}
	const Content = data.content;
</script>

<svelte:head>
	<title>{data.metadata.title}</title>
	<meta name="description" content={data.metadata.description} />
	{#if data.metadata.tags}
		<meta name="keywords" content={data.metadata.tags.join(', ')} />
	{/if}
</svelte:head>

<article
	class="prose prose-invert prose-headings:text-accent prose-a:text-accent prose-strong:text-text max-w-none"
>
	<h1>{data.metadata.title}</h1>
	<p class="text-subtext0 text-sm">Published on: {formatDate(data.metadata.date)}</p>

	{#if data.metadata.tags && data.metadata.tags.length > 0}
		<div class="not-prose mb-6 flex flex-wrap gap-2">
			{#each data.metadata.tags as tag (data.slug + tag)}
				<span class="bg-surface1 text-subtext1 rounded px-2 py-0.5 text-xs font-medium">{tag}</span>
			{/each}
		</div>
	{/if}

	<hr class="border-surface1" />

	<Content />
</article>
