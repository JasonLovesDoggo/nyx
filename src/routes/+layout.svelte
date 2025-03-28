<script lang="ts">
	import "../app.css";
	import Header from "../components/layout/Header.svelte";
	import Footer from "../components/layout/Footer.svelte";
	import { page } from "$app/state";
	import { site } from '$lib/config/site';

	const {data, children} = $props()

	let title = $state(site.name)
	$effect(() => {
		title = [site.name, ...page.url.pathname.split("/").slice(1)].filter(Boolean).join(" - ")}
	);
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>


<div class="flex min-h-screen flex-col bg-base text-text">
	<Header />
	<main class="flex-1">
		{@render children?.()}
	</main>
	<Footer value={data.footerData.value} />
</div>