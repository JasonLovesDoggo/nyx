<script lang="ts">
	import Breadcrumb from './Breadcrumb.svelte';
	import { IconMenu2 } from '@tabler/icons-svelte';
	import { mainNavItems } from '$lib/config/navItems';

	let { toggleSidebar } = $props<{ toggleSidebar: () => void }>();
</script>

<div class="flex h-16 items-center justify-between p-5 select-none">
	<Breadcrumb />
	<button
		onclick={toggleSidebar}
		class="text-text hover:text-accent rounded p-2 md:hidden"
	aria-label="Open navigation menu"
	aria-expanded="false"
	aria-controls="sidebar-nav"
	>
	<IconMenu2 size={24} />
	</button>
	<nav class="hidden items-center space-x-4 md:flex"> <!-- Nav appears on medium screens and up -->
		<!-- Desktop Links (Main Items) -->
		{#each mainNavItems as item (item.title)}
			<a
				href={item.href}
				target={item.external ? '_blank' : undefined}
				rel={item.external ? 'noopener noreferrer' : undefined}
				class="text-text hover:text-accent rounded px-3 py-2 text-sm font-medium transition-colors duration-150"
			>
				{item.title}
			</a>
		{/each}
		<!-- Consider adding a "More..." button here for desktop that opens the sidebar -->
		<button
			onclick={toggleSidebar}
			class="text-text hover:text-accent rounded px-3 py-2 text-sm font-medium"
			aria-label="Open more navigation items"
		>
			More...
		</button>
	</nav>
</div>
