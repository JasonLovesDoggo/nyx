<script>
	import { Socials } from '$lib/config/common';
</script>

<div class="mt-10 flex min-h-full items-center justify-center px-4 sm:px-6">
	<div class="w-full max-w-md text-center">
		<p class="mb-6 text-lg font-semibold text-gray-300">Connect with me on these platforms:</p>

		<ul class="space-y-6">
			{#each Socials as outlink (outlink.label)}
				{@const Icon = outlink.icon}
				<li class="rounded-lg p-4 transition-all">
					<a
						href={outlink.url}
						target="_blank"
						rel="noopener noreferrer"
						class="link flex flex-col items-center space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4"
						aria-label={outlink.label}
					>
						<Icon class="h-8 w-8 flex-shrink-0" />
						<span class="text-lg font-medium">{outlink.label}</span>
						<span class="sm:text-normal text-sm">{outlink.url}</span>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</div>
