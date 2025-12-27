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

	const target = $derived(external ? '_blank' : undefined);
	const rel = $derived(external ? 'noopener noreferrer' : undefined);
</script>

<a
	{href}
	{target}
	{rel}
	class={`text-subtext1 hover:text-accent inline-flex items-center gap-1.5 transition-colors duration-200 ${extraClasses}`}
>
	{#if icon}
		{@const IconComponent = icon}
		<IconComponent size={18} stroke={1.5} class="shrink-0" />
	{/if}
	<span>{text}</span>
</a>
