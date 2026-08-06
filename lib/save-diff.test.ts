import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { countEntries, diffSaveData, MAX_CHANGES } from './save-diff.ts';
import { removeValueAtPath, setValueAtPath, setValuesAtPaths, type SaveData } from './save-utils.ts';

const sampleSave = (): SaveData => ({
	rubies: 10,
	gold: '1e21',
	heroCollection: {
		heroes: {
			'1': { level: 10, epicLevel: 0 },
			'2': { level: 25, epicLevel: 3 }
		}
	},
	achievements: { '1': true },
	stats: { transcensions: { '1': {}, '2': {}, '3': {}, '4': {}, '5': {}, '6': {} } },
	autoclickerSkins: [true, false]
});

describe('diffSaveData', () => {
	test('reports nothing for an unedited save', () => {
		const save = sampleSave();
		assert.deepEqual(diffSaveData(save, save), { changes: [], truncated: false });
	});

	test('reports nothing when either side is missing', () => {
		assert.equal(diffSaveData(null, sampleSave()).changes.length, 0);
		assert.equal(diffSaveData(sampleSave(), null).changes.length, 0);
	});

	test('reports a single edited leaf with its path, old and new value', () => {
		const original = sampleSave();
		const edited = setValueAtPath(original, ['rubies'], 500);

		assert.deepEqual(diffSaveData(original, edited).changes, [{ path: ['rubies'], from: 10, to: 500 }]);
	});

	test('reports nested edits with their full path', () => {
		const original = sampleSave();
		const edited = setValueAtPath(original, ['heroCollection', 'heroes', '2', 'level'], 4000);

		assert.deepEqual(diffSaveData(original, edited).changes, [
			{ path: ['heroCollection', 'heroes', '2', 'level'], from: 25, to: 4000 }
		]);
	});

	test('reports an added key as a change from undefined', () => {
		const original = sampleSave();
		const edited = setValueAtPath(original, ['achievements', '7'], true);

		assert.deepEqual(diffSaveData(original, edited).changes, [
			{ path: ['achievements', '7'], from: undefined, to: true }
		]);
	});

	test('reports a removed key as a change to undefined', () => {
		const original = sampleSave();
		const edited = removeValueAtPath(original, ['achievements', '1']);

		assert.deepEqual(diffSaveData(original, edited).changes, [
			{ path: ['achievements', '1'], from: true, to: undefined }
		]);
	});

	test('ignores an edit that lands back on the original value', () => {
		const original = sampleSave();
		const edited = setValueAtPath(original, ['rubies'], 10);

		assert.deepEqual(diffSaveData(original, edited).changes, []);
	});

	test('collects every change in a batched update', () => {
		const original = sampleSave();
		const edited = setValuesAtPaths(original, [
			{ path: ['rubies'], value: 1 },
			{ path: ['heroCollection', 'heroes', '1', 'epicLevel'], value: 2 }
		]);

		const paths = diffSaveData(original, edited).changes.map((change) => change.path.join('.'));
		assert.deepEqual(paths.sort(), ['heroCollection.heroes.1.epicLevel', 'rubies']);
	});

	test('summarises a replaced container as one change instead of its leaves', () => {
		const original = sampleSave();
		const edited = setValueAtPath(original, ['stats', 'transcensions'], {});
		const { changes } = diffSaveData(original, edited);

		assert.equal(changes.length, 1);
		assert.deepEqual(changes[0].path, ['stats', 'transcensions']);
		assert.equal(countEntries(changes[0].from), 6);
		assert.equal(countEntries(changes[0].to), 0);
	});

	test('still lists the keys when a small container is emptied', () => {
		const original = sampleSave();
		const edited = removeValueAtPath(original, ['achievements', '1']);

		assert.deepEqual(diffSaveData(original, edited).changes, [
			{ path: ['achievements', '1'], from: true, to: undefined }
		]);
	});

	test('reports a resized array as one change', () => {
		const original = sampleSave();
		const edited = setValueAtPath(original, ['autoclickerSkins'], [true, false, true]);
		const { changes } = diffSaveData(original, edited);

		assert.equal(changes.length, 1);
		assert.deepEqual(changes[0].path, ['autoclickerSkins']);
	});

	test('diffs same-length arrays by index', () => {
		const original = sampleSave();
		const edited = setValueAtPath(original, ['autoclickerSkins', 1], true);

		assert.deepEqual(diffSaveData(original, edited).changes, [
			{ path: ['autoclickerSkins', 1], from: false, to: true }
		]);
	});

	test('caps the list and flags it as truncated', () => {
		const original: SaveData = { achievements: {} };
		const achievements: Record<string, boolean> = {};

		for (let index = 0; index < MAX_CHANGES + 25; index += 1) {
			achievements[String(index)] = true;
		}

		const edited = setValueAtPath(original, ['achievements'], achievements);
		// The container swap is one change; unpacking it happens because both
		// sides are objects of the same kind.
		const { changes, truncated } = diffSaveData(original, edited);

		assert.equal(changes.length, MAX_CHANGES);
		assert.equal(truncated, true);
	});

	test('does not walk subtrees that kept their identity', () => {
		const original = sampleSave();
		const edited = setValueAtPath(original, ['rubies'], 99);

		assert.equal(edited.heroCollection, original.heroCollection);
		assert.equal(diffSaveData(original, edited).changes.length, 1);
	});
});
