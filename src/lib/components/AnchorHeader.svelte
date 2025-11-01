<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLHeadingElement> {
		level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
		children: Snippet;
		class?: string;
	}

	let { level = 'h2', children, class: className = '', ...rest }: Props = $props();

	// Generate ID from the text content
	let headingElement: HTMLHeadingElement;
	let id = $state('');

	$effect(() => {
		if (headingElement) {
			// Get text content and generate slug
			const text = headingElement.textContent || '';
			id = text
				.toLowerCase()
				.replace(/[^\w\s-]/g, '') // Remove special characters
				.replace(/\s+/g, '-') // Replace spaces with hyphens
				.replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
				.trim();
		}
	});

	const handleClick = (e: MouseEvent) => {
		e.preventDefault();
		if (id) {
			// Update URL without scrolling
			history.pushState(null, '', `#${id}`);
			// Copy link to clipboard
			navigator.clipboard.writeText(window.location.href);
		}
	};
</script>

<svelte:element
	this={level}
	bind:this={headingElement}
	{id}
	class="group relative {className}"
	{...rest}
>
	<button
		onclick={handleClick}
		class="text-accent absolute -ml-6 cursor-pointer opacity-0 transition-opacity group-hover:opacity-50 hover:opacity-100"
		style="left: -0.5rem;"
		aria-label="Copy link to section"
	>
		#
	</button>
	{@render children()}
</svelte:element>
