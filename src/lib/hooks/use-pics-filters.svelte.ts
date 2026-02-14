import { page } from '$app/state';
import { goto } from '$app/navigation';
import { SvelteMap, SvelteSet, SvelteURLSearchParams } from 'svelte/reactivity';
import type { PhotoData } from '$types/photos';

// Each filter dimension: a URL param key and a function to extract the
// comparable value from a photo. Adding a new filter (e.g. tags) is just
// one more entry here plus a line in the template.
//
// Tags upgrade path: add `tags: string[]` to PhotoData, then add a
// `tag` extractor here. The multi-select machinery already handles
// arrays, so tag pills in the template would work identically to
// camera/year pills.
const FILTER_EXTRACTORS: Record<string, (img: PhotoData) => string | null> = {
	camera: (img) => img.exif.camera,
	year: (img) => img.exif.dateTaken?.substring(0, 4) ?? null
};

export type FilterKey = keyof typeof FILTER_EXTRACTORS;

export function usePicsFilters(getImages: () => PhotoData[]) {
	const selectedCameras = $derived(page.url.searchParams.getAll('camera'));
	const selectedYears = $derived(page.url.searchParams.getAll('year'));

	const selections = $derived({
		camera: selectedCameras,
		year: selectedYears
	} as Record<FilterKey, string[]>);

	const isFiltering = $derived(selectedCameras.length > 0 || selectedYears.length > 0);

	const uniqueCameras = $derived.by(() => {
		const counts = new SvelteMap<string, number>();
		for (const img of getImages()) {
			const cam = img.exif.camera;
			if (cam) counts.set(cam, (counts.get(cam) ?? 0) + 1);
		}
		return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([cam]) => cam);
	});

	const uniqueYears = $derived(
		[
			...new SvelteSet(
				getImages()
					.map((img) => img.exif.dateTaken?.substring(0, 4))
					.filter((y): y is string => y != null)
			)
		].sort((a, b) => b.localeCompare(a))
	);

	const filtered = $derived(
		getImages().filter((img) => {
			for (const [key, extract] of Object.entries(FILTER_EXTRACTORS)) {
				const selected = selections[key];
				if (selected.length > 0) {
					const value = extract(img);
					if (!value || !selected.includes(value)) return false;
				}
			}
			return true;
		})
	);

	function toggleFilter(key: FilterKey, value: string) {
		const params = new SvelteURLSearchParams(page.url.searchParams);
		const current = params.getAll(key);
		if (current.includes(value)) {
			params.delete(key, value);
		} else {
			params.append(key, value);
		}
		const str = params.toString();
		goto(str ? `?${str}` : page.url.pathname, { replaceState: true, noScroll: true });
	}

	function clearFilter(key: FilterKey) {
		const params = new SvelteURLSearchParams(page.url.searchParams);
		params.delete(key);
		const str = params.toString();
		goto(str ? `?${str}` : page.url.pathname, { replaceState: true, noScroll: true });
	}

	function clearAll() {
		goto(page.url.pathname, { replaceState: true, noScroll: true });
	}

	return {
		get selectedCameras() {
			return selectedCameras;
		},
		get selectedYears() {
			return selectedYears;
		},
		get isFiltering() {
			return isFiltering;
		},
		get uniqueCameras() {
			return uniqueCameras;
		},
		get uniqueYears() {
			return uniqueYears;
		},
		get filtered() {
			return filtered;
		},
		toggleFilter,
		clearFilter,
		clearAll
	};
}
