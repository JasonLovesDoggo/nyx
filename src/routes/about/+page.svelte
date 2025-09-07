<script lang="ts">
	import {
		IconUser,
		IconTrophy,
		IconBrandGithub,
		IconBrandLinkedin,
		IconMail,
		IconDog,
		IconArrowRight,
		IconStar,
		IconBriefcase
	} from '@tabler/icons-svelte';
	import { achievements, type AchievementItem } from '$lib/config/about';
	import Site from '$lib/config/common';
	import { experienceTimeline, type ExperienceTimelineItem } from '$lib/config/pages';

	const handleEmailClick = () => {
		const email = atob('Y29udGFjdEA=') + window.location.hostname;
		window.location.href = `mailto:${email}`;
	};

	type Items = AchievementItem[];
	type TimelineItems = ExperienceTimelineItem[];
	type str = string; // my IDE yells at me if i use string in the snippet. :shrug:
	type num = number; // my IDE yells at me if i use string in the snippet. :shrug:
</script>

<svelte:head>
	<title>About Me | Jason Cameron</title>
</svelte:head>

{#snippet ExternalLink(href: str, text: str)}
	<a {href} target="_blank" rel="noopener noreferrer" class="link">
		{text}
	</a>
{/snippet}

{#snippet Listem(items: Items, text: str, Icon: typeof IconTrophy)}
	<div class="bg-base rounded-lg p-5 shadow-sm transition-all duration-300 hover:shadow-md">
		<h3 class="mb-4 flex items-center gap-2 text-xl font-semibold">
			<Icon size={24} class="text-accent" />
			{text}
		</h3>

		<div class="custom-scrollbar max-h-60 space-y-2 overflow-y-auto pl-2 text-sm">
			{#each items as thing (thing)}
				<div
					class="text-subtext0 hover:text-text flex items-start gap-2 transition-colors duration-200"
				>
					<span class="text-accent font-medium">—</span>
					{#if typeof thing === 'string'}
						<span>{thing}</span>
					{:else}
						<a
							href={thing.href}
							target="_blank"
							rel="noopener noreferrer"
							class="hover:text-accent transition-colors"
						>
							<span class="font-medium">{thing.title}</span>
							{#if thing.description}
								<span class="text-subtext0 block text-xs">{thing.description}</span>
							{/if}
						</a>
					{/if}
				</div>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet GithubProject(title: str, href: str, stars: num)}
	<a {href} id={title.toLowerCase()} target="_blank" rel="noopener noreferrer" class="link">
		{title}
	</a>

	<span class="inline-flex items-center space-x-1 text-sm">
		<!--  <CountUp duration={300} value={stars} />-->
		{stars}
		<IconStar class="ml-1" size={14} />
	</span>
{/snippet}

{#snippet ExperienceTimeline(items: TimelineItems, text: str, Icon: typeof IconTrophy)}
	<div class="bg-base rounded-lg p-5 shadow-sm transition-all duration-300 hover:shadow-md">
		<h3 class="mb-4 flex items-center gap-2 text-xl font-semibold">
			<Icon size={24} class="text-accent" />
			{text}
		</h3>

		<div class="custom-scrollbar max-h-60 space-y-4 overflow-y-auto pl-2">
			{#each items as job (job.company + job.startDate)}
				<div class="border-accent border-l-2 pb-4 pl-4">
					<div class="flex items-center gap-2">
						{#if job.logoUrl}
							<img src={job.logoUrl} alt={job.logoAlt} class="h-6 w-6 rounded-sm" />
						{/if}
						<a
							href={job.url}
							target="_blank"
							rel="noopener noreferrer"
							class="hover:text-accent font-medium transition-colors"
						>
							{job.company}
						</a>
					</div>
					<div class="text-subtext0 mt-1 text-sm">
						<div class="font-medium">{job.role}</div>
						<div class="text-xs">
							{new Date(job.startDate).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'short'
							})}
							{#if job.endDate}
								- {new Date(job.endDate).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'short'
								})}
							{:else}
								- Present
							{/if}
						</div>
						{#if job.details}
							<div class="mt-1">{job.details}</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
{/snippet}

<div class="mx-auto max-w-6xl space-y-8 px-4 py-8 md:px-6">
	<!-- About Me Section -->
	<section class="space-y-6">
		<h1 class="flex items-center gap-3 text-3xl font-bold md:text-4xl">
			<IconUser size={36} class="text-accent" />
			<span>About Me</span>
		</h1>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
			<div class="md:col-span-1">
				<img
					src="/images/avatar.webp"
					alt="Jason Cameron"
					class="h-full w-full rounded-md object-cover shadow-lg transition-transform duration-300 hover:scale-[1.02]"
				/>
			</div>

			<div class="space-y-4 md:col-span-2">
				<p class="text-subtext0 text-base leading-relaxed">
					I'm Jason Cameron <a class="link" href="/socials">(@JasonLovesDoggo)</a> — a student and
					programmer with 5+ YoE based out of Toronto, Canada. I like to make
					<a href="/projects" class="link">cool projects</a>
					when i'm bored. <!--todo: make toronto canada something cool-->
				</p>

				<p class="text-subtext0 text-base leading-relaxed">
					Some of my more notable projects are {@render GithubProject(
						'RedditVideoMakerBot',
						'https://github.com/elebumm/RedditVideoMakerBot',
						8250
					)} where I reverse engineered TikTok's TTS API and <!--todo: blogpost!?-->
					{@render GithubProject('Anubis', '/projects/anubis', 12680)}, an anti AI scraper tool
					which is currently being used by organizations such as The Linux Foundation or the UN.
					Most of my work is centered around backend development or system administration. Some
					sites that I run include {@render ExternalLink('https://maclyonsden.com/', 'metropolis')},
					{@render ExternalLink('https://ctf.mcpt.ca', 'mCTF')},
					{@render ExternalLink('https://mcpt.ca', 'MCPT')}, {@render ExternalLink(
						'https://jasoncameron.dev/foodle/',
						'foodle'
					)} as well as a bunch of others.
				</p>

				<p class="text-subtext0 text-base leading-relaxed">
					Outside of software, I enjoy playing Ultimate frisbee, <a
						href="/photos"
						class="link"
						target="_blank">photography</a
					>, organizing/participating at/mentoring hackathons and spending time with my dog, Bella (<a
						href="#bella"
						class="link">see below</a
					>). I also have a passion for exploring the world in general! Feel free to
					<a href={Site.out.calcom} target="_blank" rel="noopener noreferrer" class="link"
						>book a chat</a
					> if you'd like to connect.
				</p>

				<div class="flex flex-wrap gap-3 pt-2">
					<a
						href={Site.out.github}
						target="_blank"
						rel="noopener noreferrer"
						class="hover:text-accent inline-flex items-center gap-1.5 text-sm transition-colors"
					>
						<IconBrandGithub size={16} />
						GitHub
					</a>

					<span class="text-surface1">*</span>

					<a
						href={Site.out.linkedin}
						target="_blank"
						rel="noopener noreferrer"
						class="hover:text-accent inline-flex items-center gap-1.5 text-sm transition-colors"
					>
						<IconBrandLinkedin size={16} />
						LinkedIn
					</a>

					<span class="text-surface1">*</span>
					<span
						role="button"
						aria-label="Send an email to contact"
						class="hover:text-accent inline-flex items-center gap-1.5 text-sm transition-colors"
						tabindex="0"
						onclick={handleEmailClick}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								handleEmailClick();
							}
						}}
					>
						<IconMail size={16} />
						contact[at][thisdomain]
					</span>
				</div>
			</div>
		</div>
	</section>

	<!-- Achievements Section -->
	<section id="achievements-section" class="space-y-6">
		<!-- Achievements list -->
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			{@render Listem(achievements, 'Achievements', IconTrophy)}
			{@render ExperienceTimeline(experienceTimeline, 'Employment History', IconBriefcase)}
		</div>
	</section>

	<!-- Hobbies Section -->
	<section id="hobbies-section" class="space-y-8">
		<!--		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">-->
		<!--			&lt;!&ndash; Ultimate Frisbee &ndash;&gt;-->
		<!--			<div-->
		<!--				class="bg-base rounded-lg p-5 shadow-sm transition-all duration-300 hover:shadow-md"-->
		<!--				style="transition-delay: 0ms;"-->
		<!--			>-->
		<!--				<img-->
		<!--					src="https://placehold.co/600x400?text=Ultimate+Frisbee"-->
		<!--					alt="Ultimate Frisbee"-->
		<!--					class="mb-4 h-48 w-full rounded-md object-cover shadow-sm transition-transform duration-300 hover:scale-[1.02]"-->
		<!--				/>-->
		<!--				<h3 class="mb-3 text-xl font-semibold">Ultimate Frisbee</h3>-->
		<!--				<p class="text-subtext0 leading-relaxed">-->
		<!--					I'm an avid ultimate frisbee player and enjoy both casual games and competitive matches.-->
		<!--					The sport combines athleticism, strategy, and teamwork in a way that I find incredibly-->
		<!--					engaging.-->
		<!--				</p>-->
		<!--			</div>-->

		<!--			&lt;!&ndash; Photography &ndash;&gt;-->
		<!--			<div class="bg-base rounded-lg p-5 shadow-sm transition-all duration-300 hover:shadow-md">-->
		<!--				<img-->
		<!--					src="https://placehold.co/600x400?text=Photography"-->
		<!--					alt="Photography"-->
		<!--					class="mb-4 h-48 w-full rounded-md object-cover shadow-sm transition-transform duration-300 hover:scale-[1.02]"-->
		<!--				/>-->
		<!--				<h3 class="mb-3 text-xl font-semibold">Photography</h3>-->
		<!--				<p class="text-subtext0 mb-3 leading-relaxed">-->
		<!--					I love capturing moments through photography, especially landscapes and street scenes. My-->
		<!--					photos on Google Maps have garnered over 350,000 views, which encourages me to keep-->
		<!--					exploring and sharing my perspective.-->
		<!--				</p>-->
		<!--				<a href="/photos" class="group text-accent inline-flex items-center gap-1 hover:underline">-->
		<!--					View my photo gallery-->
		<!--					<IconArrowRight-->
		<!--						size={14}-->
		<!--						class="transition-transform duration-200 group-hover:translate-x-0.5"-->
		<!--					/>-->
		<!--				</a>-->
		<!--			</div>-->
		<!--		</div>-->

		<!-- My Dog -->
		<div class="bg-base rounded-lg p-6 shadow-sm transition-all duration-300 hover:shadow-md">
			<h3 id="bella" class="mb-5 flex items-center gap-2 text-xl font-semibold">
				<IconDog size={24} class="text-accent" />
				My Dog (Bella!)
			</h3>

			<div class="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
				<img
					src="/images/bella/bella-autumn-2022.webp"
					alt="A landscape of Bella in the autumn by a pond"
					class="h-40 w-full rounded-md object-cover shadow-sm transition-transform duration-300 hover:scale-[1.03]"
				/>
				<img
					src="/images/bella/bella-portrait-2022.webp"
					alt="Portrait of Bella taken playing with a tennis ball"
					class="h-40 w-full rounded-md object-cover shadow-sm transition-transform duration-300 hover:scale-[1.03]"
				/>
				<img
					src="/images/bella/bella-portrait-2024.webp"
					alt="Landscape of Bella lying next to a stick looking at the sky"
					class="h-40 w-full rounded-md object-cover shadow-sm transition-transform duration-300 hover:scale-[1.03]"
				/>
			</div>

			<p class="text-subtext0 leading-relaxed">
				Bella is a <span class="font-medium">4-year-old</span> goldendoodle who loves to play with
				her soccer ball, go on walks/runs and explore <b>everything</b>. Whenever we go on a walk we
				both know we have an adventure ahead of us. <!--todo make auto-->
			</p>
		</div>
	</section>
</div>

<style>
	/* Custom scrollbar */
	.custom-scrollbar::-webkit-scrollbar {
		width: 6px;
	}

	.custom-scrollbar::-webkit-scrollbar-track {
		background: rgba(0, 0, 0, 0.05);
		border-radius: 10px;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: var(--color-accent);
		border-radius: 10px;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: var(--color-accent-hover);
	}
</style>
