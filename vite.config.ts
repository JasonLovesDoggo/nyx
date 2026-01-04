import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
// import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
	plugins: [
		enhancedImages(),
		tailwindcss(),
		sveltekit(),
		// visualizer({ emitFile: true, filename: 'stats.html' }),
		devtoolsJson()
	],

	server: { fs: { allow: ['.'] } }
});
