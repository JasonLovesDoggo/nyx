<script lang="ts">
	import LinkWithIcon from '$components/LinkWithIcon.svelte';
	import Featured, { type FeaturedProject } from '$components/layout/Featured.svelte';
	import {
		IconArrowRight,
		IconExternalLink,
		IconArticle,
		IconCode,
		IconCalendarEvent,
		IconActivity
	} from '@tabler/icons-svelte';
	import Site from '$lib/config/common';
	import { Home } from '$lib/config/pages';
	import { codingStats, latestCommits } from '$lib/config/about';
	import ThemeSelector from '$components/themes/ThemeSelector.svelte';
	import ColorSelector from '$components/themes/ColorSelector.svelte';
	import Experience from '$components/Experience.svelte';
	import { getLatestPosts } from '$lib/content/posts';
	import { formatDate } from '$utils/date';

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
				<span>
					<span>J</span><span
						class="decoration-accent/30 underline decoration-dashed opacity-70"
						onmouseenter={() => (isNameHovered = true)}
						onmouseleave={() => (isNameHovered = false)}
						onfocus={() => (isNameHovered = true)}
						onblur={() => (isNameHovered = false)}
						tabindex="0"
						role="button"
						aria-label="Jason Cameron - Hover or focus to see a fun fact">a</span
					><span>son</span>
					<span class:hidden={!isNameHovered}>'JSON'</span>
				</span>
				<span>Cameron</span>
			</span>
		</h1>
		<p class="text-subtext0 max-w-prose text-lg leading-relaxed">
			A high school student building and securing web infrastructure. I've written software that is
			trusted by
			<a
				class="link text-accent/85"
				target="_blank"
				rel="noopener"
				href="https://policytoolbox.iiep.unesco.org">The United Nations</a
			>,
			<a class="link text-accent/85" target="_blank" rel="noopener" href="https://git.kernel.org"
				>The Linux Foundation</a
			>,
			<a
				class="link text-accent/85"
				target="_blank"
				rel="noopener"
				href="https://wiki.archlinux.org">Arch Linux</a
			>,
			<a class="link text-accent/85" target="_blank" rel="noopener" href="https://gitlab.gnome.org"
				>GNOME</a
			>,
			<a class="link text-accent/85" target="_blank" rel="noopener" href="https://bugs.winehq.com"
				>Wine</a
			>,
			<a class="link text-accent/85" target="_blank" rel="noopener" href="https://trac.ffmpeg.org"
				>FFmpeg</a
			>
			and many others. My code is used by
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
		<div class="grid grid-cols-1 justify-center gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
			<!-- Box 2: Theme Selector -->
			<div
				class="border-surface0 bg-base rounded-xl border p-4 shadow-lg sm:col-span-2 xl:col-span-1"
			>
				<ThemeSelector />
				<ColorSelector />
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
					class="group text-accent link mt-3 inline-flex items-center gap-1 text-sm"
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
			<div class="border-surface0 bg-base rounded-xl border p-4 shadow-lg md:col-span-2">
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
					<span>View on GitHub</span>
					<IconExternalLink
						size={14}
						class="inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
					/>
				</a>
			</div>

			<!-- Box 6: Latest Posts -->
			<div
				class="border-surface0 bg-base rounded-xl border p-4 shadow-lg sm:col-span-2 @xs:col-span-2"
			>
				<div class="text-text mb-3 flex items-center justify-between gap-2 text-sm">
					<h3 class="flex items-center gap-2 font-semibold">
						<IconArticle size={14} class="text-accent" />
						<span>Latest Posts</span>
					</h3>
					<a
						href="/posts"
						aria-label="View all posts"
						class=" text-accent/80 transition-transform duration-500 ease-in hover:translate-x-0.5 hover:-translate-y-0.5"
					>
						<IconExternalLink size={18} />
					</a>
				</div>

				{#if getLatestPosts().length > 0}
					<ul class="list-none space-y-2">
						{#each getLatestPosts() as post (post.slug)}
							<li>
								<a
									href={'/posts/' + post.slug}
									class="text-subtext0 hover:text-accent flex items-baseline gap-2 text-sm"
								>
									<span class="flex-shrink-0 truncate" style="max-width: calc(100% - 10em);">
										{post.metadata.title}
									</span>

									<span class="border-surface1 mx-1 flex-grow self-center border-b border-dotted"
									></span>

									{#if post.metadata.published_at}
										<span class="text-subtext1 flex-shrink-0 whitespace-nowrap">
											{formatDate(post.metadata.published_at)}
										</span>
									{/if}
								</a>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="text-subtext1 text-xs italic">No posts yet.</p>
				{/if}
			</div>
		</div>
	</section>
</div>
