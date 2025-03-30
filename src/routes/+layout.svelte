<script lang="ts">
	import '../app.css';
	import Header from '../components/layout/Header.svelte';
	import Footer from '../components/layout/Footer.svelte';
	import { page } from '$app/state';
	import Site from '$lib/config';
	import { Accent, accentColorNames, getCssVarName } from '$lib/stores/theme';
	import { browser } from '$app/environment';

	const { data, children } = $props();

	let title = $derived(
		[Site.name, ...page.url.pathname.split('/').slice(1)].filter(Boolean).join(' - ')
	);

	$effect(() => {
		if (browser) {
			const accentVarName = getCssVarName($Accent);
			console.log(`Setting :root --current-accent-color to var(${accentVarName})`);
			document.documentElement.style.setProperty(
				'--current-accent-color',
				`var(${accentVarName})`
			);
		}
	});

</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class="bg-base text-text mx-auto flex min-h-screen max-w-[70%] flex-col">
	<Header />
	<main class="flex-1">
		{@render children?.()}
	</main>
	<Footer value={data.footerData.value} />

	<!-- Accent Selector UI -->
	<div class="fixed bottom-4 right-4 bg-mantle p-2 rounded shadow-lg border border-surface0 z-50">
		<label for="accent-selector" class="text-xs text-subtext1 mr-1">Accent:</label>
		<select id="accent-selector" class="bg-surface0 text-sm rounded p-0.5" bind:value={$Accent}>
			{#each accentColorNames as colorName (colorName)}
				<option value={colorName}>{colorName}</option>
			{/each}
		</select>
	</div>
</div>
