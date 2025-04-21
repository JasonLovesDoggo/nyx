<script lang="ts">
	import LinkWithIcon from '$components/LinkWithIcon.svelte';
	import Featured, { type FeaturedProject } from '$components/layout/Featured.svelte';
	import {
		IconArrowRight,
		IconExternalLink,
		IconArticle,
		IconCode,
		IconCalendarEvent,
		IconActivity,
		IconBriefcase,
		IconSchool
	} from '@tabler/icons-svelte';
	import Site from '$lib/config/common';
	import { Home } from '$lib/config/pages';
	import { codingStats, latestCommits, organizations } from '$lib/config/about';
	import ThemeSelector from '$components/themes/ThemeSelector.svelte';
	import ColorSelector from '$components/themes/ColorSelector.svelte';
	import Experience from '$components/Experience.svelte';
	import { getLatestPosts } from '$lib/content/posts';

	type PageData = {
		featuredProjects: FeaturedProject[];
	};

	let { data }: { data: PageData } = $props();
	let isNameHovered = $state(false);
</script>

<div class="mx-auto max-w-6xl space-y-12 px-0 py-8 md:space-y-16 md:px-4 md:py-12">
	<!-- Section 1: Hero / Introduction -->
	<section class="space-y-5 px-4 md:px-0">
		<h1 class="text-3xl font-bold md:text-4xl">
			Hey! I'm
			<span class="text-accent">
				<span
					onmouseenter={() => (isNameHovered = true)}
					onmouseleave={() => (isNameHovered = false)}
					onfocus={() => (isNameHovered = true)}
					onblur={() => (isNameHovered = false)}
					tabindex="0"
					role="button"
					aria-label="Jason Cameron - Hover or focus to see a fun fact"
				>
					<span>Jason</span>
					<span class:hidden={!isNameHovered}>'JSON'</span>
				</span>
				<span>Cameron</span>
			</span>
		</h1>
		<p class="text-subtext0 max-w-prose text-lg leading-relaxed">
			A high school student building and securing web infrastructure. I've written software that is
			trusted by
			<a
				class="hover:text-accent text-accent/85 underline decoration-dashed underline-offset-4"
				href="https://policytoolbox.iiep.unesco.org">The United Nations</a
			>,
			<a
				class="hover:text-accent text-accent/85 underline decoration-dashed underline-offset-4"
				href="https://git.kernel.org">The Linux Foundation</a
			>,
			<a
				class="hover:text-accent text-accent/85 underline decoration-dashed underline-offset-4"
				href="https://www.mozilla.org">Arch Linux</a
			>,
			<a
				class="hover:text-accent text-accent/85 underline decoration-dashed underline-offset-4"
				href="https://gitlab.gnome.org">GNOME</a
			>,
			<a
				class="hover:text-accent text-accent/85 underline decoration-dashed underline-offset-4"
				href="https://bugs.winehq.com">Wine</a
			>,
			<a
				class="hover:text-accent text-accent/85 underline decoration-dashed underline-offset-4"
				href="https://trac.ffmpeg.org">FFmpeg</a
			>
			and many others. My code has been used by
			<b class="text-accent">millions</b> of people worldwide. I focus on
			<b class="text-text">backend systems</b>,
			<b class="text-text">DevOps</b>, and
			<b class="text-text">cybersecurity</b>, especially crafting defenses against automated
			threats. I enjoy leading initiatives and tackling complex technical challenges.
		</p>
		<div class="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
			{#each Home.socialLinks as link (link.href)}
				<LinkWithIcon
					href={link.href}
					text={link.text}
					icon={link.icon}
					external={true}
					class="text-sm"
				/>
				{#if link !== Home.socialLinks[Home.socialLinks.length - 1]}
					<span class="text-surface1 text-xs">|</span>
				{/if}
			{/each}
			<span class="text-surface1 text-xs">|</span>
			<a
				href="/about"
				class="group text-subtext1 hover:text-accent inline-flex items-center gap-1 text-sm transition-colors duration-200"
			>
				<span>More about me</span>
				<IconArrowRight
					size={16}
					class="transition-transform duration-200 group-hover:translate-x-0.5"
				/>
			</a>
		</div>
	</section>

	<!-- Section: Minimal Experience Row -->
	<Experience />

	<!-- Section: Featured Projects -->
	<Featured projects={data.featuredProjects} />

	<!-- Section: Bento Grid Container -->
	<section class="px-4 md:px-0">
		<h2 class="sr-only">Dashboard / Highlights</h2>
		<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
			<!-- Box 2: Theme Selector -->
			<div class="border-surface0 bg-base rounded-xl border p-4 shadow-lg lg:col-span-1">
				<ThemeSelector />
				<ColorSelector />
			</div>

			<!-- Box 3: Latest Blog Posts -->
			<div class="border-surface0 bg-base rounded-xl border p-4 shadow-lg lg:col-span-1">
				<h3 class="text-text mb-3 flex items-center gap-2 text-sm font-semibold">
					<IconArticle size={16} class="text-accent" />
					Latest Posts
				</h3>
				{#if getLatestPosts().length > 0}
					<ul class="space-y-2 text-sm">
						{#each getLatestPosts() as post (post.slug)}
							<li>
								<a
									href={'/posts/' + post.slug}
									class="text-subtext0 hover:text-accent line-clamp-1 hover:underline"
									>{post.metadata.title}</a
								>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="text-subtext1 text-sm italic">No posts yet.</p>
				{/if}
				<a
					href="/posts"
					class="group text-accent mt-3 inline-flex items-center gap-1 text-sm hover:underline"
				>
					<span>All posts</span>
					<IconArrowRight
						size={14}
						class="transition-transform duration-200 group-hover:translate-x-0.5"
					/>
				</a>
			</div>

			<!-- Box 4: Coding Stats -->
			<div class="border-surface0 bg-base rounded-xl border p-4 shadow-lg lg:col-span-1">
				<h3 class="text-text mb-3 flex items-center gap-2 text-sm font-semibold">
					<IconCode size={16} class="text-accent" />
					Coding Stats
				</h3>
				<p class="text-subtext0 text-sm">
					Primary: <span class="text-text font-medium">{codingStats.language}</span>
				</p>
				<p class="text-subtext0 text-sm">
					Hours: <span class="text-text font-medium">{codingStats.hours}</span>
					<span class="text-overlay2 text-xs">(WakaTime)</span>
				</p>
				<a
					href={Site.out.wakatime}
					target="_blank"
					rel="noopener noreferrer"
					class="group text-accent mt-3 inline-flex items-center gap-1 text-sm hover:underline"
				>
					<span>View stats</span>
					<IconExternalLink size={14} class="inline-block" />
				</a>
			</div>

			<!-- Box 5: Book a chat -->
			<div class="border-surface0 bg-base rounded-xl border p-4 shadow-lg lg:col-span-1">
				<h3 class="text-text mb-3 flex items-center gap-2 text-sm font-semibold">
					<IconCalendarEvent size={16} class="text-accent" />
					Let's Connect
				</h3>
				<p class="text-subtext0 mb-4 text-sm">
					Always open to interesting projects and conversations.
				</p>
				<a
					href={Site.out.calcom}
					target="_blank"
					rel="noopener noreferrer"
					class="bg-surface0 text-text hover:bg-accent/80 focus:ring-accent/50 focus:ring-offset-base inline-flex w-full items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:text-base focus:ring-2 focus:ring-offset-2 focus:outline-none"
				>
					<IconCalendarEvent size={16} />
					Book a Chat
				</a>
			</div>

			<!-- Box 6: Latest Commits -->
			<div class="border-surface0 bg-base rounded-xl border p-4 shadow-lg lg:col-span-1">
				<h3 class="text-text mb-3 flex items-center gap-2 text-sm font-semibold">
					<IconActivity size={16} class="text-accent" />
					Recent Commits
				</h3>
				{#if latestCommits.length > 0}
					<ul class="space-y-1.5 text-sm">
						{#each latestCommits as commit (commit.sha)}
							<li>
								<a
									href={commit.href}
									target="_blank"
									rel="noopener noreferrer"
									class="text-subtext0 hover:text-accent block truncate"
									title={`${commit.repo}: ${commit.message}`}
								>
									<span class="text-text font-medium">{commit.repo.split('/')[1]}:</span>
									{commit.message}
								</a>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="text-subtext1 text-sm italic">No recent public commits.</p>
				{/if}
				<a
					href="https://github.com/jasonlovesdoggo"
					target="_blank"
					rel="noopener noreferrer"
					class="group text-accent mt-3 inline-flex items-center gap-1 text-sm hover:underline"
				>
					<span>View GitHub</span>
					<IconExternalLink size={14} class="inline-block" />
				</a>
			</div>

			<!-- Box 7: Roles / Affiliations (Simplified/Redundant?) -->
			<div class="border-surface0 bg-base rounded-xl border p-4 shadow-lg lg:col-span-1">
				<h3 class="text-text mb-3 flex items-center gap-2 text-sm font-semibold">
					<IconBriefcase size={16} class="text-accent" />
					Quick Roles
				</h3>
				<div class="space-y-2 text-sm">
					<div class="text-subtext0 flex items-center gap-2">
						<IconSchool size={18} class="text-sky flex-shrink-0" />
						<span>Student @ High School</span>
					</div>
					{#if organizations.length > 0}
						{#each organizations as org (org.name)}
							{@const OrgIcon = org.icon}
							<div class="text-subtext0 flex items-center gap-2">
								<OrgIcon size={18} class="text-mauve flex-shrink-0" />
								<a
									href={org.href}
									target="_blank"
									rel="noopener noreferrer"
									class="hover:text-accent hover:underline">Leading @ {org.name}</a
								>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		</div>
	</section>
</div>
