<script lang="ts">
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
</script>

<h1>Settings</h1>

<div class="submenu">
	{#each data.sections as section}
		<a class="pl-3.5" href="/post/{section.slug}">{section.title}</a>
	{/each}
</div>

{@render children()}