<script lang="ts">
	import '../app.css';
	import Header from '../components/layout/Header.svelte';
	import Footer from '../components/layout/Footer.svelte';
	import Sidebar from '../components/layout/Sidebar.svelte';
	import { page } from '$app/state';
	import Site from '$lib/config/common';

	const { data, children } = $props();

	let title = $derived(
		[Site.name, ...page.url.pathname.split('/').slice(1)].filter(Boolean).join(' - ')
	);

	let isSidebarOpen = $state(false);
	function toggleSidebar() {
		isSidebarOpen = !isSidebarOpen;
	}
	function closeSidebar() {
		isSidebarOpen = false;
	}
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={Site.description} />
</svelte:head>

<div class="text-text mx-auto flex min-h-screen max-w-[90%] flex-col md:max-w-[80%]">
	<Header {toggleSidebar} />
	<Sidebar isOpen={isSidebarOpen} {closeSidebar} />
	<main class="flex-1 px-0 py-8 md:px-5">
		{@render children?.()}
	</main>
	<Footer value={data.footerData.value} />
</div>
