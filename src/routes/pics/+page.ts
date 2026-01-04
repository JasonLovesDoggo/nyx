import type { PageLoad } from './$types';
import type { PhotoData } from '$types/photos';

export const load: PageLoad = async () => {
	const imageModules = import.meta.glob(
		'/src/content/images/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}',
		{
			import: 'default',
			eager: true,
			query: {
				enhanced: true,
				w: '2000;1200;800'
			}
		}
	);

	const images: PhotoData[] = Object.entries(imageModules).map(([path, module]) => {
		const filename =
			path
				.split('/')
				.pop()
				?.replace(/\.[^/.]+$/, '') || '';
		return {
			id: filename,
			src: module as any,
			alt: filename.replace(/[-_]/g, ' '),
			path
		};
	});

	images.sort((a, b) => b.id.localeCompare(a.id));

	return { images };
};

export const prerender = true;
