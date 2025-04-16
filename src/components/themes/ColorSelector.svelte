<script>
	import { Accent, accentColorNames } from '$lib/stores/theme.js';
</script>

<div class="grid grid-cols-7 gap-2.5">
	{#key $Accent}
		{#each accentColorNames as colorName (colorName)}
			{@const isSelected = $Accent === colorName}
			<button
				aria-label={`Select ${colorName} accent color`}
				title={colorName.charAt(0).toUpperCase() + colorName.slice(1)}
				onclick={() => ($Accent = colorName)}
				style:background-color={`var(--color-${colorName})`}
				style:color={`var(--color-${colorName})`}
				class={`aspect-square min-h-5 w-full min-w-5 rounded-md shadow-sm transition-all duration-150 ${isSelected ? 'ring-offset-base scale-105 ring-2 ring-current ring-offset-2' : 'opacity-80 hover:scale-110 hover:opacity-100'}`}
			>
				<span class="sr-only">{colorName}</span>
			</button>
		{/each}
	{/key}
</div>
