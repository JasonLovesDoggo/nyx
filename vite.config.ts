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

		server: { fs: { allow: ['.'] } }
	};
});
