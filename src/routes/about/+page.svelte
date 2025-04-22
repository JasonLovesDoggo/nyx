<script lang="ts">
	import { onMount } from 'svelte';
	import {
		IconUser,
		IconTrophy,
		IconBrandGithub,
		IconBrandLinkedin,
		IconMail,
		IconBriefcase,
		IconSchool,
		IconHeart,
		IconDog,
		IconArrowRight
	} from '@tabler/icons-svelte';
	import { professionalAchievements, academicAchievements } from '$lib/config/about';
	import Site from '$lib/config/common';

	// Counter animation for Google Maps views
	let mapViewCount = 0;
	const targetMapViews = 350000;

	onMount(() => {
		// Animate map view counter
		const duration = 2000; // 2 seconds
		const interval = 10; // Update every 10ms
		const steps = duration / interval;
		const increment = targetMapViews / steps;

		const counter = setInterval(() => {
			mapViewCount += increment;
			if (mapViewCount >= targetMapViews) {
				mapViewCount = targetMapViews;
				clearInterval(counter);
			}
		}, interval);
	});
</script>

<svelte:head>
	<title>About Me | Jason Cameron</title>
	<meta
		name="description"
		content="Learn more about Jason Cameron, a high school student building and securing web infrastructure."
	/>
</svelte:head>

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
					src="https://placehold.co/600x800?text=Jason+Cameron"
					alt="Jason Cameron"
					class="h-full w-full rounded-md object-cover shadow-lg transition-transform duration-300 hover:scale-[1.02]"
				/>
			</div>

			<div class="space-y-4 md:col-span-2">
				<p class="text-subtext0 text-base leading-relaxed">
					[Introduction paragraph - Brief overview of who i am and i do] Feel free to <a
						href={Site.out.calcom}
						target="_blank"
						rel="noopener noreferrer"
						class="text-accent hover:underline">book a chat</a
					> if you'd like to connect.
				</p>

				<p class="text-subtext0 text-base leading-relaxed">
					[Technical background - my expertise, skills, and notable projects]
				</p>

				<p class="text-subtext0 text-base leading-relaxed">
					[Personal interests - What i enjoy outside of work]
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
						class="hover:text-accent inline-flex items-center gap-1.5 text-sm transition-colors"
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
		<h2 class="flex items-center gap-3 text-2xl font-bold md:text-3xl">
			<IconTrophy size={30} class="text-accent" />
			<span>Achievements</span>
		</h2>

		<!-- Two side-by-side achievement lists -->
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<!-- Professional Achievements -->
			<div class="bg-base rounded-lg p-5 shadow-sm transition-all duration-300 hover:shadow-md">
				<h3 class="mb-4 flex items-center gap-2 text-xl font-semibold">
					<IconBriefcase size={24} class="text-accent" />
					Professional
				</h3>

				<div class="custom-scrollbar max-h-60 space-y-2 overflow-y-auto pl-2 text-sm">
					{#each professionalAchievements as achievement (achievement)}
						<div
							class="text-subtext0 hover:text-text flex items-start gap-2 transition-colors duration-200"
						>
							<span class="text-accent font-medium">—</span>
							{#if typeof achievement === 'string'}
								<span>{achievement}</span>
							{:else}
								<a
									href={achievement.href}
									target="_blank"
									rel="noopener noreferrer"
									class="hover:text-accent transition-colors"
								>
									<span class="font-medium">{achievement.title}</span>
									{#if achievement.description}
										<span class="text-subtext0 block text-xs">{achievement.description}</span>
									{/if}
								</a>
							{/if}
						</div>
					{/each}
				</div>
			</div>

			<!-- Academic Achievements -->
			<div class="bg-base rounded-lg p-5 shadow-sm transition-all duration-300 hover:shadow-md">
				<h3 class="mb-4 flex items-center gap-2 text-xl font-semibold">
					<IconSchool size={24} class="text-accent" />
					Academic
				</h3>

				<div class="custom-scrollbar max-h-60 space-y-2 overflow-y-auto pl-2 text-sm">
					{#each academicAchievements as achievement (achievement)}
						<div
							class="text-subtext0 hover:text-text flex items-start gap-2 transition-colors duration-200"
						>
							<span class="text-accent font-medium">—</span>
							{#if typeof achievement === 'string'}
								<span>{achievement}</span>
							{:else}
								<a
									href={achievement.href}
									target="_blank"
									rel="noopener noreferrer"
									class="hover:text-accent transition-colors"
								>
									<span class="font-medium">{achievement.title}</span>
									{#if achievement.description}
										<span class="text-subtext0 block text-xs">{achievement.description}</span>
									{/if}
								</a>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>

		<div class="flex justify-center pt-4">
			<a
				href="/projects"
				class="group bg-surface0 hover:bg-accent/80 text-text inline-flex items-center gap-2 rounded-md px-5 py-2 text-sm font-medium shadow-sm transition-colors hover:text-base hover:shadow-md"
			>
				View My Projects
				<IconArrowRight
					size={16}
					class="transition-transform duration-200 group-hover:translate-x-0.5"
				/>
			</a>
		</div>
	</section>

	<!-- Hobbies Section -->
	<section id="hobbies-section" class="space-y-8">
		<h2 class="flex items-center gap-3 text-2xl font-bold md:text-3xl">
			<IconHeart size={30} class="text-accent" />
			<span>Hobbies & Interests</span>
		</h2>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<!-- Ultimate Frisbee -->
			<div
				class="bg-base rounded-lg p-5 shadow-sm transition-all duration-300 hover:shadow-md"
				style="transition-delay: 0ms;"
			>
				<img
					src="https://placehold.co/600x400?text=Ultimate+Frisbee"
					alt="Ultimate Frisbee"
					class="mb-4 h-48 w-full rounded-md object-cover shadow-sm transition-transform duration-300 hover:scale-[1.02]"
				/>
				<h3 class="mb-3 text-xl font-semibold">Ultimate Frisbee</h3>
				<p class="text-subtext0 leading-relaxed">
					I'm an avid ultimate frisbee player and enjoy both casual games and competitive matches.
					The sport combines athleticism, strategy, and teamwork in a way that I find incredibly
					engaging.
				</p>
			</div>

			<!-- Photography -->
			<div class="bg-base rounded-lg p-5 shadow-sm transition-all duration-300 hover:shadow-md">
				<img
					src="https://placehold.co/600x400?text=Photography"
					alt="Photography"
					class="mb-4 h-48 w-full rounded-md object-cover shadow-sm transition-transform duration-300 hover:scale-[1.02]"
				/>
				<h3 class="mb-3 text-xl font-semibold">Photography</h3>
				<p class="text-subtext0 mb-3 leading-relaxed">
					I love capturing moments through photography, especially landscapes and street scenes. My
					photos on Google Maps have garnered over 350,000 views, which encourages me to keep
					exploring and sharing my perspective.
				</p>
				<a href="/photos" class="group text-accent inline-flex items-center gap-1 hover:underline">
					View my photo gallery
					<IconArrowRight
						size={14}
						class="transition-transform duration-200 group-hover:translate-x-0.5"
					/>
				</a>
			</div>
		</div>

		<!-- My Dog -->
		<div class="bg-base rounded-lg p-6 shadow-sm transition-all duration-300 hover:shadow-md">
			<h3 class="mb-5 flex items-center gap-2 text-xl font-semibold">
				<IconDog size={24} class="text-accent" />
				My Dog
			</h3>

			<div class="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
				<img
					src="https://placehold.co/600x400?text=My+Dog+1"
					alt="My dog playing"
					class="h-40 w-full rounded-md object-cover shadow-sm transition-transform duration-300 hover:scale-[1.03]"
				/>
				<img
					src="https://placehold.co/600x400?text=My+Dog+2"
					alt="My dog sleeping"
					class="h-40 w-full rounded-md object-cover shadow-sm transition-transform duration-300 hover:scale-[1.03]"
				/>
				<img
					src="https://placehold.co/600x400?text=My+Dog+3"
					alt="My dog hiking"
					class="h-40 w-full rounded-md object-cover shadow-sm transition-transform duration-300 hover:scale-[1.03]"
				/>
			</div>

			<p class="text-subtext0 leading-relaxed">
				My dog is my constant companion and brings joy to my life every day. We enjoy going on
				hikes, playing fetch, and just relaxing together after a long day of coding.
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
