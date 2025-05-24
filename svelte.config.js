import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-cloudflare';
import { escapeSvelte, mdsvex } from 'mdsvex';
import remarkToc from 'remark-toc';
import rehypeSlug from 'rehype-slug';
import { bundledLanguages, createHighlighter } from 'shiki';
import { transformerColorizedBrackets } from '@shikijs/colorized-brackets';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex-svelte';
import remarkGfm from 'remark-gfm';
import remarkAbbr from 'remark-abbr';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeUnwrapImages from 'rehype-unwrap-images';

const highlighter = await createHighlighter({
	langs: Object.keys(bundledLanguages),
	themes: ['catppuccin-mocha', 'catppuccin-macchiato', 'catppuccin-frappe', 'catppuccin-latte']
});

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.svx'],
	// layout: {
	// 	_: 'src/mdsvex.svelte'
	// },
	highlight: {
		highlighter: async (code, lang = 'text') => {
			let rawcode = highlighter.codeToHtml(code, {
				lang,
				themes: {
					mocha: 'catppuccin-mocha',
					latte: 'catppuccin-latte',
					frappe: 'catppuccin-frappe',
					macchiato: 'catppuccin-macchiato'
				},
				defaultColor: false,
				transformers: [transformerColorizedBrackets()]
			});
			const html = escapeSvelte(rawcode);
			return `{@html \`${html}\` }`;
		}
	},
	remarkPlugins: [remarkToc, remarkMath, remarkAbbr, remarkGfm],
	rehypePlugins: [
		rehypeSlug,
		[
			rehypeAutolinkHeadings,
			{
				behavior: 'wrap',
				properties: {
					className: ['sec-anchor']
				}
			}
		],
		rehypeKatex,
		rehypeUnwrapImages
	]
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
	kit: {
		adapter: adapter(),
		alias: {
			$components: 'src/components',
			$utils: 'src/lib/utils',
			$types: 'src/lib/types',
			$content: 'content',
			$static: 'static'
		}
	},
	extensions: ['.svelte', '.svx']
};

export default config;
