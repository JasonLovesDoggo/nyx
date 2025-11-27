<script lang="ts">
	import { formatDate } from '$lib/utils/date';
	import type { PostEntry } from '$lib/content/posts';
	import PostTags from '$components/posts/PostTags.svelte';

	export let data: { posts: PostEntry[] };

	const words = (title: string) => title.split(' ');
	const safePath = (slug: string) => slug.split('/').pop() || slug;

	function getViewTransitionName(
		slug: string,
		word: string,
		wordIndex: number,
		allWords: string[]
	): string {
		const normalized = word.toLowerCase().replace(/[^a-z0-9\s-_]/g, '');
		// Count how many times this word appeared before this index
		const previousOccurrences = allWords
			.slice(0, wordIndex)
			.filter((w) => w.toLowerCase().replace(/[^a-z0-9\s-_]/g, '') === normalized).length;
		return `_${safePath(slug)}__${normalized}${previousOccurrences > 0 ? '___' + previousOccurrences : ''}`;
	}

	// Simple hash function
	function hashCode(str: string): number {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			hash = (hash << 5) - hash + str.charCodeAt(i);
			hash |= 0;
		}
		return Math.abs(hash);
	}

	// Accent colors (Catppuccin)
	const accentColors = [
		'text-rosewater',
		'text-flamingo',
		'text-pink',
		'text-mauve',
		'text-red',
		'text-maroon',
		'text-peach',
		'text-yellow',
		'text-green',
		'text-teal',
		'text-sky',
		'text-sapphire',
		'text-blue',
		'text-lavender'
	];

	// Grayscale colors (light grays)
	const grayscaleColors = ['text-text', 'text-subtext1', 'text-subtext0', 'text-overlay2'];

	function getColorClass(slug: string, index: number, colored: boolean): string {
		const hash = hashCode(slug + index);
		if (colored) {
			return accentColors[hash % accentColors.length];
		} else {
			return grayscaleColors[hash % grayscaleColors.length];
		}
	}
</script>

<div class="mx-auto max-w-prose px-4 py-8 sm:px-6 lg:px-8">
	<h1 class="text-text mb-8 text-3xl font-bold tracking-tight">Posts</h1>

	{#if data.posts.length}
		<div class="space-y-6">
			{#each data.posts as post}
				{@const titleWords = words(post.metadata.title.text)}
				{@const config = post.metadata.title?.config}
				{@const wordConfigs = config
					? config.split(' ').map((cfg) => ({
							colored: cfg.endsWith('c')
						}))
					: titleWords.map(() => ({ colored: false }))}
				<a href={`/posts/${post.slug}`} class="block">
					<article class="space-y-2">
						<h2 class="text-text hover:text-accent text-xl font-semibold">
							{#each titleWords as word, i}
								<span
									style="view-transition-name: {getViewTransitionName(
										post.slug,
										word,
										i,
										titleWords
									)};"
								>
									{word}{i < titleWords.length - 1 ? ' ' : ''}
								</span>
							{/each}
						</h2>
						{#if post.metadata.published_at}
							<p class="text-subtext0 text-xs">
								{formatDate(post.metadata.published_at)}
							</p>
						{:else}
							<p class="text-subtext0 text-xs italic">Draft</p>
						{/if}
						<p class="text-subtext1 text-sm">
							{post.metadata.description}
						</p>
						<PostTags {post} showIcon={false} colored={false} />
					</article>
				</a>
			{/each}
		</div>
	{:else}
		<p class="text-subtext0">No posts yet.</p>
	{/if}
</div>
