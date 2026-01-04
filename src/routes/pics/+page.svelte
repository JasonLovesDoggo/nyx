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

<main>
	<h1>
		pics <span aria-label="count of photos" class="count">&lbrace;{data.images.length}&rbrace;</span
		>
	</h1>
	<p>photos from around toronto and beyond. Captured on a Pixel 6, Pixel 8 or a Canon T7</p>
	<br />
	<div class="grid">
		{#each data.images as image, index (image.id)}
			<picture
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
					src={image.src.img.src}
					alt={image.alt}
					loading="lazy"
					width={image.src.img.w}
					height={image.src.img.h}
					onload={(e) => {
						const target = e.currentTarget as HTMLImageElement | null;
						if (target) {
							target.style.opacity = '1';
						}
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

<style>
	main {
		padding: 0 4rem 4rem 4rem;
	}

	h1 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.count {
		color: var(--color-subtext0);
		font-weight: 400;
	}

	p {
		color: var(--color-subtext0);
		font-size: 0.875rem;
	}

	.grid {
		columns: 3 !important;
		column-gap: 1rem;
		column-fill: balance;
		width: 100% !important;
		display: block !important;
	}

	picture {
		display: block;
		overflow: hidden;
		break-inside: avoid;
		margin-bottom: 1rem;
		cursor: pointer;
	}

	picture:hover img {
		opacity: 0.8;
	}

	img {
		transition: opacity 0.2s;
		opacity: 0;
		width: 100%;
		height: auto;
		display: block;
	}

	@media (max-width: 1400px) {
		.grid {
			columns: 2 !important;
		}
	}

	@media (max-width: 850px) {
		main {
			padding-left: 1.5rem;
			padding-right: 1.5rem;
		}
		.grid {
			columns: 1 !important;
		}
	}
</style>
