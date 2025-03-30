import { purgeCSSPlugin } from '@fullhuman/postcss-purgecss';
import autoprefixer from 'autoprefixer';
import tailwindPostCSS from '@tailwindcss/postcss';

export default {
	plugins: [
		tailwindPostCSS, // Use the new Tailwind PostCSS package
		autoprefixer,
		purgeCSSPlugin({
			content: ['./src/**/*.{html,js,svelte,ts}'],
			defaultExtractor: (content) =>
				content.match(/[^<>'\"`\\s]*[^<>'\"`\\s:]/g) || [],
		}),
	],
};
