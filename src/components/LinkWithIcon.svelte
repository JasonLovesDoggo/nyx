<script lang="ts">

	import type { Icon } from '@tabler/icons-svelte';

	type Props = {
		href: string;
		text: string;
		icon?: Icon;
		external?: boolean;
		class?: string;
	};

	let { href, text, icon, external = false, class: extraClasses = '' }: Props = $props();

	const target = external ? '_blank' : undefined;
	const rel = external ? 'noopener noreferrer' : undefined;

	const IconComponent = icon ? icon : null;
</script>

<a {href} {target} {rel}
	 class={`inline-flex items-center gap-1.5 text-subtext1 transition-colors duration-200 hover:text-accent ${extraClasses}`}>
	{#if icon}
		<IconComponent size={18} stroke={1.5} class="flex-shrink-0" />
	{/if}
	<span>{text}</span>
</a>