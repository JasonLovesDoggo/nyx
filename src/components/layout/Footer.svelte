<script lang="ts">
	import { PUBLIC_COMMIT_SHA } from '$env/static/public';

	import Site from '$lib/config/common';
	import { IconGitCommit } from '@tabler/icons-svelte';

	const { value } = $props();

	const year = new Date().getFullYear();
	const shortSha = PUBLIC_COMMIT_SHA ? PUBLIC_COMMIT_SHA.substring(0, 7) : 'dev';
	const commitLinkUrl = PUBLIC_COMMIT_SHA ? `${Site.repo.commitBaseUrl}${PUBLIC_COMMIT_SHA}` : '#';
</script>

<footer
	class="bg-crust text-subtext0 m-auto mx-5 mb-5 flex h-auto flex-col items-center justify-center gap-y-3 rounded-lg p-5 text-sm md:flex-row md:justify-between md:gap-y-0"
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
