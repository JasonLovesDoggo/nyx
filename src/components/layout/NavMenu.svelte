<script lang="ts">
	import { cn } from '$lib/utils';
	import { navItems } from '$lib/config/navItems';
</script>

<nav class="flex items-center space-x-4">
	<ul class="flex items-center space-x-4">
		{#each navItems as item (item.title)}
			<!--fixme: currently puts the content.. after the page-->
			<li>
				{#if item.submenu}
					<button
						class={cn(
							'focus-visible:ring-ring data-[active]:bg-accent data-[active]:text-accent-foreground inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-50',
							'h-9 px-3'
						)}
					>
						{item.title}
					</button>
					<div class="bg-base-200 absolute top-full left-0 z-10 w-48 rounded-md shadow-md">
						<ul class="py-2">
							{#each item.submenu as subItem (item + subItem.title)}
								<li>
									<a
										href={subItem.href}
										class="hover:bg-base-100 block px-4 py-2 text-sm transition-colors"
									>
										{subItem.title}
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{:else}
					<a
						href={item.href}
						class={cn(
							'focus-visible:ring-ring data-[active]:bg-accent data-[active]:text-accent-foreground inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-50',
							'h-9 px-3'
						)}
					>
						{item.title}
					</a>
				{/if}
			</li>
		{/each}
	</ul>
</nav>
