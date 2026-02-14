import type { PageLoad } from './$types';
import manifest from '../../content/images/manifest';

export const load: PageLoad = async () => {
	const images = [...manifest.images];

	// Newest first by date taken, fall back to reverse ID order
	images.sort((a, b) => {
		const dateA = a.exif.dateTaken ?? '';
		const dateB = b.exif.dateTaken ?? '';
		if (dateA && dateB) return dateB.localeCompare(dateA);
		if (dateA) return -1;
		if (dateB) return 1;
		return b.id.localeCompare(a.id);
	});

	return { images, r2BaseUrl: manifest.r2BaseUrl };
};
