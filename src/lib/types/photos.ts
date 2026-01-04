import type { Picture } from 'imagetools-core';

export interface PhotoData {
	id: string;
	src: Picture;
	alt: string;
	path: string;
}

export interface PhotoGalleryData {
	images: PhotoData[];
}
