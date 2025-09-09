<script lang="ts">
	import { onMount } from 'svelte';
	import { IconMapPin } from '@tabler/icons-svelte';
	import { browser } from '$app/environment';

	let mapContainer = $state<HTMLDivElement>();
	let leafletLoaded = $state(false);
	let mapInstance: any = null;

	onMount(async () => {
		if (browser && mapContainer) {
			const L = (await import('leaflet')).default;
			await import('leaflet/dist/leaflet.css');
			mapInstance = L.map(mapContainer, {
				zoomControl: false,
				attributionControl: false,
				dragging: true,
				scrollWheelZoom: true,
				doubleClickZoom: true,
				boxZoom: true,
				keyboard: true,
				touchZoom: true
			}).setView([43.6532, -79.3832], 11);

			L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
				maxZoom: 19,
				attribution: '',
				keepBuffer: 4,
				updateWhenIdle: false,
				updateWhenZooming: false
			}).addTo(mapInstance);

			leafletLoaded = true;
		}
	});

	function recenterMap() {
		if (mapInstance) {
			mapInstance.setView([43.6532, -79.3832], 11);
		}
	}
</script>

<div class="border-surface0 bg-base rounded-xl border p-4 shadow-lg lg:col-span-1">
	<button
		onclick={recenterMap}
		class="text-text hover:text-accent mb-3 flex w-full cursor-pointer items-center gap-2 text-left text-sm font-semibold transition-colors"
	>
		<IconMapPin size={16} class="text-accent" />
		Currently Based In 📍
	</button>
	<div class="bg-surface0 relative h-32 w-full overflow-hidden rounded-lg">
		{#if browser}
			<div bind:this={mapContainer} class="bg-surface0 h-full w-full"></div>
			{#if !leafletLoaded}
				<div class="bg-surface0 absolute inset-0 flex items-center justify-center">
					<span class="text-subtext1 text-xs">Loading map...</span>
				</div>
			{/if}
		{:else}
			<div class="absolute inset-0 flex items-center justify-center">
				<span class="text-subtext1 text-xs">Loading map...</span>
			</div>
		{/if}
	</div>
	<button
		onclick={recenterMap}
		class="text-subtext0 hover:text-accent mt-2 cursor-pointer text-xs transition-colors"
	>
		Toronto, Ontario, Canada
	</button>
</div>

<style>
	:global(.leaflet-container) {
		background: var(--color-base) !important;
	}

	:global(.leaflet-tile-container) {
		background: var(--color-base) !important;
	}

	:global(.leaflet-pane) {
		background: var(--color-base) !important;
	}
</style>
