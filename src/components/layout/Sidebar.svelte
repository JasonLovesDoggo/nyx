<script lang="ts">
	import { Accent, accentColorNames } from '$lib/stores/theme';
	import { mainNavItems, moreNavItems } from '$lib/config/navItems';
	import { IconX } from '@tabler/icons-svelte';
	import { page } from '$app/state';

	let { isOpen, closeSidebar } = $props<{ isOpen: boolean; closeSidebar: () => void }>();


	let currentPath = $derived(page.url.pathname);
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
		onclick={closeSidebar}
		onkeydown={(e) => e.key === 'Escape' && closeSidebar()}
		role="button"
		tabindex="-1"
		aria-label="Close sidebar"
	></div>
{/if}

<aside
	class={`bg-mantle text-text fixed inset-y-0 right-0 z-40 flex w-64 transform flex-col border-l border-surface0 shadow-xl transition-transform duration-300 ease-in-out ${
		isOpen ? 'translate-x-0' : 'translate-x-full'
	}`}
	aria-hidden={!isOpen}
	role="navigation"
	id="sidebar-nav"
>
	<div class="border-b border-surface0 flex h-16 flex-shrink-0 items-center justify-between p-4">
		<span class="text-lg font-semibold font-mono">Navigation</span>
		<button
			onclick={closeSidebar}
			class="text-subtext1 hover:text-red focus:outline-none focus:ring-2 focus:ring-red rounded"
			aria-label="Close navigation menu"
		>
			<IconX size={24} />
		</button>
	</div>

	<div class="border-b border-surface0 p-4 flex-shrink-0">
		<label for="accent-selector" class="mb-1 block text-xs font-medium text-subtext1"
		>Accent Color:</label
		>
		<select
			id="accent-selector"
			class="w-full rounded border border-surface1 bg-crust p-1.5 text-sm focus:border-mauve focus:ring focus:ring-mauve focus:ring-opacity-50"
			bind:value={$Accent}
		>
			{#each accentColorNames as colorName (colorName)}
				<option value={colorName}>{colorName.charAt(0).toUpperCase() + colorName.slice(1)}</option>
			{/each}
		</select>
	</div>

	<nav class="flex-1 overflow-y-auto p-4">
		<ul class="space-y-2" role="list">
			{#each mainNavItems as item (item.title)}
				{@const isActive = !item.external && currentPath === item.href}
				<li>
					<a
						href={item.href}
						target={item.external ? '_blank' : undefined}
						rel={item.external ? 'noopener noreferrer' : undefined}
						class="hover:bg-surface0 focus:bg-surface1 block rounded p-2 transition-colors duration-150 focus:outline-none "
						aria-current={isActive ? 'page' : undefined}
						onclick={closeSidebar}
					>
					{item.title}
					</a>
				</li>
			{/each}

			<li><hr class="my-2 border-t border-surface1" /></li>

			<li class="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-subtext0">More</li>

			{#each moreNavItems as item (item.title)}
				{@const isActive = !item.external && currentPath === item.href}
				<li>
					<a
						href={item.href}
						target={item.external ? '_blank' : undefined}
						rel={item.external ? 'noopener noreferrer' : undefined}
						class="hover:bg-surface0 focus:bg-surface1 block rounded p-2 transition-colors duration-150 focus:outline-none"
						aria-current={isActive ? 'page' : undefined}
						onclick={closeSidebar}
					>
					{item.title}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</aside>