<script>
	import { Accent, accentColorNames, BackgroundEnabled } from '$lib/stores/theme';

	$: selectedIndex = accentColorNames.indexOf($Accent);
	$: row = Math.floor(selectedIndex / 7);
	$: col = selectedIndex % 7;
</script>

<div class="relative grid grid-cols-7 gap-2.5 md:gap-1.5">
	{#each accentColorNames as colorName, i}
		{@const isSelected = $Accent === colorName}
		<button
			aria-label={`Select ${colorName} accent color`}
			title={colorName.charAt(0).toUpperCase() + colorName.slice(1)}
			onclick={() => ($Accent = colorName)}
			style:background-color={`var(--color-${colorName})`}
			class={`aspect-square min-h-5 w-full min-w-5 cursor-pointer rounded-md shadow-sm transition-all duration-150 ${isSelected ? 'scale-105' : 'opacity-80 hover:scale-110 hover:opacity-100'}`}
		>
			<span class="sr-only">{colorName}</span>
		</button>
	{/each}

	<!-- animated ring -->
	<div
		class="ring-offset-base pointer-events-none absolute aspect-square min-h-5 min-w-5 rounded-md ring-2 ring-offset-2 transition-all duration-300 ease-out"
		style="
			transform: translate(calc({col} * (100% + 0.625rem)), calc({row} * (100% + 0.625rem)));
			width: calc((100% - 6 * 0.625rem) / 7);
			color: var(--color-{$Accent});
			--tw-ring-color: currentColor;
		"
	></div>
</div>

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
