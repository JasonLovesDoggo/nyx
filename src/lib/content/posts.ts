import { createContentService, type ContentEntry } from './factory';

export interface PostImage {
	url: string;
	alt: string;
}

export interface PostMetadata {
	title: string;
	description: string;
	image?: PostImage;
	updated_at?: string;
	published_at?: string; // if it's not set, it won't be published
	tags?: string[];
}

export type PostEntry = ContentEntry<PostMetadata>;

const postService = createContentService<PostMetadata>({
	modules: import.meta.glob('/content/posts/*.svx', { eager: true }),
	contentType: 'post',
	filter: (p) => {
		const publishedAt = p.metadata?.published_at;
		return !!publishedAt && !isNaN(new Date(publishedAt).getTime());
	},
	sort: (a, b) => +new Date(b.metadata.published_at!) - +new Date(a.metadata.published_at!)
});

export const getAllPosts = postService.getAll;
export const getPostBySlug = postService.getBySlug;

const POST_COUNT = 2;
export const getLatestPosts = () => postService.getLatest(POST_COUNT);
