export function useLightboxNav(imageCount: () => number) {
	let open = $state(false);
	let currentIndex = $state(0);

	function openAt(index: number) {
		currentIndex = index;
		open = true;
	}

	function close() {
		open = false;
	}

	function prev() {
		const len = imageCount();
		currentIndex = (currentIndex - 1 + len) % len;
	}

	function next() {
		currentIndex = (currentIndex + 1) % imageCount();
	}

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
