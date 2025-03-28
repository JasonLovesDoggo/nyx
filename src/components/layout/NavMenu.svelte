<script lang="ts">
	import { cn } from "$lib/utils";
	import { navItems } from "$lib/config/navItems";
</script>

<nav class="flex items-center space-x-4">
	<ul class="flex items-center space-x-4">
		{#each navItems as item}
			<li>
				{#if item.submenu}
					<button
						class={cn(
              "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 data-[active]:bg-accent data-[active]:text-accent-foreground",
              "h-9 px-3"
            )}
					>
						{item.title}
					</button>
					<div class="absolute top-full left-0 w-48 bg-base-200 rounded-md shadow-md z-10">
						<ul class="py-2">
							{#each item.submenu as subItem}
								<li>
									<a
										href={subItem.href}
										class="block px-4 py-2 text-sm hover:bg-base-100 transition-colors"
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
              "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 data-[active]:bg-accent data-[active]:text-accent-foreground",
              "h-9 px-3"
            )}
					>
						{item.title}
					</a>
				{/if}
			</li>
		{/each}
	</ul>
</nav>