<script>
	import { Socials } from '$lib/config/common';
</script>

<div class="mt-10 flex min-h-full items-center justify-center">
	<div class="text-center">
		<p class="mb-6 text-lg font-semibold text-gray-300">Connect with me on these platforms:</p>

		<ul class="space-y-4">
			{#each Socials as outlink (outlink.label)}
				{@const Icon = outlink.icon}
				<li class="flex items-center space-x-6">
					<a
						href={outlink.url}
						target="_blank"
						rel="noopener noreferrer"
						class="hover:text-accent flex items-center space-x-3 transition-colors duration-150"
						aria-label={outlink.label}
					>
						<Icon class="h-8 w-8" />
						<span class="text-lg font-medium">{outlink.label}</span>
						<span class="text-accent/90">{outlink.url}</span>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</div>
