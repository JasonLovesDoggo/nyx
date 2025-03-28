<script lang="ts">
	import * as Breadcrumb from "$components/ui/breadcrumb/index.js";
	import {NavigationMenu} from "bits-ui"
	import { cn } from "$lib/utils";
	import { navItems } from "$lib/config/navItems";
	import {  page } from '$app/state';

	let breadcrumbs: { name: string, href: string }[] = $state([{ name: 'Home', href: '/' }]);
	$effect(() => {
		const pathSegments = page.url.pathname.split('/').filter(segment => segment !== '');
		breadcrumbs = [{ name: 'Home', href: '/' }];
		let currentPath = '/';
		pathSegments.forEach(segment => {
			currentPath += `${segment}/`;
			breadcrumbs.push({ name: segment.charAt(0).toUpperCase() + segment.slice(1), href: currentPath });
		});
	});
</script>

<div class="w-full bg-base-300 rounded-md flex items-center justify-between p-4">
	<Breadcrumb.Root>
		<Breadcrumb.List>
			<Breadcrumb.Item>
				<Breadcrumb.Link href="/" class="font-mono text-sm">~</Breadcrumb.Link>
			</Breadcrumb.Item>
			{#if breadcrumbs && breadcrumbs.length > 1}
				<Breadcrumb.Separator />
				{#each breadcrumbs.slice(1) as crumb, i}
					<Breadcrumb.Item>
						{#if i === breadcrumbs.length - 2}
							<Breadcrumb.Link href={crumb.href}>{crumb.name}</Breadcrumb.Link>
							<Breadcrumb.Separator />
						{:else if i === breadcrumbs.length - 1}
							<Breadcrumb.Page>{crumb.name}</Breadcrumb.Page>
						{:else}
							<Breadcrumb.Link href={crumb.href}>{crumb.name}</Breadcrumb.Link>
							<Breadcrumb.Separator />
						{/if}
					</Breadcrumb.Item>
				{/each}
			{/if}
		</Breadcrumb.List>
	</Breadcrumb.Root>

	<NavigationMenu.Root class="flex items-center space-x-4">
		<NavigationMenu.List class="flex items-center space-x-4">
			{#each navItems as item}
				<NavigationMenu.Item>
					{#if item.submenu}
						<NavigationMenu.Trigger class={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 data-[active]:bg-accent data-[active]:text-accent-foreground",
        "h-9 px-3"
       )}
						>
							{item.title}
						</NavigationMenu.Trigger>
						<NavigationMenu.Content class="absolute top-full left-0 w-48 bg-base-200 rounded-md shadow-md z-10">
							<ul class="py-2">
								{#each item.submenu as subItem}
									<li>
										<NavigationMenu.Link href={subItem.href} class="block px-4 py-2 text-sm hover:bg-base-100 transition-colors">
											{subItem.title}
										</NavigationMenu.Link>
									</li>
								{/each}
							</ul>
						</NavigationMenu.Content>
					{:else}
						<NavigationMenu.Link href={item.href} class={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 data-[active]:bg-accent data-[active]:text-accent-foreground",
        "h-9 px-3"
       )}
						>
							{item.title}
						</NavigationMenu.Link>
					{/if}
				</NavigationMenu.Item>
			{/each}
		</NavigationMenu.List>
	</NavigationMenu.Root>
</div>