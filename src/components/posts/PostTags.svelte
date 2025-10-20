<script lang="ts">
	import type { PostEntry } from '$lib/content/posts';
	import { accentColorNames } from '$lib/stores/theme';
	import { IconTag } from '@tabler/icons-svelte';

	interface Props {
		post: PostEntry;
		showIcon?: boolean;
		colored?: boolean;
	}

	let { post, showIcon = true, colored = true }: Props = $props();

	// Simple hash function
	function hashCode(str: string): number {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			hash = (hash << 5) - hash + str.charCodeAt(i);
			hash |= 0;
		}
		return Math.abs(hash);
	}

	// Assign hash-based color to each tag
	const colorHash = post.metadata.title?.hash || post.slug;
	const tagColors =
		post.metadata.tags?.reduce(
			(acc, tag, index) => {
				const hash = hashCode(colorHash + tag);
				acc[tag] = accentColorNames[hash % accentColorNames.length];
				return acc;
			},
			{} as Record<string, string>
		) || {};
</script>

{#if post.metadata.tags && post.metadata.tags.length > 0}
	<div class="flex max-h-8 flex-wrap gap-2 overflow-hidden pt-2 text-xs">
		{#if showIcon}
			<IconTag size={18} />
		{/if}

		{#each post.metadata.tags as tag (post.slug + tag)}
			<span
				class="tag bg-surface0 rounded px-2 py-1 font-semibold"
				class:text-subtext0={!colored}
				style={colored ? `color: var(--color-${tagColors[tag]});` : ''}
			>
				{tag}
			</span>
		{/each}
	</div>
{/if}
