<script lang="ts">
	import { accentColorNames } from '$lib/stores/theme';
	let gridElement = $state<HTMLElement | null>(null);
	const rows = 5;
	const columns = 5;

	let lastHovered = $state(-1);
	let isMouseDown = $state(false);
	let prevDown = $state<{ [key: number]: boolean }>({});
	let lastAccentIndex = $state(0);

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

		// hoveredChild.classList.add('hovered');

		if (cellIndex >= 0 && hoveredChild) {
			if (!prevDown[cellIndex] && isMouseDown) {
				let clickBgValue = '';
				let currentColorName;
				currentColorName = accentColorNames[lastAccentIndex];
				lastAccentIndex = (lastAccentIndex + 1) % accentColorNames.length; // Prepare for next
				// clickBgValue = `color-mix(in srgb, var(--color-${currentColorName}) 60%, transparent)`;
				clickBgValue = `var(--color-${currentColorName})`;
				hoveredChild.style.setProperty('background', clickBgValue);
			}

			if (isMouseDown) {
				hoveredChild.classList.add('clicked');
			}
		}

		const lastHoveredChild = gridElement.children[lastHovered] as HTMLElement;
		if (lastHoveredChild) {
			lastHoveredChild.classList.remove('hovered', 'clicked');
		}
		prevDown[lastHovered] = false;

		lastHovered = cellIndex;
		if (cellIndex >= 0) {
			prevDown[cellIndex] = isMouseDown;
		}
	};

	// Controls we must never steal the mousedown from (focus, clicks, typing).
	const INTERACTIVE_SELECTOR =
		'a, button, input, textarea, select, label, summary, [role="button"], [contenteditable]';

	const caretFromPoint = (x: number, y: number): { node: Node; offset: number } | null => {
		const doc = document as Document & {
			caretPositionFromPoint?(cx: number, cy: number): { offsetNode: Node; offset: number } | null;
		};
		if (typeof doc.caretPositionFromPoint === 'function') {
			const pos = doc.caretPositionFromPoint(x, y);
			return pos ? { node: pos.offsetNode, offset: pos.offset } : null;
		}
		if (typeof doc.caretRangeFromPoint === 'function') {
			const range = doc.caretRangeFromPoint(x, y);
			return range ? { node: range.startContainer, offset: range.startOffset } : null;
		}
		return null;
	};

	// Did the press actually land on rendered text? Browsers snap the caret to the
	// nearest text node even when you click in the empty end-of-line margin, so we
	// confirm the pixel sits inside one of the text's line boxes.
	const startedOnText = (x: number, y: number): boolean => {
		const hit = caretFromPoint(x, y);
		if (!hit || hit.node.nodeType !== Node.TEXT_NODE) return false;
		if (!(hit.node.textContent ?? '').trim()) return false;

		const range = document.createRange();
		range.selectNodeContents(hit.node);
		return Array.from(range.getClientRects()).some(
			(r) => x >= r.left && x <= r.right && y >= r.top && y <= r.bottom
		);
	};

	const shouldKeepSelection = (event: MouseEvent): boolean => {
		const target = event.target as Element | null;
		if (target?.closest(INTERACTIVE_SELECTOR)) return true;
		return startedOnText(event.clientX, event.clientY);
	};

	$effect(() => {
		const handleMouseMove = (event: MouseEvent) => render(event);
		const handleMouseLeave = () => render({ clientX: -1, clientY: -1 });
		const handleMouseDown = (event: MouseEvent) => {
			isMouseDown = true;
			// Primary-button drags that don't start on text drive the background
			// effect, so suppress the browser's native drag-select for them.
			if (event.button === 0 && !shouldKeepSelection(event)) {
				event.preventDefault();
			}
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
		document.addEventListener('mousedown', handleMouseDown, { capture: true });
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
	<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
	{#each Array(rows * columns) as _, i (i)}
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
		filter: blur(16px) brightness(0.6);
		grid-template-columns: repeat(var(--grid-columns, 5), 1fr);
		transform: scale(1.05);
	}

	#bg-grid div {
		background: var(--color-bg);
		transition:
			75ms background linear /* fades between colors */,
			100ms opacity ease-out;
		opacity: 1;
	}

	#bg-grid div:not(.clicked) {
		animation: fadeAway 1400ms forwards;
	}

	@keyframes fadeAway {
		0% {
			opacity: 1;
		}
		60% {
			opacity: 0.9;
		}
		100% {
			opacity: 0;
		}
	}
</style>
