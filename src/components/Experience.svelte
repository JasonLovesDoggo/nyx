<script lang="ts">
	import { experienceTimeline } from '$lib/config/pages.js';

	// Helper to check if past based on endDate
	function isPast(item: (typeof experienceTimeline)[number]): boolean {
		return !!item.endDate;
	}
</script>

<section class="px-4 md:px-0">
	<div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 md:justify-start">
		{#each experienceTimeline as item, i (item.company)}
			{@const past = isPast(item)}
			<a
				href={item.url}
				target="_blank"
				rel="noopener noreferrer"
				class="group flex items-center gap-2 text-sm transition-opacity duration-200 {past
					? 'opacity-60 hover:opacity-80' /* Dim past items slightly */
					: 'hover:opacity-80'}"
				title={past
					? `${item.role} @ ${item.company} (Ended ${item.endDate})`
					: `${item.role} @ ${item.company}`}
			>
				<img src={item.logoUrl} alt="" class="max-h-6 w-auto object-contain" />
				<span class="text-subtext1 group-hover:text-text">
					<span class={past ? '' : 'text-text font-medium'}>{item.company}</span>
					{#if past}
						<span class="text-overlay0 text-xs"> (Past)</span>
					{/if}
				</span>
			</a>
			{#if i < experienceTimeline.length - 1}
				<span class="text-accent hidden md:inline">/</span>
			{/if}
		{/each}
	</div>
</section>
