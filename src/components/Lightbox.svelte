<script lang="ts">
	import type { PhotoData, ImageVariant } from '$types/photos';
	import { IconCamera } from '@tabler/icons-svelte';

	// Persists across lightbox open/close since the component remounts each time
	let persistedShowExif = true;

	type Props = {
		images: PhotoData[];
		r2BaseUrl: string;
		currentIndex: number;
		onclose: () => void;
		onprev: () => void;
		onnext: () => void;
	};

	let { images, r2BaseUrl, currentIndex, onclose, onprev, onnext }: Props = $props();

	let image = $derived(
		currentIndex >= 0 && currentIndex < images.length ? images[currentIndex] : null
	);
	let isLoading = $state(false);
	let lightboxEl: HTMLDivElement | null = $state(null);
	let showExif = $state(persistedShowExif);
	let currentQuality = $state<'preview' | 'high' | 'original'>('preview');

	// Swipe support
	let touchStartX = 0;
	let touchEndX = 0;

	function getVariantUrl(
		variants: ImageVariant[],
		targetWidth: number,
		format: string
	): string | null {
		const match = variants.find((v) => v.width === targetWidth && v.format === format);
		return match ? `${r2BaseUrl}${match.url}` : null;
	}

	function getOriginalVariant(variants: ImageVariant[]): ImageVariant | null {
		return variants.find((v) => v.original) ?? null;
	}

	let currentSrc = $derived.by(() => {
		if (!image) return '';
		const variants = image.variants;
		if (currentQuality === 'preview') {
			return getVariantUrl(variants, 800, 'webp') ?? getVariantUrl(variants, 800, 'jpeg') ?? '';
		}
		if (currentQuality === 'original') {
			const orig = getOriginalVariant(variants);
			return orig ? `${r2BaseUrl}${orig.url}` : '';
		}
		// high
		return getVariantUrl(variants, 2000, 'webp') ?? getVariantUrl(variants, 2000, 'jpeg') ?? '';
	});

	let originalVariant = $derived(image ? getOriginalVariant(image.variants) : null);

	// Prefetch URLs for adjacent images
	let prefetchUrls = $derived.by(() => {
		if (images.length <= 1) return [];
		const urls: string[] = [];
		const prevIdx = (currentIndex - 1 + images.length) % images.length;
		const nextIdx = (currentIndex + 1) % images.length;
		for (const idx of [prevIdx, nextIdx]) {
			const img = images[idx];
			if (img) {
				const url = getVariantUrl(img.variants, 2000, 'webp');
				if (url) urls.push(url);
			}
		}
		return urls;
	});

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onclose();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onclose();
		} else if (e.key === 'ArrowLeft') {
			onprev();
		} else if (e.key === 'ArrowRight') {
			onnext();
		} else if (e.key === 'i') {
			showExif = !showExif;
			persistedShowExif = showExif;
		}
	}

	function handleImageLoad() {
		if (currentQuality === 'preview') {
			currentQuality = 'high';
		} else {
			isLoading = false;
		}
	}

	function loadOriginal() {
		currentQuality = 'original';
	}

	// Reset quality on navigation
	$effect(() => {
		void currentIndex;
		currentQuality = 'preview';
		isLoading = true;
	});

	$effect(() => {
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = '';
		};
	});

	// Touch/swipe event listeners
	$effect(() => {
		const el = lightboxEl;
		if (!el) return;

		const handleTouchStart = (e: TouchEvent) => {
			if (e.touches.length > 0) {
				touchStartX = e.touches[0].clientX;
			}
		};

		const handleTouchMove = (e: TouchEvent) => {
			if (e.touches.length > 0) {
				touchEndX = e.touches[0].clientX;
			}
		};

		const handleTouchEnd = () => {
			const diff = touchStartX - touchEndX;
			const threshold = 50;

			if (Math.abs(diff) > threshold) {
				if (diff > 0) {
					onnext();
				} else {
					onprev();
				}
			}
		};

		el.addEventListener('touchstart', handleTouchStart);
		el.addEventListener('touchmove', handleTouchMove);
		el.addEventListener('touchend', handleTouchEnd);

		return () => {
			el.removeEventListener('touchstart', handleTouchStart);
			el.removeEventListener('touchmove', handleTouchMove);
			el.removeEventListener('touchend', handleTouchEnd);
		};
	});
</script>

<svelte:head>
	{#each prefetchUrls as url (url)}
		<link rel="prefetch" href={url} as="image" />
	{/each}
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

{#if image}
	<div
		class="lightbox"
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
		role="button"
		tabindex="-1"
		bind:this={lightboxEl}
	>
		<button
			class="text-accent absolute top-1/2 left-1 z-[10000] -translate-y-1/2 cursor-pointer overflow-visible border-none bg-transparent px-4 py-8 text-3xl transition-transform duration-200 hover:scale-110 md:left-4 md:px-8 md:py-16 md:text-5xl"
			onclick={onprev}
			aria-label="Previous image"
		>
			<span class="block scale-y-[1.5] transition-transform duration-500">&#8249;</span>
		</button>

		{#if isLoading && currentQuality === 'preview'}
			<div class="loading">
				<div class="spinner"></div>
			</div>
		{/if}

		<img
			class="lightbox-img"
			class:loading={isLoading && currentQuality === 'preview'}
			src={currentSrc}
			alt={image.alt}
			onload={handleImageLoad}
		/>

		<!-- Top-right controls -->
		<div class="absolute top-3 right-3 z-[10001] flex gap-2">
			{#if currentQuality === 'high' && originalVariant}
				<button
					class="cursor-pointer rounded bg-black/60 px-3 py-2 text-xs font-medium text-white/80 backdrop-blur-sm transition-colors hover:bg-black/80 hover:text-white"
					onclick={loadOriginal}
					aria-label="Load original resolution"
				>
					Load original ({image.originalWidth}x{image.originalHeight})
				</button>
			{/if}
			<button
				class="flex cursor-pointer items-center gap-1.5 rounded px-3 py-2 text-xs font-medium backdrop-blur-sm transition-colors {showExif
					? 'text-accent bg-white/20'
					: 'bg-black/60 text-white/50 hover:bg-black/80 hover:text-white/80'}"
				onclick={() => {
					showExif = !showExif;
					persistedShowExif = showExif;
				}}
				aria-label="Toggle EXIF data"
			>
				<IconCamera size={14} stroke={1.5} />
				Info
			</button>
		</div>

		<!-- EXIF bar -->
		{#if showExif && image.exif}
			<div class="exif-bar">
				{#if image.exif.camera}
					<span class="font-semibold">{image.exif.camera}</span>
				{/if}
				{#if image.exif.focalLength}
					<span>{Math.round(image.exif.focalLength)}mm</span>
				{/if}
				{#if image.exif.aperture}
					<span>f/{image.exif.aperture}</span>
				{/if}
				{#if image.exif.shutterSpeed}
					<span>{image.exif.shutterSpeed}s</span>
				{/if}
				{#if image.exif.iso}
					<span>ISO {image.exif.iso}</span>
				{/if}
				{#if image.exif.dateTaken}
					<span>{image.exif.dateTaken}</span>
				{/if}
			</div>
		{/if}

		<button
			class="text-accent absolute top-1/2 right-1 z-[10000] -translate-y-1/2 cursor-pointer overflow-visible border-none bg-transparent px-4 py-8 text-3xl transition-transform duration-200 hover:scale-110 md:right-4 md:px-8 md:py-16 md:text-5xl"
			onclick={onnext}
			aria-label="Next image"
		>
			<span class="block scale-y-[1.5] transition-transform duration-500">&#8250;</span>
		</button>

		<div class="counter">
			<span class="text-accent">{currentIndex + 1}</span> / {images.length}
		</div>
	</div>
{/if}

<style>
	.lightbox {
		position: fixed;
		inset: 0;
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(0, 0, 0, 0.95);
		cursor: pointer;
		overflow: visible;
	}

	.lightbox-img {
		max-width: 70vw;
		max-height: 85vh;
		object-fit: contain;
		display: block;
		pointer-events: none;
	}

	.lightbox-img.loading {
		opacity: 0;
		pointer-events: none;
	}

	.counter {
		position: absolute;
		bottom: 1rem;
		left: 50%;
		transform: translateX(-50%);
		color: rgba(255, 255, 255, 0.6);
		font-size: 0.875rem;
		pointer-events: none;
	}

	.exif-bar {
		position: absolute;
		bottom: 2.5rem;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 1rem;
		align-items: center;
		background: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(8px);
		border-radius: 0.5rem;
		padding: 0.5rem 1rem;
		color: rgba(255, 255, 255, 0.8);
		font-size: 0.8rem;
		pointer-events: none;
		white-space: nowrap;
	}

	.loading {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.spinner {
		width: 2rem;
		height: 2rem;
		border: 2px solid rgba(255, 255, 255, 0.2);
		border-top-color: rgba(255, 255, 255, 0.8);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
