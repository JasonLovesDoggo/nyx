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
</script>

<svelte:window onkeydown={handleKeydown} />

<div
	class="lightbox"
	onclick={handleBackdropClick}
	onkeydown={handleKeydown}
	role="button"
	tabindex="-1"
>
	<button class="nav prev" onclick={onprev} aria-label="Previous image"
		><span class="arrow">&lt;</span></button
	>

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

	<button class="nav next" onclick={onnext} aria-label="Next image"
		><span class="arrow">&gt;</span></button
	>

	<div class="counter">{currentIndex + 1} / {images.length}</div>
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

	.nav {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		color: rgba(255, 255, 255, 0.4);
		font-size: 3rem;
		cursor: pointer;
		padding: 2rem 1.5rem;
		transition: color 0.2s;
		z-index: 10000;
	}

	.nav .arrow {
		display: block;
		transform: scaleY(3);
		font-weight: 200;
	}

	.nav:hover {
		color: rgba(255, 255, 255, 0.7);
	}

	.nav.prev {
		left: 1rem;
	}

	.nav.next {
		right: 1rem;
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
