<script lang="ts">
	import {
		IconUser,
		IconBrandGithub,
		IconBrandLinkedin,
		IconMail,
		IconDog,
		IconStar,
		IconRocket,
		IconCode
	} from '@tabler/icons-svelte';
	import Site from '$lib/config/common';
	import AnchorHeader from '$lib/components/AnchorHeader.svelte';

	const handleEmailClick = () => {
		const email = atob('Y29udGFjdEA=') + window.location.hostname;
		window.location.href = `mailto:${email}`;
	};

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

<div class="mx-auto max-w-6xl space-y-8 px-4 py-8 md:px-6">
	<!-- About Me Section -->
	<section class="space-y-6">
		<h1 class="flex items-center gap-3 text-3xl font-bold md:text-4xl">
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
					<b>Hey!</b> I'm Jason Cameron <a class="link" href="/socials">(@JasonLovesDoggo)</a> — a
					Senior Software Engineer at Stan based out of Toronto, Canada. I like to make
					<a href="/projects" class="link">cool projects</a>
					when i'm bored. <!--todo: make toronto canada something cool-->
				</p>

				<p class="text-subtext0 text-base leading-relaxed">
					Some of my more notable projects include {@render GithubProject(
						'RedditVideoMakerBot',
						'https://github.com/elebumm/RedditVideoMakerBot',
						8275
					)}, where I reverse engineered TikTok's TTS API, and
					{@render GithubProject('Anubis', '/projects/anubis', 14732)}, an anti-scraper tool
					currently protecting infrastructure at The Linux Foundation and the UN. My work focuses on
					backend development and system architecture. I maintain several services including
					{@render ExternalLink('https://maclyonsden.com/', 'metropolis')},
					{@render ExternalLink('https://ctf.mcpt.ca', 'mCTF')},
					{@render ExternalLink('https://mcpt.ca', 'MCPT')}, and {@render ExternalLink(
						'https://jasoncameron.dev/foodle/',
						'Foodle'
					)}.
				</p>

				<p class="text-subtext0 text-base leading-relaxed">
					Outside of software, I enjoy playing Ultimate frisbee, <a
						href="/photos"
						class="link"
						target="_blank">photography</a
					>, organizing/participating at/mentoring hackathons and spending time with my dog, Bella (<a
						href="#my-dog-bella"
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

	<!--	&lt;!&ndash; What I'm Working On Section &ndash;&gt;-->
	<!--	<section class="space-y-6">-->
	<!--		<AnchorHeader level="h2" class="flex items-center gap-3 text-2xl font-bold">-->
	<!--			<span>What I'm Working On</span>-->
	<!--		</AnchorHeader>-->

	<!--		<div class="space-y-6">-->
	<!--			<div class="prose prose-sm max-w-none">-->
	<!--				<p class="text-subtext0 text-base leading-relaxed">-->
	<!--					Currently, I'm deep into <span class="text-text font-medium">systems programming with Rust</span>,-->
	<!--					focusing on building performant, memory-safe applications. I've been exploring the intersection of-->
	<!--					low-level control and high-level abstractions, which has been both challenging and rewarding.-->
	<!--					Alongside this, I'm diving into <span class="text-text font-medium">ML/AI engineering</span>,-->
	<!--					particularly working with LLMs and computer vision applications to solve real-world problems.-->
	<!--				</p>-->

	<!--				<p class="text-subtext0 text-base leading-relaxed">-->
	<!--					My main active projects include maintaining <a href="https://github.com/TecharoHQ/anubis" class="link">Anubis</a>,-->
	<!--					the anti-bot defense system that's now protecting major organizations, and continuously improving this portfolio site.-->
	<!--					I'm also contributing to various open-source projects and working on technical writing to share what I've learned-->
	<!--					with the community.-->
	<!--				</p>-->

	<!--				<p class="text-subtext0 text-base leading-relaxed">-->
	<!--					Looking ahead, I'm focused on <span class="text-text font-medium">scaling my impact through open source</span>.-->
	<!--					This means not just contributing code, but also improving documentation, mentoring newcomers, and building tools-->
	<!--					that make developers' lives easier. I believe in the power of well-crafted software and clear communication to-->
	<!--					solve complex problems.-->
	<!--				</p>-->
	<!--			</div>-->
	<!--		</div>-->
	<!--	</section>-->

	<!--	&lt;!&ndash; My Approach Section &ndash;&gt;-->
	<!--	<section class="space-y-6">-->
	<!--		<AnchorHeader level="h2" class="flex items-center gap-3 text-2xl font-bold">-->
	<!--			<span>How I Work</span>-->
	<!--		</AnchorHeader>-->

	<!--		<div class="space-y-6">-->
	<!--			<div class="prose prose-sm max-w-none">-->
	<!--				<p class="text-subtext0 text-base leading-relaxed">-->
	<!--					I'm a strong believer in <span class="text-text font-medium">building in public</span> and sharing knowledge openly.-->
	<!--					Most of my work is open source, from the tools I build to the configurations I use. I think transparency in-->
	<!--					development (not just code) leads to better software and helps others learn from both successes and mistakes.-->
	<!--				</p>-->

	<!--				<p class="text-subtext0 text-base leading-relaxed">-->
	<!--					Beyond writing code, I'm passionate about <span class="text-text font-medium">mentoring and community building</span>.-->
	<!--					I regularly participate in hackathons as both a mentor and organizer, helping the next generation of developers-->
	<!--					find their path. There's something special about seeing someone have that "aha!" moment when a concept clicks.-->
	<!--				</p>-->
	<!--			</div>-->
	<!--		</div>-->
	<!--	</section>-->

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
			<AnchorHeader level="h3" class="mb-5 flex items-center gap-2 text-xl font-semibold">
				<IconDog size={24} class="text-accent" />
				My Dog (Bella!)
			</AnchorHeader>

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
	/* Offset for fixed navbar when navigating to anchors */
	:global(html) {
		scroll-padding-top: 5rem; /* Adjust based on your navbar height */
	}

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
