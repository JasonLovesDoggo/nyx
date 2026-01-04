import { createContentService, type ContentEntry, type ContentPageData } from './factory';

export interface PostImage {
	url: string;
	alt: string;
}

export interface PostMetadata {
	title: {
		text: string;
		config?: string;
		hash?: string;
	};
	description: string;
	image?: PostImage;
	updated_at?: string;
	published_at?: string; // if it's not set, it won't be published
	tags?: string[];
}

export type PostEntry = ContentEntry<PostMetadata>;
export type PostPageData = ContentPageData<PostMetadata>;

const postService = createContentService<PostMetadata>({
	modules: import.meta.glob('/content/posts/*/+page.svx'),
	contentType: 'post',
	slugFromPath: (path) => {
		const cleaned = path.replace(/\/\+page\.svx$/, '');
		return cleaned.substring(cleaned.lastIndexOf('/') + 1);
	},
	filter: (p) => {
		const publishedAt = p.metadata?.published_at;
		return !!publishedAt && !isNaN(new Date(publishedAt).getTime());
	},
	sort: (a, b) => +new Date(b.metadata.published_at!) - +new Date(a.metadata.published_at!)
});

export const getAllPosts = postService.getAll;
export const getPostBySlug = postService.getBySlug;

const POST_COUNT = 4;
export const getLatestPosts = () => postService.getLatest(POST_COUNT);
