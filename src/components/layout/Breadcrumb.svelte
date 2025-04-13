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
			<li class="mx-0.5">/</li>
			{@const href = '/' + breadcrumbs.slice(0, i + 1).join('/')}

			{#if i === breadcrumbs.length - 1}
				{@render breadcrumb({ text })}
			{:else}
				{@render breadcrumb({ text, href })}
			{/if}
		{/each}
	</ul>
</nav>
