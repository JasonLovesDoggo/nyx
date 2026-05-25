import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
// import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ command }) => {
	const isBuild = command === 'build';

	return {
		plugins: [
			isBuild && enhancedImages(), // only enable when building for production
			tailwindcss(),
			sveltekit(),
			// visualizer({ emitFile: true, filename: 'stats.html' }),
			!isBuild && devtoolsJson()
		].filter(Boolean),

		build: {
			target: 'esnext', // modern browsers only: no legacy syntax, no polyfills
			modulePreload: { polyfill: false } // modern browsers support modulepreload natively
			// NOTE: deliberately no rollupOptions.output.manualChunks. SvelteKit already
			// route-splits the client and isolates lazy deps (leaflet is its own chunk via
			// dynamic import). A React-style per-package manualChunks is ignored for the
			// client build here and only reshapes the server worker bundle, so it's omitted.
		},

		server: { fs: { allow: ['.'] } }
	};
});
