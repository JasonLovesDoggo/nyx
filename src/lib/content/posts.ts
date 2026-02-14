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

const includeDrafts = import.meta.env.DEV;
const draftSortFallback = Number.MIN_SAFE_INTEGER;

const parsePublishedAt = (value?: string): number | null => {
	if (!value) {
		return null;
	}
	const timestamp = new Date(value).getTime();
	return Number.isNaN(timestamp) ? null : timestamp;
};

const getSortValue = (entry: PostEntry) =>
	parsePublishedAt(entry.metadata.published_at) ?? draftSortFallback;

const isPublished = (entry: PostEntry) => parsePublishedAt(entry.metadata.published_at) !== null;

const postService = createContentService<PostMetadata>({
	modules: import.meta.glob('/content/posts/*/+page.svx'),
	contentType: 'post',
	slugFromPath: (path) => {
		const cleaned = path.replace(/\/\+page\.svx$/, '');
		return cleaned.substring(cleaned.lastIndexOf('/') + 1);
	},
	filter: (entry) => includeDrafts || isPublished(entry),
	sort: (a, b) => getSortValue(b) - getSortValue(a),
	validate: (meta: unknown, slug: string): meta is PostMetadata => {
		const m = meta as Record<string, unknown>;
		if (!m.title || typeof m.title !== 'object') {
			throw new Error(`[post] "${slug}": missing or invalid "title" (expected { text, config? })`);
		}
		const title = m.title as Record<string, unknown>;
		if (typeof title.text !== 'string' || !title.text) {
			throw new Error(`[post] "${slug}": missing "title.text"`);
		}
		if (typeof m.description !== 'string' || !m.description) {
			throw new Error(`[post] "${slug}": missing "description"`);
		}
		return true;
	}
});

export const getAllPosts = postService.getAll;
export const getPostBySlug = postService.getBySlug;

const POST_COUNT = 4;
export const getLatestPosts = () => postService.getLatest(POST_COUNT);
