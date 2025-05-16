<script lang="ts">
	import { accentColorNames, RainbowBackend } from '$lib/stores/theme';

	let gridElement = $state<HTMLElement | null>(null);
	const rows = 5;
	const columns = 5;

	let lastHovered = $state(-1);
	let isMouseDown = $state(false);
	let prevDown = $state<{ [key: number]: boolean }>({});
	let lastAccentIndex = $state(0); // For cycling through accent colors in rainbow mode

	const render = (event: MouseEvent | { clientX: number; clientY: number }) => {
		if (!gridElement) return;

		const { clientX, clientY } = event;
		const rect = gridElement.getBoundingClientRect();

		const x = clientX - rect.left;
		const y = clientY - rect.top;

		const gridHeight = rect.height;
		const gridWidth = rect.width;

		const row = Math.floor((y * rows) / gridHeight);
		const column = Math.floor((x * columns) / gridWidth);

		let cellIndex = -1;
		if (row >= 0 && row < rows && column >= 0 && column < columns) {
			cellIndex = row * columns + column;
		}

		const hoveredChild = gridElement.children[cellIndex] as HTMLElement;

		// Directly use the store's value. Svelte's reactivity handles updates.
		const isRainbowActive = RainbowBackend;

		if (cellIndex >= 0 && hoveredChild) {
			if (!prevDown[cellIndex] && (isMouseDown || isRainbowActive)) {
				let clickBgValue = '';
				if (isRainbowActive) {
					const currentAccentName = accentColorNames[lastAccentIndex];
					lastAccentIndex = (lastAccentIndex + 1) % accentColorNames.length; // Prepare for next
					clickBgValue = `color-mix(in srgb, var(--color-${currentAccentName}) 50%, transparent)`;
				} else {
					// Not rainbow mode, use crust color
					// Assumes --theme-crust is defined globally
					clickBgValue = `color-mix(in srgb, var(--theme-crust) 50%, transparent)`;
				}
				hoveredChild.style.setProperty('background', clickBgValue);
			}

			hoveredChild.classList.add('hovered');
			// hoveredChild.classList.toggle('clicked', isMouseDown || (isRainbowActive as unknown as boolean));
			hoveredChild.classList.toggle(
				'hovered-fast-trans',
				!prevDown[cellIndex] && !(isMouseDown || isRainbowActive)
			);
		}

		if (lastHovered >= 0 && lastHovered !== cellIndex) {
			const lastHoveredChild = gridElement.children[lastHovered] as HTMLElement;
			if (lastHoveredChild) {
				lastHoveredChild.classList.remove('hovered', 'hovered-fast-trans', 'clicked');
			}
			prevDown[lastHovered] = false;
		}

		lastHovered = cellIndex;
		if (cellIndex >= 0) {
			prevDown[cellIndex] = isMouseDown || isRainbowActive;
		}
	};

	$effect(() => {
		const handleMouseMove = (event: MouseEvent) => render(event);
		const handleMouseLeave = () => render({ clientX: -1, clientY: -1 });
		const handleMouseDown = (event: MouseEvent) => {
			isMouseDown = true;
			render(event);
		};
		const handleMouseUp = (event: MouseEvent) => {
			isMouseDown = false;
			render(event);
		};
		const handleDragEnd = (event: DragEvent) => {
			isMouseDown = false;
			render(event as unknown as MouseEvent);
		};

		document.addEventListener('mousemove', handleMouseMove, { capture: true, passive: true });
		document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
		document.addEventListener('mousedown', handleMouseDown, { capture: true, passive: true });
		document.addEventListener('mouseup', handleMouseUp, { capture: true, passive: true });
		document.addEventListener('dragend', handleDragEnd, { capture: true, passive: true });

		return () => {
			document.removeEventListener('mousemove', handleMouseMove, { capture: true });
			document.removeEventListener('mouseleave', handleMouseLeave);
			document.removeEventListener('mousedown', handleMouseDown, { capture: true });
			document.removeEventListener('mouseup', handleMouseUp, { capture: true });
			document.removeEventListener('dragend', handleDragEnd, { capture: true });
		};
	});
</script>

<div id="bg-grid" aria-hidden="true" bind:this={gridElement}>
	{#each Array(rows * columns) as _, i}
		<div></div>
	{/each}
</div>

<style>
	#bg-grid {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: grid;
		z-index: -2;
		pointer-events: none;
		filter: blur(10px);
		grid-template-columns: repeat(var(--grid-columns, 5), 1fr);
		transform: scale(1.05);
	}

	#bg-grid div {
		background: var(--color-bg);
		transition: 800ms background linear;
	}

	#bg-grid div.hovered {
		background: var(--color-base);
	}

	#bg-grid div.hovered-fast-trans {
		transition: 100ms background linear;
	}

	/* --click-bg is set dynamically by the script and should include opacity */
	#bg-grid div.hovered {
		transition: 10ms background linear;
	}
</style>
