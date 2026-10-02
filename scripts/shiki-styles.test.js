import assert from 'node:assert/strict';
import test from 'node:test';
import { escapeTemplateLiteral, rehypeShikiStyles } from './shiki-styles.js';

const block = (css, html = '<pre>source</pre>') => ({
	type: 'raw',
	value: `{@html \`<style data-shiki>${escapeTemplateLiteral(css)}</style>${html}\` }`
});
const tree = (...children) => ({ type: 'root', children });
const html = (node) => new Function(`return ${node.value.slice(7, -2)}`)();

test('deduplicates overlapping rules across nested code blocks', () => {
	const first = block('.tk-a{--shiki-mocha:#fff}.tk-b{--shiki-mocha:#000}');
	const second = block('.tk-a{--shiki-mocha:#fff}.tk-c{--shiki-mocha:#abc}');
	rehypeShikiStyles()(tree(first, { type: 'element', children: [second] }));
	assert.equal((first.value.match(/<style>/g) ?? []).length, 1);
	assert.equal((first.value.match(/\.tk-a\{/g) ?? []).length, 1);
	assert.match(first.value, /\.tk-b\{/);
	assert.match(first.value, /\.tk-c\{/);
	assert.equal(html(second), '<pre>source</pre>');
	assert.doesNotMatch(first.value, /data-shiki|&#123;|&#125;/);
});

test('styles stay local to each document, including repeated and concurrent builds', () => {
	const transform = rehypeShikiStyles();
	const first = block('.tk-a{--shiki-mocha:#fff}');
	const other = block('.tk-b{--shiki-mocha:#000}');
	const repeat = block('.tk-a{--shiki-mocha:#fff}');
	for (const node of [first, other, repeat]) transform(tree(node));
	assert.equal(first.value, repeat.value);
	assert.doesNotMatch(other.value, /\.tk-a/);
	assert.doesNotMatch(first.value, /\.tk-b/);
});

test('leaves documents without highlighted code and unrelated HTML unchanged', () => {
	const unrelated = { type: 'raw', value: '<style>.custom{color:red}</style>' };
	const plain = tree(unrelated, { type: 'text', value: 'hello' });
	const original = structuredClone(plain);
	rehypeShikiStyles()(plain);
	assert.deepEqual(plain, original);
});

test('escapes backslashes, backticks and interpolation without encoding CSS braces', () => {
	const value = 'a{--text:"` ${notExecuted} \\"}';
	const escaped = escapeTemplateLiteral(value);
	assert.equal(new Function(`return \`${escaped}\``)(), value);
	assert.doesNotMatch(escaped, /&#123;|&#125;/);
});

test('preserves escaped CSS values through collection and minification', () => {
	const node = block('.tk-a{--text:"` ${notExecuted} \\\\path"}');
	rehypeShikiStyles()(tree(node));
	assert.match(html(node), /\$\{notExecuted\}/);
	assert.match(html(node), /\\\\path/);
});
