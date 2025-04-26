<script lang="ts">
	import type { ProjectEntry } from '$types/projects';
	import { getRandomAccentColor } from '$lib/stores/theme';
	import { IconTag } from '@tabler/icons-svelte';

	export let project: ProjectEntry;

	// Assign a random color to each tag
	const tagColors =
		project.metadata.tags?.reduce(
			(acc, tag) => {
				acc[tag] = getRandomAccentColor();
				return acc;
			},
			{} as Record<string, string>
		) || {};
</script>

{#if project.metadata.tags && project.metadata.tags.length > 0}
	<div class="flex max-h-8 flex-wrap gap-2 overflow-hidden pt-2 text-xs">
		<IconTag size={18} />

		{#each project.metadata.tags as tag (project.slug + tag)}
			<span
				class="tag bg-surface0 rounded px-2 py-1 font-semibold"
				style="color: var(--color-{tagColors[tag]})"
			>
				{tag}
			</span>
		{/each}
	</div>
{/if}
