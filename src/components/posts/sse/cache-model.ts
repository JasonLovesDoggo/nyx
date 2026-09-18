export type Fan = 'A' | 'B' | 'C';
type Action = { kind: 'connect' | 'disconnect'; fan: Fan; label: string };
export type Connection = { fan: Fan; topics: Fan[] };

export const actions: Action[] = [
	{ kind: 'connect', fan: 'A', label: 'Fan A connects' },
	{ kind: 'connect', fan: 'B', label: 'Fan B connects' },
	{ kind: 'disconnect', fan: 'A', label: 'Fan A disconnects' },
	{ kind: 'connect', fan: 'C', label: 'Fan C connects' },
	{ kind: 'connect', fan: 'A', label: 'Fan A reconnects' },
	{ kind: 'disconnect', fan: 'B', label: 'Fan B disconnects' },
	{ kind: 'disconnect', fan: 'C', label: 'Fan C disconnects' },
	{ kind: 'disconnect', fan: 'A', label: 'The last fan disconnects' }
];

// One authorized topic per fan, with at most one live connection per fan in this example.
export function replay(steps: number) {
	let cache: Fan[] = [];
	let shared: Connection[] = [];
	let isolated: Connection[] = [];
	for (const action of actions.slice(0, steps)) {
		if (action.kind === 'connect') {
			cache = [...new Set([...cache, action.fan])];
			shared = [...shared, { fan: action.fan, topics: [...cache] }];
			isolated = [...isolated, { fan: action.fan, topics: [action.fan] }];
		} else {
			shared = shared.filter((connection) => connection.fan !== action.fan);
			isolated = isolated.filter((connection) => connection.fan !== action.fan);
			if (shared.length === 0) cache = [];
		}
	}
	return { cache, shared, isolated };
}
