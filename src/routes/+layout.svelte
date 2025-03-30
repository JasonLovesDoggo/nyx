<!-- .\routes\+layout.svelte -->
<script lang="ts">
	import '../app.css';
	import Header from '../components/layout/Header.svelte';
	import Footer from '../components/layout/Footer.svelte';
	import Sidebar from '../components/layout/Sidebar.svelte'; // Import the new sidebar
	import { page } from '$app/state';
	import Site from '$lib/config';
	import { Accent, getCssVarName } from '$lib/stores/theme';
	import { browser } from '$app/environment';

	const { data, children } = $props();

	let title = $derived(
		[Site.name, ...page.url.pathname.split('/').slice(1)].filter(Boolean).join(' - ')
	);

	// State for sidebar visibility
	let isSidebarOpen = $state(false);

	function toggleSidebar() {
		isSidebarOpen = !isSidebarOpen;
	}

	function closeSidebar() {
		isSidebarOpen = false;
	}

	$effect(() => {
		if (browser) {
			const accentVarName = getCssVarName($Accent);
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

<div class="bg-base text-text mx-auto flex min-h-screen flex-col">
	<Header {toggleSidebar} />

	<!-- Sidebar component included and props passed -->
	<Sidebar isOpen={isSidebarOpen} {closeSidebar} />

	<main class="flex-1 px-5 py-8">
		{@render children?.()}
	</main>

	<Footer value={data.footerData.value} />
</div>