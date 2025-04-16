<script>
	import { IconPalette } from '@tabler/icons-svelte';
	import { Palette, paletteNames } from '$lib/stores/theme.js';
</script>

<h3 class="text-text mb-4 flex items-center gap-2 text-sm font-semibold">
	<IconPalette size={16} class="text-accent" />
	Theme
</h3>
<div
	class="ring-surface0 mb-4 flex flex-wrap items-center justify-center gap-1 rounded-md p-1 ring-1 md:justify-start"
>
	{#key $Palette}
		{#each paletteNames as name (name)}
			{@const isSelected = $Palette === name}
			<button
				onclick={() => ($Palette = name)}
				class={`flex-1 cursor-pointer rounded-[5px] px-2 py-1 text-center text-xs font-medium transition ${isSelected ? 'bg-base text-text ring-accent/70 shadow-sm ring-1 ring-inset' : 'text-subtext1 hover:text-subtext0'}`}
			>
				{name.charAt(0).toUpperCase() + name.slice(1)}
			</button>
		{/each}
	{/key}
</div>
