import { page } from '$app/state';
import { goto } from '$app/navigation';

interface LightboxImage {
	id: string;
}

export function useLightboxNav(getImages: () => LightboxImage[]) {
	let open = $state(false);
	let currentIndex = $state(0);
	let hasOpenedFromParam = false;

	function updateParam(id: string | null) {
		const params = new URLSearchParams(page.url.searchParams);
		if (id) {
			params.set('photo', id);
		} else {
			params.delete('photo');
		}
		const str = params.toString();
		goto(str ? `?${str}` : page.url.pathname, { replaceState: true, noScroll: true });
	}

	function openAt(index: number) {
		currentIndex = index;
		open = true;
		const images = getImages();
		if (images[index]) updateParam(images[index].id);
	}

	function close() {
		open = false;
		updateParam(null);
	}

	function prev() {
		const len = getImages().length;
		currentIndex = (currentIndex - 1 + len) % len;
		const images = getImages();
		if (images[currentIndex]) updateParam(images[currentIndex].id);
	}

	function next() {
		const images = getImages();
		currentIndex = (currentIndex + 1) % images.length;
		if (images[currentIndex]) updateParam(images[currentIndex].id);
	}

	// Auto-open from ?photo= param on initial page load only
	$effect(() => {
		const photoId = page.url.searchParams.get('photo');
		if (!photoId || hasOpenedFromParam) return;
		const images = getImages();
		const idx = images.findIndex((img) => img.id === photoId);
		if (idx !== -1) {
			hasOpenedFromParam = true;
			currentIndex = idx;
			open = true;
		}
	});

	return {
		get open() {
			return open;
		},
		get currentIndex() {
			return currentIndex;
		},
		openAt,
		close,
		prev,
		next
	};
}
