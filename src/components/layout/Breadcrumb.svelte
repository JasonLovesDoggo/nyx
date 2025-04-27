<script>
	import { page } from '$app/state';

	const breadcrumbs = $derived(page.url.pathname.split('/').filter(Boolean).slice(0, 4));
</script>

{#snippet breadcrumb({ text, href = undefined })}
	<li class="inline-flex items-center">
		{#if href}
			<a class="animation-wiggle hover:text-accent" {href}>{text}</a>
		{:else}
			<span aria-current="page">{text}</span>
		{/if}
	</li>
{/snippet}

<nav aria-label="Breadcrumbs">
	<ul class="text-md flex items-center">
		<li class="inline-flex items-center">
			<a class="animation-wiggle text-accent hover:text-accent/40" href="/">~</a>
		</li>

		{#each breadcrumbs as text, i ('Bred' + i)}
			<li class="mx-0.5 inline-flex items-center">/</li>
			{@const href = '/' + breadcrumbs.slice(0, i + 1).join('/')}

			{#if i === breadcrumbs.length - 1}
				{@render breadcrumb({ text })}
			{:else}
				{@render breadcrumb({ text, href })}
			{/if}
		{/each}
		<li class="mx-0.5 inline-flex items-center" aria-hidden="true">/</li>

		<li class="ml-1 inline-flex items-center">
			<span class="cursor-blink bg-accent h-4 w-2" aria-hidden="true"></span>
		</li>
	</ul>
</nav>

<style>
	@keyframes blink {
		0%,
		100% {
			opacity: 1; /* Fully visible */
		}
		20% {
			opacity: 0; /* Invisible */
		}
	}

	.cursor-blink {
		animation: blink 3s cubic-bezier(0.2, 1, 0.8, 1) infinite;
	}
</style>
