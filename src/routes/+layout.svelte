<script lang="ts">
	import '../app.css';
	import Header from '../components/layout/Header.svelte';
	import Footer from '../components/layout/Footer.svelte';
	import { page } from '$app/state';
	import Site from '$lib/config';

	const { data, children } = $props();

	let title = $state(Site.name);
	$effect(() => {
		title = [Site.name, ...page.url.pathname.split('/').slice(1)].filter(Boolean).join(' - ');
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
	<Footer value={data.footerData.value} commitSha={data.cfCommitSha} />
</div>
