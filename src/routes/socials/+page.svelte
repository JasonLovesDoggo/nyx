<script>
	import { Socials } from '$lib/config/common';
	import { IconExternalLink } from '@tabler/icons-svelte';
</script>

<svelte:head>
	<title>Connect with Jason Cameron | Social Links</title>
	<meta
		name="description"
		content="Connect with Jason Cameron on various social platforms - GitHub, LinkedIn, X, Bluesky, Instagram, and WakaTime."
	/>
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-6 sm:px-6 md:py-12">
	<!-- Header Section -->
	<div class="mb-8 text-center">
		<p class="text-subtext0 text-base leading-relaxed md:text-lg">
			Find me across the web. Let's build something together.
		</p>
	</div>

	<!-- Social Links Grid -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each Socials as social (social.label)}
			{@const Icon = social.icon}
			<a
				href={social.url}
				target="_blank"
				rel="noopener noreferrer"
				class="group border-surface0 bg-base hover:border-accent/30 focus:border-accent/50 focus:ring-accent/20 relative overflow-hidden rounded-xl border p-6 shadow-lg transition-all duration-300 hover:shadow-xl focus:ring-2 focus:outline-none active:scale-[0.98]"
				aria-label={`Visit ${social.label}`}
			>
				<!-- Background gradient on hover -->
				<div
					class="from-accent/5 absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
				></div>

				<!-- Content -->
				<div class="relative z-10">
					<!-- Icon and External Link -->
					<div class="mb-4 flex items-center justify-between">
						<div
							class="bg-surface0 group-hover:bg-accent/10 flex h-12 w-12 items-center justify-center rounded-lg transition-colors duration-300"
						>
							<Icon
								class="text-accent h-6 w-6 transition-transform duration-300 group-hover:scale-110"
							/>
						</div>
						<IconExternalLink
							class="text-subtext1 h-4 w-4 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
						/>
					</div>

					<!-- Platform Name -->
					<div class="mb-2">
						<h3
							class="text-text group-hover:text-accent text-lg font-semibold transition-colors duration-300"
						>
							{social.label}
						</h3>
					</div>

					<!-- URL/Handle -->
					<div class="text-subtext0 flex items-center text-sm">
						<span class="truncate font-mono">
							{#if social.url.includes('github.com')}
								@{social.url.split('/').pop()}
							{:else if social.url.includes('x.com') || social.url.includes('twitter.com')}
								@{social.url.split('/').pop()}
							{:else if social.url.includes('linkedin.com/in/')}
								{social.url.split('/in/')[1]?.replace('/', '')}
							{:else if social.url.includes('instagram.com')}
								@{social.url.split('/').filter(Boolean).pop()}
							{:else if social.url.includes('bsky.app')}
								@{social.url.split('/profile/')[1] || social.url.split('/').pop()}
							{:else if social.url.includes('wakatime.com')}
								@{social.url.split('/@')[1] || social.url.split('/').pop()}
							{:else}
								{new URL(social.url).hostname}
							{/if}
						</span>
					</div>
				</div>

				<!-- Subtle animation line -->
				<div
					class="bg-accent absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"
				></div>
			</a>
		{/each}
	</div>

	<!-- Footer Call-to-Action -->
	<div class="mt-12 text-center">
		<p class="text-subtext1 text-sm">
			Prefer email? Reach out at
			<a href="mailto:hi@jasoncameron.dev" class="link text-accent font-medium hover:underline">
				hi@jasoncameron.dev
			</a>
		</p>
	</div>
</div>
