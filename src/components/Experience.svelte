<script lang="ts">
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { IconChevronDown } from '@tabler/icons-svelte';

	type Props = {
		items: ExperienceTimelineItem[];
	};

	let { items }: Props = $props();
	let expandedIndex = $state<number | null>(null);

	function toggleExpand(index: number) {
		expandedIndex = expandedIndex === index ? null : index;
	}

	// Determine if an item is considered 'past' based on endDate
	function isPast(item: ExperienceTimelineItem): boolean {
		return !!item.endDate;
	}
</script>

<div class="space-y-4">
	{#each items as item, i (item.company)}
		{@const past = isPast(item)}
		<div
			class="border-surface0 bg-base relative overflow-hidden rounded-lg border transition-all duration-200 {past
				? 'opacity-70 grayscale hover:opacity-90 hover:grayscale-0'
				: 'shadow-sm hover:shadow-md'}"
		>
			<button
				type="button"
				onclick={() => toggleExpand(i)}
				aria-expanded={expandedIndex === i}
				aria-controls="details-{item.company.replace(/\s+/g, '-')}-{i}"
				class="focus-visible:ring-accent focus-visible:ring-offset-base flex w-full items-center gap-4 p-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 {item.details
					? 'cursor-pointer'
					: 'cursor-default'}"
				disabled={!item.details}
			>
				<!-- Logo -->
				<div
					class="bg-mantle flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md p-1"
				>
					<img
						src={item.logoUrl}
						alt="{item.company} Logo"
						class="h-full w-full object-contain {past ? '' : ''}"
					/>
				</div>

				<!-- Text Content -->
				<div class="flex-1">
					<h3 class="text-text font-semibold">{item.company}</h3>
					<p class="text-subtext0 text-sm">{item.role}</p>
					{#if past}
						<p class="text-overlay0 mt-0.5 text-xs">(Ended {item.endDate})</p>
					{/if}
				</div>

				<!-- Chevron (only if details exist) -->
				{#if item.details}
					<IconChevronDown
						size={20}
						class="text-subtext1 flex-shrink-0 transform transition-transform duration-200 {expandedIndex ===
						i
							? 'rotate-180'
							: ''}"
					/>
				{/if}
			</button>

			<!-- Expandable Details Area -->
			{#if expandedIndex === i && item.details}
				<div
					transition:slide|local={{ duration: 250, easing: quintOut }}
					id="details-{item.company.replace(/\s+/g, '-')}-{i}"
					class="bg-mantle border-surface0 border-t px-4 pt-3 pb-4"
				>
					<div class="text-subtext1 prose prose-sm prose-invert max-w-none leading-relaxed">
						{#each item.details.split('\n') as paragraph (paragraph)}
							<p>{paragraph}</p>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/each}
</div>
