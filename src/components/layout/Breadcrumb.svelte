<script>
	import { page } from '$app/state';

	const breadcrumbs = $derived(page.url.pathname.split('/').filter(Boolean).slice(0, 4));
</script>

{#snippet breadcrumb({ text, href = undefined })}
	<li class="inline-flex items-center">
		{#if href}
			<a class="animation-wiggle hover:text-accent" href={href}>{text}</a>
		{:else}
			<span aria-current="page">{text}</span>
		{/if}
	</li>
{/snippet}

<ul class="flex items-center text-md" role="navigation" aria-label="Breadcrumbs">
	{@render breadcrumb({ text: "~", href: "/" })}

	{#each breadcrumbs as text, i ("Bred" + i)}
		<li class="mx-0.5">/</li>
		{@const href = "/" + breadcrumbs.slice(0, i + 1).join("/")}

		{#if i === breadcrumbs.length - 1}
			{@render breadcrumb({ text })}
		{:else}
			{@render breadcrumb({ text, href })}
		{/if}
	{/each}
</ul>
