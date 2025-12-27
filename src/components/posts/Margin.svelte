<script lang="ts">
	import { nextSidenoteNumber } from '$lib/stores/sidenote';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	const number = nextSidenoteNumber();
	let expanded = $state(false);

	function toggle() {
		expanded = !expanded;
	}
</script>

<span class="sidenote-wrapper">
	<button class="sidenote-ref" onclick={toggle} aria-expanded={expanded}>
		<sup class="sidenote-inline-number">[{number}]</sup>
	</button>
	<span class="sidenote" class:expanded
		><span class="sidenote-number">[{number}]</span>{@render children()}</span
	>
</span>

<style>
	.sidenote-wrapper {
		display: inline;
	}

	.sidenote-inline-number {
		color: var(--current-accent-color);
		font-weight: 600;
	}

	.sidenote-ref {
		cursor: pointer;
		font-size: 0.75rem;
		vertical-align: super;
		background: transparent;
		border: none;
		padding: 0 0.125rem;
		transition: color 0.2s ease;
	}

	.sidenote-ref:hover {
		opacity: 0.8;
	}

	.sidenote {
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

	.sidenote.expanded {
		max-height: 500px;
		opacity: 1;
		padding: 0.75rem 1rem;
		margin: 0.5rem 0;
		background-color: var(--color-surface0);
		border-left: 2px solid var(--color-surface2);
		border-radius: 0 0.25rem 0.25rem 0;
	}

	.sidenote-number {
		font-weight: 600;
		color: var(--current-accent-color);
		margin-right: 0.25rem;
	}

	@media (min-width: 1280px) {
		.sidenote-wrapper {
			position: static;
		}

		.sidenote-ref {
			cursor: pointer;
		}

		.sidenote {
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

		.sidenote.expanded {
			padding: 0 0 0 0.75rem;
			background: transparent;
			border-left: 2px solid var(--current-accent-color);
			max-height: none;
			opacity: 1;
		}

		.sidenote-number {
			display: inline;
		}
	}
</style>
