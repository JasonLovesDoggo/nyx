<script lang="ts">
	import { Accent, accentColorNames } from '$lib/stores/theme';
	import { mainNavItems, moreNavItems } from '$lib/config/navItems';
	import { IconX } from '@tabler/icons-svelte';
	import { page } from '$app/state';

	let { isOpen, closeSidebar } = $props<{ isOpen: boolean; closeSidebar: () => void }>();

	let currentPath = $derived(page.url.pathname);

	// Function to update the accent color store
	function selectAccent(colorName: (typeof accentColorNames)[number]) {
		$Accent = colorName;
	}
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
	class={`bg-mantle text-text border-surface0 fixed inset-y-0 right-0 z-40 flex w-64 transform flex-col border-l shadow-xl transition-transform duration-300 ease-in-out ${
		isOpen ? 'translate-x-0' : 'translate-x-full'
	}`}
	aria-hidden={!isOpen}
	role="navigation"
	id="sidebar-nav"
>
	<div class="border-surface0 flex h-16 flex-shrink-0 items-center justify-between border-b p-4">
		<span class="text-accent font-mono text-lg font-semibold">Navigation</span>
		<button
			onclick={closeSidebar}
			class="text-subtext1 hover:text-red rounded"
			aria-label="Close navigation menu"
		>
			<IconX size={24} />
		</button>
	</div>

	<div class="border-surface0 flex-shrink-0 border-b p-4">
		<span class="text-subtext1 mb-2 block text-xs font-medium">Accent Color:</span>
		<div class="flex flex-wrap gap-2">
			{#each accentColorNames as colorName (colorName)}
				{@const isSelected = $Accent === colorName}
				<button
					aria-label={`Select ${colorName} accent color`}
					title={colorName.charAt(0).toUpperCase() + colorName.slice(1)}
					onclick={() => selectAccent(colorName)}
					style="background-color: var(--color-{colorName})"
					class={'accent-square h-6 w-6 rounded transition-all duration-300' +
						(isSelected ? ' ring-accent ring-2' : '')}
				>
					<span class="sr-only">{colorName}</span>
				</button>
			{/each}
		</div>
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
						class="hover:bg-surface0 focus:bg-surface1 block rounded p-2 transition-colors duration-150 focus:outline-none"
						aria-current={isActive ? 'page' : undefined}
						onclick={closeSidebar}
					>
						{item.title}
					</a>
				</li>
			{/each}

			<li><hr class="border-surface1 my-2 border-t" /></li>

			<li class="text-subtext0 px-2 py-1 text-xs font-semibold tracking-wider uppercase">More</li>

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
