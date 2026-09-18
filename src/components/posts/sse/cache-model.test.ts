/// <reference types="bun" />
import { describe, expect, test } from 'bun:test';
import { actions, replay } from './cache-model';

describe('shared topic cache demonstration', () => {
	test('new connections inherit the union without mutating older snapshots', () => {
		expect(replay(2).shared).toEqual([
			{ fan: 'A', topics: ['A'] },
			{ fan: 'B', topics: ['A', 'B'] }
		]);
	});
	test('disconnect removes index membership but leaves the cache for the next connection', () => {
		const state = replay(4);
		expect(state.cache).toEqual(['A', 'B', 'C']);
		expect(state.shared).toEqual([
			{ fan: 'B', topics: ['A', 'B'] },
			{ fan: 'C', topics: ['A', 'B', 'C'] }
		]);
		expect(state.isolated).toEqual([
			{ fan: 'B', topics: ['B'] },
			{ fan: 'C', topics: ['C'] }
		]);
	});
	test('reconnection copies the accumulated cache', () => {
		expect(replay(5).shared.find((connection) => connection.fan === 'A')?.topics).toEqual([
			'A',
			'B',
			'C'
		]);
	});
	test('only the last disconnect clears the shared cache', () => {
		expect(replay(actions.length - 1).cache).toEqual(['A', 'B', 'C']);
		expect(replay(actions.length)).toEqual({ cache: [], shared: [], isolated: [] });
	});
});
