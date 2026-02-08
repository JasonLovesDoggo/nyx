<script lang="ts">
	import type { PageData } from './$types';
	import type { ImageVariant } from '$types/photos';
	import Lightbox from '$components/Lightbox.svelte';
	import { usePicsFilters } from '$lib/hooks/use-pics-filters.svelte';
	import { useLightboxNav } from '$lib/hooks/use-lightbox-nav.svelte';
	import { IconCamera, IconDeviceMobile, IconCalendar, IconX } from '@tabler/icons-svelte';

	function isPhone(camera: string): boolean {
		return /iphone|pixel|samsung/i.test(camera);
	}

	type Props = {
		data: PageData;
	};

	let { data }: Props = $props();

	const filters = usePicsFilters(() => data.images);
	const lightbox = useLightboxNav(() => filters.filtered.length);

	function buildSrcset(variants: ImageVariant[], format: string, baseUrl: string): string {
		return variants
			.filter((v) => v.format === format)
			.map((v) => `${baseUrl}${v.url} ${v.width}w`)
			.join(', ');
	}

	function getFallbackSrc(variants: ImageVariant[], baseUrl: string): string {
		const fallback = variants.find((v) => v.format === 'jpeg' && v.width === 1200);
		return fallback ? `${baseUrl}${fallback.url}` : `${baseUrl}${variants[0].url}`;
	}

	const sizes = '(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw';
</script>

<svelte:head>
	<title>Pics | Jason Cameron</title>
	<meta name="description" content="A collection of my photography." />
</svelte:head>

<main class="px-6 pt-0 pb-16 md:px-16">
	<h1 class="mb-2 text-2xl font-semibold">
		pics
		<span
			aria-label="count of photos"
			class="text-subtext0 inline-block align-baseline text-sm leading-none font-normal"
		>
			{#if filters.isFiltering}
				[{filters.filtered.length}/{data.images.length}]
			{:else}
				[{data.images.length}]
			{/if}
		</span>
	</h1>
	<p class="text-subtext0 text-sm">
		photos from around Toronto and beyond. Captured on various cameras and phones over the years.
	</p>

	<!-- Filter bar -->
	<div class="mt-3 mb-4 flex flex-wrap items-center gap-2">
		{#each filters.uniqueCameras as camera (camera)}
			{@const active = filters.selectedCameras.includes(camera)}
			<button
				class="bg-surface0 flex cursor-pointer items-center gap-1 rounded px-2 py-1 text-xs font-semibold transition-colors"
				class:text-accent={active}
				class:bg-surface1={active}
				class:text-subtext0={!active}
				class:hover:text-text={!active}
				class:hover:bg-surface1={!active}
				onclick={() => filters.toggleFilter('camera', camera)}
			>
				{#if isPhone(camera)}
					<IconDeviceMobile size={14} stroke={1.5} />
				{:else}
					<IconCamera size={14} stroke={1.5} />
				{/if}
				{camera}
				{#if active}
					<IconX size={12} stroke={2} />
				{/if}
			</button>
		{/each}

		{#each filters.uniqueYears as year (year)}
			{@const active = filters.selectedYears.includes(year)}
			<button
				class="bg-surface0 flex cursor-pointer items-center gap-1 rounded px-2 py-1 text-xs font-semibold transition-colors"
				class:text-accent={active}
				class:bg-surface1={active}
				class:text-subtext0={!active}
				class:hover:text-text={!active}
				class:hover:bg-surface1={!active}
				onclick={() => filters.toggleFilter('year', year)}
			>
				<IconCalendar size={14} stroke={1.5} />
				{year}
				{#if active}
					<IconX size={12} stroke={2} />
				{/if}
			</button>
		{/each}

		{#if filters.isFiltering}
			<button
				class="text-subtext0 hover:text-text cursor-pointer rounded px-2 py-1 text-xs font-semibold transition-colors"
				onclick={filters.clearAll}
			>
				Clear all
			</button>
		{/if}
	</div>

	<div class="columns-1 gap-x-4 md:columns-2 xl:columns-3">
		{#each filters.filtered as image, index (image.id)}
			<picture
				class="group mb-4 block cursor-pointer break-inside-avoid overflow-hidden"
				role="button"
				tabindex="0"
				onclick={() => lightbox.openAt(index)}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						lightbox.openAt(index);
					}
				}}
			>
				<source
					srcset={buildSrcset(image.variants, 'webp', data.r2BaseUrl)}
					{sizes}
					type="image/webp"
				/>
				<img
					class="block h-auto w-full opacity-0 transition-opacity duration-200 group-hover:opacity-80"
					srcset={buildSrcset(image.variants, 'jpeg', data.r2BaseUrl)}
					src={getFallbackSrc(image.variants, data.r2BaseUrl)}
					alt={image.alt}
					loading="lazy"
					decoding="async"
					width={image.originalWidth}
					height={image.originalHeight}
					{sizes}
					onload={(e) => {
						(e.currentTarget as HTMLImageElement).style.opacity = '1';
					}}
				/>
			</picture>
		{/each}
	</div>
</main>

{#if lightbox.open}
	<Lightbox
		images={filters.filtered}
		r2BaseUrl={data.r2BaseUrl}
		currentIndex={lightbox.currentIndex}
		onclose={lightbox.close}
		onprev={lightbox.prev}
		onnext={lightbox.next}
	/>
{/if}
