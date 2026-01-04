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
import { parse } from 'smol-toml';
import rehypeExternalLinks from 'rehype-external-links';

const catppuccinThemes = {
	mocha: 'catppuccin-mocha',
	macchiato: 'catppuccin-macchiato',
	frappe: 'catppuccin-frappe',
	latte: 'catppuccin-latte'
};

const highlighter = await createHighlighter({
	langs: Object.keys(bundledLanguages),
	themes: Object.values(catppuccinThemes)
});

const htmlEscapes = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;',
	'`': '&#96;'
};

function escapeHtml(value = '') {
	return value.replace(/[&<>"'`]/g, (char) => htmlEscapes[char]);
}

function getCodeMeta(rawInfo = 'text') {
	const info = String(rawInfo ?? 'text').trim();
	if (!info) {
		return { lang: 'text', file: undefined };
	}
	const [langToken, ...rest] = info.split(/\s+/);
	const normalizedLang = langToken?.toLowerCase() || 'text';
	const remainder = rest.join(' ');
	const metaRegex = /\bfile=(?:"([^"]+)"|'([^']+)'|([^\s]+))/;
	const [, dQuoted, sQuoted, bare] = metaRegex.exec(remainder) ?? [];
	const file = dQuoted ?? sQuoted ?? bare;
	return {
		lang: normalizedLang,
		file
	};
}

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.svx'],
	// layout: {
	// 	_: 'src/mdsvex.svelte'
	// },
	frontmatter: {
		type: 'toml',
		marker: '~',
		parse: (frontmatter, messages) => {
			if (!frontmatter?.trim()) {
				return {};
			}
			try {
				return parse(frontmatter);
			} catch (e) {
				messages.push(
					'Parsing error on line ' + e.line + ', column ' + e.column + ': ' + e.message
				);
				return {};
			}
		}
	},
	highlight: {
		highlighter: async (code, lang = 'text', meta) => {
			const infoString = [lang, meta].filter(Boolean).join(' ');
			const { lang: parsedLang, file } = getCodeMeta(infoString);
			const highlightLang = parsedLang || 'text';
			let highlighted;
			try {
				highlighted = highlighter.codeToHtml(code, {
					lang: highlightLang,
					themes: catppuccinThemes,
					defaultColor: false,
					transformers: [transformerColorizedBrackets()]
				});
			} catch (error) {
				console.warn(`Failed to highlight language "${infoString}". Falling back to text.`, error);
				highlighted = highlighter.codeToHtml(code, {
					lang: 'text',
					themes: catppuccinThemes,
					defaultColor: false,
					transformers: [transformerColorizedBrackets()]
				});
			}
			const encoded = escapeHtml(Buffer.from(code).toString('base64'));
			const safeLang = escapeHtml(highlightLang);
			const safeFile = file ? escapeHtml(file) : '';
			const showLang = highlightLang && highlightLang !== 'text';
			const copyButton = (floating = false) => `<button type="button" class="code-block__copy${
				floating ? ' code-block__copy--floating' : ''
			}" aria-label="Copy code" data-code="${encoded}">
				<svg class="icon-copy" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<rect x="9" y="9" width="13" height="13" rx="2"></rect>
					<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
				</svg>
				<svg class="icon-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<polyline points="20 6 9 17 4 12"></polyline>
				</svg>
				<span class="sr-only">Copy code</span>
			</button>`;

			const block = `<figure class="code-block" data-codeblock data-lang="${safeLang}"${
				file ? ` data-file="${safeFile}"` : ''
			}>
		${file ? `<figcaption class="code-block__caption" title="${safeFile}">${safeFile}</figcaption>` : ''}
		<div class="code-block__body${showLang ? '' : ' code-block__body--nolabel'}">
			${copyButton(true)}
			${showLang ? `<div class="code-block__meta-row"><span class="code-block__lang">${safeLang}</span></div>` : ''}
			${highlighted}
		</div>
	</figure>`;
			const escaped = escapeSvelte(block);
			return `{@html \`${escaped}\` }`;
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
		[
			rehypeExternalLinks,
			{
				target: '_blank',
				rel: ['noopener', 'noreferrer'],
				protocols: ['http', 'https'] // 👈 only these count as external
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
