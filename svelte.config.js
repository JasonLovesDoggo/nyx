import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: [vitePreprocess(), mdsvex()],
	kit: {
		adapter: adapter(),
		alias: {
			$components: 'src/components',
			$utils: 'src/lib/utils',
			$types: 'src/lib/types',
			$content: 'content'
		}
	},
	extensions: ['.svelte', '.svx']
};

export default config;
