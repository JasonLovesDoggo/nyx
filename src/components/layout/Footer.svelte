<script lang="ts">
	import Site from '$lib/config';
	import { PUBLIC_COMMIT_SHA } from '$env/static/public';
	import {
		IconBrandBluesky,
		IconBrandGithub,
		IconBrandInstagram,
		IconBrandLinkedin,
		IconGitCommit
	} from '@tabler/icons-svelte';

	const { value } = $props();

	const ViewCount = $derived(value.toLocaleString());

	const year = new Date().getFullYear();
	const commitSha = PUBLIC_COMMIT_SHA;
	const shortSha = commitSha ? commitSha.substring(0, 7) : 'dev';
	const commitLinkUrl = commitSha ? `${Site.repo.commitBaseUrl}${commitSha}` : '#';

	const socialIconLinks = [
		{ href: Site.socials.github, label: 'GitHub Profile', Icon: IconBrandGithub, hover: 'hover:text-mauve' },
		{ href: Site.socials.linkedin, label: 'LinkedIn Profile', Icon: IconBrandLinkedin, hover: 'hover:text-blue' },
		{ href: Site.socials.bluesky, label: 'Bluesky Profile', Icon: IconBrandBluesky, hover: 'hover:text-sky' },
		{ href: Site.socials.instagram, label: 'Instagram Profile', Icon: IconBrandInstagram, hover: 'hover:text-pink' }
	];

</script>

<footer
	class="flex flex-wrap items-center justify-between gap-y-3 h-auto m-auto mb-5 p-5 bg-crust rounded-lg mx-5 text-sm text-subtext0">

	<div class="flex flex-wrap items-center gap-x-3 gap-y-2">
		<span class="whitespace-nowrap">© {year} Jason Cameron</span>

		<span class="text-surface0 hidden md:inline">-</span>

		<div class="flex items-center gap-1 whitespace-nowrap" title="Service Status">
			<span class="relative flex h-3 w-3 mr-1.5">
				<span
					class="animate-ping animate-duration-[2000ms] absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
				<span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
			</span>
			<span class="text-sm font-medium text-subtext1">All Services Nominal</span>
		</div>
	</div>

	<!-- Central Separator: Only shown between groups on larger screens -->
	<span class="text-surface0 flex-shrink-0 hidden lg:inline">-</span>

	<div class="flex flex-wrap items-center justify-end gap-x-3 gap-y-2">
		<a
			href="https://abacus.jasoncameron.dev"
			target="_blank"
			rel="noopener noreferrer"
			class="text-subtext1 hover:text-sky transition-colors duration-200"
			title="View Site Analytics"
		>
			{ViewCount} views
		</a>

		<span class="text-surface0 hidden sm:inline">-</span>

		{#if commitSha && commitSha !== 'dev'}
			<a
				href={commitLinkUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="flex items-center gap-x-1 text-subtext1 hover:text-mauve transition-colors duration-200"
				title="View deployment commit ({commitSha})"
			>
				<IconGitCommit size={18} stroke={1.5} class="flex-shrink-0" />
				<span>{shortSha}</span>
			</a>
		{:else}
			<span class="flex items-center gap-x-1 text-overlay1" title="Development Build">
				<IconGitCommit size={18} stroke={1.5} class="flex-shrink-0" />
				<span>{shortSha}</span>
			</span>
		{/if}

		<span class="text-surface0 hidden sm:inline">-</span>

		<div class="flex items-center gap-x-3">
			{#each socialIconLinks as item (item.href)}
				{@const Icon = item.Icon}
				<a
					href={item.href}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={item.label}
					class="text-subtext1 {item.hover} transition-colors duration-200"
				>
					<Icon stroke={1.5} />
				</a>
			{/each}
		</div>
	</div>

</footer>