<script lang="ts">
	import { page } from '$app/state';

	let breadcrumbs = $state([{ name: 'Home', href: '/' }]);

	// Track the current path to avoid unnecessary re-renders
	let lastPath = $state('');

	$effect(() => {
		const currentPath = page.url.pathname;

		// Only update breadcrumbs if the path has changed
		if (currentPath !== lastPath) {
			lastPath = currentPath;

			const pathSegments = currentPath.split('/').filter((segment) => segment !== '');
			const newBreadcrumbs = [{ name: 'Home', href: '/' }];

			let accumulatedPath = '/';
			pathSegments.forEach((segment) => {
				accumulatedPath += `${segment}/`;
				newBreadcrumbs.push({
					name: segment.charAt(0).toUpperCase() + segment.slice(1),
					href: accumulatedPath
				});
			});

			breadcrumbs = newBreadcrumbs;
		}
	});
</script>

<nav aria-label="Breadcrumb">
	<ol class="flex items-center font-mono text-md">
		<li class="inline-flex items-center">
			<a class="animation-wiggle hover:text-accent" href="/">~</a>
		</li>
		{#if breadcrumbs && breadcrumbs.length > 1}
			<li class="mx-0.5">/</li>
			{#each breadcrumbs.slice(1) as crumb, i (i)}
				<li class="inline-flex items-center">
					{#if i === breadcrumbs.slice(1).length - 1}
						<span aria-current="page">{crumb.name}</span>
					{:else}
						<a class="animation-wiggle hover:text-accent" href={crumb.href}>{crumb.name}</a>
						<span class="mx-0.5">/</span>
					{/if}
				</li>
			{/each}
		{/if}
	</ol>
</nav>
