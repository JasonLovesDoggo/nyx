import { transform } from 'lightningcss';

// CSS goes inside mdsvex's {@html `...`}, not through escapeSvelte: <style>
// is a raw-text element, so encoding its braces as HTML entities breaks it.
export function escapeTemplateLiteral(value) {
	return value.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

const shikiStyle = /^\{@html `<style data-shiki>([\s\S]*?)<\/style>/;

/** Hoist generated token styles into one minified stylesheet per document. */
export function rehypeShikiStyles() {
	return (tree) => {
		// Keep collection local to this document. Sharing it across preprocess calls
		// would drop rules on rebuilds or leak styles between concurrent pages.
		const blocks = [];
		function visit(node) {
			if (node.type === 'raw') {
				const match = shikiStyle.exec(node.value);
				if (match) blocks.push({ node, match });
			}
			for (const child of node.children ?? []) visit(child);
		}
		visit(tree);
		if (!blocks.length) return;

		const css = blocks.map(({ match }) => match[1].replace(/\\([\\`$])/g, '$1')).join('\n');
		const minified = escapeTemplateLiteral(
			transform({ code: Buffer.from(css), minify: true }).code.toString()
		);
		for (const [index, { node, match }] of blocks.entries()) {
			const style = index === 0 ? `<style>${minified}</style>` : '';
			node.value = `{@html \`${style}${node.value.slice(match[0].length)}`;
		}
	};
}
