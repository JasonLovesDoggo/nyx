<script lang="ts">
	import  Site  from '$lib/config';
	import { PUBLIC_COMMIT_SHA } from '$env/static/public';

	import {
		IconBrandBluesky,
		IconBrandGithub,
		IconBrandInstagram,
		IconBrandLinkedin,
		IconGitCommit
	} from '@tabler/icons-svelte';

	export let value: number | string;

	const year = new Date().getFullYear();
	const commitSha = PUBLIC_COMMIT_SHA;
	const shortSha = commitSha ? commitSha.substring(0, 7) : 'dev';
	const commitUrl = commitSha ? `${Site.repo.commitBaseUrl}${commitSha}` : '#';

	// Define social links data structure
	const socialLinks = [
		{ href: Site.socials.github, label: 'GitHub Profile', Icon: IconBrandGithub, hover: 'hover:text-mauve' },
		{ href: Site.socials.linkedin, label: 'LinkedIn Profile', Icon: IconBrandLinkedin, hover: 'hover:text-blue' },
		{ href: Site.socials.instagram, label: 'Instagram Profile', Icon: IconBrandInstagram, hover: 'hover:text-pink' },
		{ href: Site.socials.bluesky, label: 'Bluesky Profile', Icon: IconBrandBluesky, hover: 'hover:text-sky' } // Placeholder icon
	];

</script>

<footer class="flex flex-wrap items-center justify-center gap-y-3 gap-x-6 md:h-16 h-auto m-auto mb-5 p-5 bg-crust rounded-lg mx-5 text-sm text-subtext0">

	<!-- Item 1: Copyright -->
	<span class="whitespace-nowrap">© {year} Jason Cameron</span>

	<!-- Item 2: Service Status -->
	<div class="flex items-center whitespace-nowrap" title="Service Status">
		<span class="relative flex h-3 w-3 mr-1.5">
			<span class="animate-ping animate-duration-[2000ms] absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
			<span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
		</span>
		<span class="text-sm font-medium text-subtext1">All Services Nominal</span>
	</div>

	<!-- Item 3: Views -->
	<a
		href={Site.abacusUrl}
		target="_blank"
		rel="noopener noreferrer"
		class="text-subtext1 hover:text-sky transition-colors duration-200"
		title="View Site Analytics"
	>
		{value} views
	</a>

	<!-- Item 4: Commit -->
	{#if commitSha && commitSha !== 'dev'}
		<a
			href={commitUrl}
			target="_blank"
			rel="noopener noreferrer"
			class="flex items-center gap-x-1 text-subtext1 hover:text-mauve transition-colors duration-200"
			title="View deployment commit ({commitSha})"
		>
			<IconGitCommit size={14} class="flex-shrink-0"/>
			<span>{shortSha}</span>
		</a>
	{:else}
		<span class="flex items-center gap-x-1 text-overlay1" title="Development Build">
			<IconGitCommit size={14} class="flex-shrink-0"/>
			<span>{shortSha}</span>
		</span>
	{/if}

	<!-- Item 5: Social Icons Group with Single Border -->
	<div class="flex items-center gap-x-3 border border-mantle rounded px-2 py-1.5">
		{#each socialLinks as social}
			<a
				href={social.href}
				target="_blank"
				rel="noopener noreferrer"
				aria-label={social.label}
				class="text-subtext1 {social.hover} transition-colors duration-200"
			>
				<svelte:component this={social.Icon} size={18} />
			</a>
		{/each}
	</div>

</footer>

<style>
    /* Minimal custom styles if needed */
</style>