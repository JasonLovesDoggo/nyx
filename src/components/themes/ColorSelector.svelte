<script>
	import { Accent, accentColorNames, BackgroundEnabled } from '$lib/stores/theme';
</script>

<div class="grid grid-cols-7 gap-2.5 md:gap-1.5">
	{#key $Accent}
		{#each accentColorNames as colorName (colorName)}
			{@const isSelected = $Accent === colorName}
			<button
				aria-label={`Select ${colorName} accent color`}
				title={colorName.charAt(0).toUpperCase() + colorName.slice(1)}
				onclick={() => ($Accent = colorName)}
				style:background-color={`var(--color-${colorName})`}
				style:color={`var(--color-${colorName})`}
				class={`aspect-square min-h-5 w-full min-w-5 cursor-pointer rounded-md shadow-sm transition-all duration-150 ${isSelected ? 'ring-offset-base scale-105 ring-2 ring-current ring-offset-2' : 'opacity-80 hover:scale-110 hover:opacity-100'}`}
			>
				<span class="sr-only">{colorName}</span>
			</button>
		{/each}
	{/key}
</div>

<!-- Grayscale/Color toggle checkbox placed separately below the grid -->
<div class="mt-4 flex items-center">
	<label class="flex cursor-pointer items-center">
		<input
			type="checkbox"
			bind:checked={$BackgroundEnabled}
			class="form-checkbox h-4 w-4 rounded text-current"
			aria-label="Toggle the colorful background on/off"
		/>
		<span class="text-subtext0 ml-2 text-sm"
			>Background effect: <span class="text-accent">{$BackgroundEnabled ? 'on' : 'off'}</span></span
		>
	</label>
</div>
