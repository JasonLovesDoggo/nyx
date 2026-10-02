import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { brotliCompressSync, gzipSync } from 'node:zlib';

// Run after `bun run build`. Compression is measured per file, not as one
// artificially concatenated bundle. Totals include all routes, not one page load.
async function filesIn(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	return (
		await Promise.all(
			entries.map((entry) => {
				const file = path.join(directory, entry.name);
				return entry.isDirectory() ? filesIn(file) : [file];
			})
		)
	).flat();
}

function measure(buffer) {
	return {
		raw: buffer.length,
		gzip: gzipSync(buffer, { level: 9 }).length,
		brotli: brotliCompressSync(buffer).length
	};
}

const files = await filesIn('.svelte-kit/output/client');
const results = {};
for (const extension of ['.js', '.css']) {
	const matching = files.filter((file) => file.endsWith(extension));
	const totals = { raw: 0, gzip: 0, brotli: 0, files: matching.length };
	for (const file of matching) {
		const sizes = measure(await readFile(file));
		for (const key of ['raw', 'gzip', 'brotli']) totals[key] += sizes[key];
	}
	results[`client${extension}`] = totals;
}
for (const name of ['tutorials', 'posts', 'projects']) {
	try {
		results[`server ${name}.js`] = measure(
			await readFile(`.svelte-kit/output/server/chunks/${name}.js`)
		);
	} catch (error) {
		if (error.code !== 'ENOENT') throw error;
	}
}
console.log(JSON.stringify(results, null, 2));
