<script lang="ts">
	import { nextMarginNoteNumber } from '$lib/stores/marginnote';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	const number = nextMarginNoteNumber();
	let expanded = $state(false);

	function toggle() {
		expanded = !expanded;
	}
</script>

<span class="marginnote-wrapper">
	<button class="marginnote-ref" onclick={toggle} aria-expanded={expanded} aria-label="Toggle margin note">
		<sup class="marginnote-inline-number">[{number}]</sup>
	</button>
	<span class="marginnote" class:expanded
		><span class="marginnote-number">[{number}]</span>{@render children()}</span
	>
</span>

<style>
	.marginnote-wrapper {
		display: inline;
	}

	.marginnote-inline-number {
		color: var(--current-accent-color);
		font-weight: 600;
	}

	.marginnote-ref {
		cursor: pointer;
		font-size: 0.75rem;
		vertical-align: super;
		background: transparent;
		border: none;
		padding: 0 0.125rem;
		transition: color 0.2s ease;
	}

	.marginnote-ref:hover {
		opacity: 0.8;
	}

	.marginnote {
		display: block;
		max-height: 0;
		overflow: hidden;
		font-size: 0.8rem;
		line-height: 1.4;
		color: var(--color-subtext0);
		opacity: 0;
		transition:
			max-height 0.3s ease,
			opacity 0.3s ease,
			padding 0.3s ease,
			margin 0.3s ease;
	}

	.marginnote.expanded {
		max-height: 500px;
		opacity: 1;
		padding: 0.75rem 1rem;
		margin: 0.5rem 0;
		background-color: var(--color-surface0);
		border-left: 2px solid var(--color-surface2);
		border-radius: 0 0.25rem 0.25rem 0;
	}

	.marginnote-number {
		font-weight: 600;
		color: var(--current-accent-color);
		margin-right: 0.25rem;
	}

	@media (min-width: 1280px) {
		.marginnote-wrapper {
			position: static;
		}

		.marginnote-ref {
			cursor: pointer;
		}

		.marginnote {
			display: block;
			position: absolute;
			right: 0;
			top: auto;
			transform: translateX(calc(100% + 1rem));
			width: 200px;
			padding: 0 0 0 0.75rem;
			border-left: 2px solid var(--current-accent-color);
			background: transparent;
			max-height: none;
			opacity: 1;
			overflow: visible;
			white-space: normal;
		}

		.marginnote.expanded {
			padding: 0 0 0 0.75rem;
			background: transparent;
			border-left: 2px solid var(--current-accent-color);
			max-height: none;
			opacity: 1;
		}

		.marginnote-number {
			display: inline;
		}
	}
</style>
