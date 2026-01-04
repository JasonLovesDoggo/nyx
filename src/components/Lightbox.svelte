<script lang="ts">
	import type { Picture } from 'imagetools-core';

	type ImageData = {
		id: string;
		src: Picture;
	};

	type Props = {
		images: ImageData[];
		currentIndex: number;
		onclose: () => void;
		onprev: () => void;
		onnext: () => void;
	};

	let { images, currentIndex, onclose, onprev, onnext }: Props = $props();

	let image = $derived(images[currentIndex]);
	let isLoading = $state(false);
	let lightboxEl: HTMLDivElement | null = $state(null);

	// Swipe support
	let touchStartX = 0;
	let touchEndX = 0;

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
		}
	}

	function handleImageLoad() {
		isLoading = false;
	}

	$effect(() => {
		// Trigger loading whenever image changes
		currentIndex;
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
			touchStartX = e.touches[0].clientX;
		};

		const handleTouchMove = (e: TouchEvent) => {
			touchEndX = e.touches[0].clientX;
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

<svelte:window onkeydown={handleKeydown} />

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
		<span class="block scale-y-[1.5] transition-transform duration-200">‹</span>
	</button>

	{#if isLoading}
		<div class="loading">
			<div class="spinner"></div>
		</div>
	{/if}

	<picture class:loading={isLoading}>
		{#if image.src.sources?.avif}
			<source srcset={image.src.sources.avif} type="image/avif" />
		{/if}
		{#if image.src.sources?.webp}
			<source srcset={image.src.sources.webp} type="image/webp" />
		{/if}
		<img src={image.src.img.src} alt="" onload={handleImageLoad} />
	</picture>

	<button
		class="text-accent absolute top-1/2 right-1 z-[10000] -translate-y-1/2 cursor-pointer overflow-visible border-none bg-transparent px-4 py-8 text-3xl transition-transform duration-200 hover:scale-110 md:right-4 md:px-8 md:py-16 md:text-5xl"
		onclick={onnext}
		aria-label="Next image"
	>
		<span class="block scale-y-[1.5] transition-transform duration-200">›</span>
	</button>

	<div class="counter"><span class="text-accent">{currentIndex + 1}</span> / {images.length}</div>
</div>

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

	picture {
		max-width: 70vw;
		max-height: 85vh;
		pointer-events: none;
	}

	img {
		max-width: 100%;
		max-height: 85vh;
		object-fit: contain;
		display: block;
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

	picture.loading {
		opacity: 0;
		pointer-events: none;
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
