export interface ExifData {
	camera: string | null;
	aperture: number | null;
	shutterSpeed: string | null;
	iso: number | null;
	focalLength: number | null;
	dateTaken: string | null;
}

export interface ImageVariant {
	width: number;
	format: 'webp' | 'jpeg';
	url: string;
	size?: number;
}

export interface PhotoData {
	id: string;
	alt: string;
	originalWidth: number;
	originalHeight: number;
	exif: ExifData;
	hash: string;
	variants: ImageVariant[];
}

export interface PhotoGalleryData {
	images: PhotoData[];
	r2BaseUrl: string;
}

export interface Manifest {
	version: number;
	r2BaseUrl: string;
	images: PhotoData[];
}
