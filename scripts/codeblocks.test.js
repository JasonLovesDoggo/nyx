import assert from 'node:assert/strict';
import test from 'node:test';
import { initCodeBlocks } from '../src/lib/client/codeblocks.ts';

test('copies only rendered source, preserves whitespace/Unicode, and supports clipboard fallback', async (t) => {
	const documentDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'document');
	const navigatorDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
	const originalTimeout = globalThis.setTimeout;
	const timers = [];
	t.after(() => {
		for (const timer of timers) clearTimeout(timer);
		globalThis.setTimeout = originalTimeout;
		if (documentDescriptor) Object.defineProperty(globalThis, 'document', documentDescriptor);
		else delete globalThis.document;
		Object.defineProperty(globalThis, 'navigator', navigatorDescriptor);
	});
	globalThis.setTimeout = (...args) => {
		const timer = originalTimeout(...args);
		timers.push(timer);
		return timer;
	};

	const source = '  const example = "<tag> & ` ${literal} café 😀";\n\t// comment\n\n';
	let listener;
	let bindings = 0;
	let copied;
	let fallback;
	let removed = false;
	const button = {
		dataset: {},
		closest(selector) {
			assert.equal(selector, '.code-block');
			return {
				querySelector(selector) {
					assert.equal(selector, 'pre code');
					return { textContent: source };
				}
			};
		},
		removeAttribute() {}
	};
	Object.defineProperty(globalThis, 'document', {
		configurable: true,
		value: {
			addEventListener(type, callback) {
				assert.equal(type, 'click');
				bindings++;
				listener = callback;
			},
			createElement(tag) {
				assert.equal(tag, 'textarea');
				fallback = { style: {}, setAttribute() {}, select() {} };
				return fallback;
			},
			body: {
				appendChild() {},
				removeChild() {
					removed = true;
				}
			},
			execCommand(command) {
				assert.equal(command, 'copy');
				copied = fallback.value;
				return true;
			}
		}
	});
	Object.defineProperty(globalThis, 'navigator', {
		configurable: true,
		value: {
			clipboard: {
				writeText: async (value) => {
					copied = value;
				}
			}
		}
	});
	initCodeBlocks();
	initCodeBlocks();
	assert.equal(bindings, 1, 'delegation is not bound twice');
	const event = { target: { closest: () => button } };
	await listener(event);
	assert.equal(copied, source);
	assert.equal(button.dataset.copied, 'true');

	navigator.clipboard.writeText = async () => {
		throw new Error('permission denied');
	};
	copied = undefined;
	await listener(event);
	assert.equal(copied, source);
	assert.equal(removed, true, 'fallback textarea is cleaned up');
	assert.equal(button.dataset.copied, 'true');
	await listener({ target: { closest: () => null } });
});
