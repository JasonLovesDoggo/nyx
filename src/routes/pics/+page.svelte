<script lang="ts">
	import type { PageData } from './$types';
	import Lightbox from '$components/Lightbox.svelte';

	type Props = {
		data: PageData;
	};

	let { data }: Props = $props();

	let lightboxOpen = $state(false);
	let currentIndex = $state(0);

	function openLightbox(index: number) {
		currentIndex = index;
		lightboxOpen = true;
	}

	function prevImage() {
		currentIndex = (currentIndex - 1 + data.images.length) % data.images.length;
	}

	function nextImage() {
		currentIndex = (currentIndex + 1) % data.images.length;
	}
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
			&lbrace;{data.images.length}&rbrace;
		</span>
	</h1>
	<p class="text-subtext0 text-sm">
		photos from around Toronto and beyond. Captured on a Pixel 6, Pixel 8 or a Canon T7
	</p>
	<br />
	<div class="columns-1 break-inside-avoid gap-x-4 md:columns-2 xl:columns-3">
		{#each data.images as image, index (image.id)}
			<picture
				class="group mb-4 block cursor-pointer break-inside-avoid overflow-hidden"
				role="button"
				tabindex="0"
				onclick={() => openLightbox(index)}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						openLightbox(index);
					}
				}}
			>
				{#if image.src.sources?.avif}
					<source srcset={image.src.sources.avif} type="image/avif" />
				{/if}
				{#if image.src.sources?.webp}
					<source srcset={image.src.sources.webp} type="image/webp" />
				{/if}
				<img
					class="block h-auto w-full opacity-0 transition-opacity duration-200 group-hover:opacity-80"
					src={image.src.img.src}
					alt={image.alt}
					loading="lazy"
					width={image.src.img.w}
					height={image.src.img.h}
					onload={(e) => {
						(e.currentTarget as HTMLImageElement).style.opacity = '1';
					}}
				/>
			</picture>
		{/each}
	</div>
</main>

{#if lightboxOpen}
	<Lightbox
		images={data.images}
		{currentIndex}
		onclose={() => (lightboxOpen = false)}
		onprev={prevImage}
		onnext={nextImage}
	/>
{/if}
