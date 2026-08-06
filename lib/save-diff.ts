// Relative imports with explicit extensions, for the same reason as
// `save-utils`: this module is loaded by plain Node under `node --test`, where
// the `@/*` alias does not resolve.
import type { PathSegment, SaveData } from './save-utils.ts';

export type SaveChange = {
	path: PathSegment[];
	/** `undefined` when the key did not exist on the imported save. */
	from: unknown;
	/** `undefined` when the edit removed the key. */
	to: unknown;
};

/**
 * A diff is a review aid, not a report: past a few dozen rows nobody reads it,
 * and a save with thousands of changed leaves (a hand-edited JSON import, say)
 * would spend longer rendering than encoding.
 */
export const MAX_CHANGES = 200;

/**
 * Ceiling on how many nodes a single diff walks. Edits made through the store
 * are copy-on-write, so the reference check below normally prunes the walk to
 * the handful of containers that were actually touched — this only matters for
 * a save that lost its structural sharing (a `structuredClone` somewhere, or a
 * fresh decode compared against an unrelated save), where the walk would
 * otherwise cover every node of a multi-megabyte object.
 */
const MAX_VISITED_NODES = 50_000;

/**
 * How many entries a container has to hold before emptying it is reported as
 * one summary row instead of one row per key.
 */
const SUMMARISE_CLEARED_ABOVE = 4;

type Walk = {
	changes: SaveChange[];
	visited: number;
	truncated: boolean;
};

function isPlainContainer(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

/**
 * Number of leaves under a container, used to summarise a subtree that was
 * replaced wholesale (clearing transcension history, for one) instead of
 * listing every leaf inside it.
 */
export function countEntries(value: unknown): number {
	if (!isPlainContainer(value)) {
		return value === undefined ? 0 : 1;
	}

	return Object.keys(value).length;
}

function record(walk: Walk, path: PathSegment[], from: unknown, to: unknown) {
	if (walk.changes.length >= MAX_CHANGES) {
		walk.truncated = true;
		return;
	}

	walk.changes.push({ path, from, to });
}

function walkNode(walk: Walk, path: PathSegment[], from: unknown, to: unknown) {
	// Copy-on-write means an untouched subtree is still the *same object*, so
	// identity alone prunes almost the entire save on a normal edit.
	if (from === to) {
		return;
	}

	walk.visited += 1;
	if (walk.visited > MAX_VISITED_NODES || walk.changes.length >= MAX_CHANGES) {
		walk.truncated = true;
		return;
	}

	// One side is a primitive, missing, or otherwise not a container: the
	// identity check above already settled every case where they match.
	if (!isPlainContainer(from) || !isPlainContainer(to)) {
		record(walk, path, from, to);
		return;
	}

	// An array that changed length is reported as one row rather than as a
	// per-index diff: the indices shift and the row-by-row output is noise.
	if (Array.isArray(from) !== Array.isArray(to)) {
		record(walk, path, from, to);
		return;
	}

	if (Array.isArray(from) && Array.isArray(to) && from.length !== to.length) {
		record(walk, path, from, to);
		return;
	}

	// A container that was emptied wholesale — clearing transcension history is
	// the one in the UI — is a single deliberate action, and "412 entries →
	// empty" beats 412 rows saying the same thing. Small containers are still
	// listed key by key, because "Achievement · Clickety Clack: Yes → —" is
	// more use than "Achievements: 3 entries → empty", and growth in the other
	// direction always recurses: filling a container one key at a time is what
	// unlocking an achievement looks like.
	if (Object.keys(to).length === 0 && Object.keys(from).length > SUMMARISE_CLEARED_ABOVE) {
		record(walk, path, from, to);
		return;
	}

	const keys = new Set([...Object.keys(from), ...Object.keys(to)]);

	for (const key of keys) {
		if (walk.changes.length >= MAX_CHANGES) {
			walk.truncated = true;
			return;
		}

		const segment: PathSegment = Array.isArray(from) ? Number(key) : key;
		walkNode(walk, [...path, segment], from[key], to[key]);
	}
}

export type SaveDiff = {
	changes: SaveChange[];
	/** True when the walk hit `MAX_CHANGES` or the node budget and gave up. */
	truncated: boolean;
};

/**
 * Compares the save as imported against the save as edited.
 *
 * Only leaves are reported, except where a container was replaced by something
 * of a different shape — that is reported as a single change so the caller can
 * summarise it ("42 entries → empty") rather than printing its contents.
 */
export function diffSaveData(original: SaveData | null, current: SaveData | null): SaveDiff {
	if (!original || !current || original === current) {
		return { changes: [], truncated: false };
	}

	const walk: Walk = { changes: [], visited: 0, truncated: false };
	walkNode(walk, [], original, current);

	return { changes: walk.changes, truncated: walk.truncated };
}
