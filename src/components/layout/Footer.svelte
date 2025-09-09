<script lang="ts">
	import { PUBLIC_COMMIT_SHA } from '$env/static/public';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import Site from '$lib/config/common';
	import { IconGitCommit, IconClock } from '@tabler/icons-svelte';
	import { persistentWritable } from '$lib/stores/persistance';

	const { value } = $props();

	const year = new Date().getFullYear();
	const shortSha = PUBLIC_COMMIT_SHA ? PUBLIC_COMMIT_SHA.substring(0, 7) : 'dev';
	const commitLinkUrl = PUBLIC_COMMIT_SHA ? `${Site.repo.commitBaseUrl}${PUBLIC_COMMIT_SHA}` : '#';

	// Store the initial visit timestamp
	const visitStartStore = persistentWritable<number>('visit-start', {
		defaultValue: () => Date.now()
	});

	let timeOnSite = $state('00:00');
	let visitStart = $state(0);

	// Subscribe to store
	$effect(() => {
		const unsubscribe = visitStartStore.subscribe((value) => {
			visitStart = value;
		});
		return unsubscribe;
	});

	function formatTime(seconds: number): string {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;

		if (hours > 0) {
			return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
		}
		return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}

	onMount(() => {
		if (browser) {
			// Update timer every second
			const interval = setInterval(() => {
				const elapsed = Math.floor((Date.now() - visitStart) / 1000);
				timeOnSite = formatTime(elapsed);
			}, 1000);

			return () => clearInterval(interval);
		}
	});
</script>

<div class="relative m-auto mx-5 mb-5">
	<!-- Raised webring section that morphs into the footer -->
	<div class="relative">
		<!-- The raised section for the webring -->
		<div
			class="bg-crust border-surface0/20 absolute -top-10 right-5 z-10 flex items-center rounded-t-lg border-t border-r border-l px-4 py-2 shadow-sm md:right-8"
		>
			<div class="text-subtext1 flex items-center gap-x-1 text-xs whitespace-nowrap md:text-sm">
				<span class="text-overlay1">Webrings:</span>
				<a
					href="https://ctp-webr.ing/"
					target="_blank"
					rel="noopener noreferrer"
					class="saturate-[0.5] transition-colors duration-200"
					title="CTP Webring"
				>
					<span class="text-rosewater">c</span><span class="text-green">p</span><span
						class="text-blue">t</span
					>
				</a>
				<span class="text-xs leading-none opacity-75">
					<span class="opacity-40">&lbrace;</span><a
						href="https://ctp-webr.ing/json/previous"
						target="_blank"
						rel="noopener noreferrer"
						class="text-accent hover:text-accent/80 px-0.5 align-top transition-colors duration-200"
						title="Previous site in webring">&lt;</a
					><span class="text-accent opacity-40">|</span><a
						href="https://ctp-webr.ing/json/next"
						target="_blank"
						rel="noopener noreferrer"
						class="text-accent hover:text-accent/80 px-0.5 align-top transition-colors duration-200"
						title="Next site in webring">&gt;</a
					><span class="opacity-40">&rbrace;</span>
				</span>
			</div>
		</div>
	</div>

	<!-- Main footer with smooth connection to the raised section -->
	<footer
		class="bg-crust text-subtext0 border-surface0/20 flex h-auto flex-col items-center justify-center gap-y-3 rounded-lg border p-5 text-sm md:flex-row md:justify-between md:gap-y-0"
	>
		<div class="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 md:justify-start">
			<span class="whitespace-nowrap">© {year} Jason Cameron</span>

			<span class="text-surface0 hidden md:inline">-</span>

			<div class="flex items-center gap-1 whitespace-nowrap" title="Service Status">
				<span class="relative mr-1.5 flex h-3 w-3">
					<span
						class="animate-duration-[2000ms] bg-green/75 absolute inline-flex h-full w-full animate-ping rounded-full"
					></span>
					<span class="bg-green relative inline-flex h-3 w-3 rounded-full"></span>
				</span>
				<span class="text-subtext1 text-sm font-medium">All Services Nominal</span>
			</div>
		</div>

		<div class="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 md:justify-end">
			<div class="flex items-center gap-1.5" title="How long you have been surfing my site">
				<IconClock size={16} class="text-accent" />
				<span class="text-accent font-mono text-sm">{timeOnSite}</span>
			</div>

			<span class="text-surface0 hidden sm:inline">-</span>

			<a
				href="https://abacus.jasoncameron.dev"
				target="_blank"
				rel="noopener noreferrer"
				class="text-subtext1 hover:text-accent transition-colors duration-200"
				title="View Site Analytics"
			>
				{value} views
			</a>

			<span class="text-surface0 hidden sm:inline">-</span>

			{#if PUBLIC_COMMIT_SHA && PUBLIC_COMMIT_SHA !== 'dev'}
				<a
					href={commitLinkUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="text-subtext1 hover:text-accent flex items-center gap-x-1 transition-colors duration-200"
					title="View deployment commit ({PUBLIC_COMMIT_SHA})"
				>
					<IconGitCommit size={18} stroke={1.5} class="flex-shrink-0" />
					<span>{shortSha}</span>
				</a>
			{:else}
				<span class="text-overlay1 flex items-center gap-x-1" title="Development Build">
					<IconGitCommit size={18} stroke={1.5} class="flex-shrink-0" />
					<span>{shortSha}</span>
				</span>
			{/if}

			<span class="text-surface0 hidden sm:inline">-</span>

			<div class="flex items-center gap-x-3">
				{#each Site.socials as item (item.url)}
					{@const Icon = item.icon}
					<a
						href={item.url}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={item.label}
						class="text-subtext1 hover:text-accent transition-colors duration-200"
					>
						<Icon stroke={1.5} />
					</a>
				{/each}
			</div>
		</div>
	</footer>
</div>
