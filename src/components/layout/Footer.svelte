<script lang="ts">
	import Site from '$lib/config';
	import {
		IconBrandBluesky,
		IconBrandGithub,
		IconBrandInstagram,
		IconBrandLinkedin,
		IconGitCommit
	} from '@tabler/icons-svelte';

	const { value, commitSha } = $props();

	const ViewCount = $derived(value.toLocaleString());

	const year = new Date().getFullYear();
	const shortSha = commitSha ? commitSha.substring(0, 7) : 'dev';
	const commitLinkUrl = commitSha ? `${Site.repo.commitBaseUrl}${commitSha}` : '#';

	const socialIconLinks = [
		{
			href: Site.socials.github,
			label: 'GitHub Profile',
			Icon: IconBrandGithub,
			hover: 'hover:text-mauve'
		},
		{
			href: Site.socials.linkedin,
			label: 'LinkedIn Profile',
			Icon: IconBrandLinkedin,
			hover: 'hover:text-blue'
		},
		{
			href: Site.socials.bluesky,
			label: 'Bluesky Profile',
			Icon: IconBrandBluesky,
			hover: 'hover:text-sky'
		},
		{
			href: Site.socials.instagram,
			label: 'Instagram Profile',
			Icon: IconBrandInstagram,
			hover: 'hover:text-pink'
		}
	];
</script>

<footer
	class="bg-crust text-subtext0 m-auto mx-5 mb-5 flex h-auto flex-wrap items-center justify-between gap-y-3 rounded-lg p-5 text-sm"
>
	<div class="flex flex-wrap items-center gap-x-3 gap-y-2">
		<span class="whitespace-nowrap">© {year} Jason Cameron</span>

		<span class="text-surface0 hidden md:inline">-</span>

		<div class="flex items-center gap-1 whitespace-nowrap" title="Service Status">
			<span class="relative mr-1.5 flex h-3 w-3">
				<span
					class="animate-duration-[2000ms] absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"
				></span>
				<span class="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
			</span>
			<span class="text-subtext1 text-sm font-medium">All Services Nominal</span>
		</div>
	</div>

	<!-- Central Separator: Only shown between groups on larger screens -->
	<span class="text-surface0 hidden flex-shrink-0 lg:inline">-</span>

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
				class="text-subtext1 hover:text-mauve flex items-center gap-x-1 transition-colors duration-200"
				title="View deployment commit ({commitSha})"
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
