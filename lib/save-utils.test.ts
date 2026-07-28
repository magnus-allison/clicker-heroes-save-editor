import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
	formatNumber,
	getValueAtPath,
	hasPath,
	isPrimitive,
	listPrimitiveKeys,
	parseNumberish,
	removeValueAtPath,
	sanitizeNumberInput,
	setValueAtPath,
	setValuesAtPaths,
	toSelectValue,
	type SaveData
} from './save-utils.ts';

const sampleSave = (): SaveData => ({
	heroCollection: {
		heroes: {
			'1': { level: 10, epicLevel: 0 },
			'2': { level: 25, epicLevel: 3 }
		}
	},
	achievements: { '1': true, '2': true },
	ancients: { ancients: {} },
	primalSouls: '1e21',
	autoclickerSkins: [true, false, false],
	rubies: 0
});

describe('getValueAtPath', () => {
	test('reads nested values through object and array segments', () => {
		const save = sampleSave();
		assert.equal(getValueAtPath(save, ['heroCollection', 'heroes', '2', 'level']), 25);
		assert.equal(getValueAtPath(save, ['autoclickerSkins', 0]), true);
		assert.equal(getValueAtPath(save, ['autoclickerSkins', '1']), false);
	});

	test('returns the source itself for an empty path', () => {
		const save = sampleSave();
		assert.equal(getValueAtPath(save, []), save);
	});

	test('returns undefined instead of throwing on missing or non-object segments', () => {
		const save = sampleSave();
		assert.equal(getValueAtPath(save, ['nope']), undefined);
		assert.equal(getValueAtPath(save, ['rubies', 'level']), undefined);
		assert.equal(getValueAtPath(save, ['heroCollection', 'heroes', '99', 'level']), undefined);
		assert.equal(getValueAtPath(null, ['a']), undefined);
		assert.equal(getValueAtPath(undefined, ['a']), undefined);
	});
});

describe('hasPath', () => {
	test('an empty path always exists', () => {
		assert.equal(hasPath(sampleSave(), []), true);
		assert.equal(hasPath(null, []), true);
	});

	test('distinguishes a present key from a missing one', () => {
		const save = sampleSave();
		assert.equal(hasPath(save, ['achievements', '1']), true);
		assert.equal(hasPath(save, ['achievements', '3']), false);
		assert.equal(hasPath(save, ['autoclickerSkins', 2]), true);
		assert.equal(hasPath(save, ['autoclickerSkins', 3]), false);
	});

	test('treats a key holding undefined as present', () => {
		assert.equal(hasPath({ type: undefined }, ['type']), true);
		assert.equal(hasPath({ type: undefined }, ['other']), false);
	});

	test('stops at primitives and nullish values', () => {
		assert.equal(hasPath({ rubies: 0 }, ['rubies', 'nested']), false);
		assert.equal(hasPath({ account: null }, ['account', 'id']), false);
		assert.equal(hasPath(null, ['a']), false);
	});
});

describe('setValueAtPath', () => {
	test('sets an existing nested value', () => {
		const save = sampleSave();
		const next = setValueAtPath(save, ['heroCollection', 'heroes', '1', 'level'], 200);

		assert.equal(getValueAtPath(next, ['heroCollection', 'heroes', '1', 'level']), 200);
		assert.equal(getValueAtPath(next, ['heroCollection', 'heroes', '2', 'level']), 25);
	});

	test('does not mutate the source, at any depth', () => {
		const save = sampleSave();
		const before = structuredClone(save);
		const originalHeroes = save.heroCollection;

		setValueAtPath(save, ['heroCollection', 'heroes', '1', 'level'], 200);
		setValueAtPath(save, ['autoclickerSkins', 1], true);
		setValueAtPath(save, ['brandNew', 'nested', 'leaf'], 'x');

		assert.deepEqual(save, before);
		assert.equal(save.heroCollection, originalHeroes);
	});

	test('returns a new root but shares the untouched branches', () => {
		const save = sampleSave();
		const next = setValueAtPath(save, ['heroCollection', 'heroes', '1', 'level'], 200);

		assert.notEqual(next, save);
		assert.notEqual(next.heroCollection, save.heroCollection);
		// Copy-on-write: only the containers on the edited path are copied.
		assert.equal(next.achievements, save.achievements);
		assert.equal(next.autoclickerSkins, save.autoclickerSkins);
	});

	test('creates intermediate containers: objects for string segments', () => {
		const next = setValueAtPath({} as SaveData, ['a', 'b', 'c'], 1);

		assert.deepEqual(next, { a: { b: { c: 1 } } });
		assert.equal(Array.isArray(getValueAtPath(next, ['a'])), false);
		assert.equal(Array.isArray(getValueAtPath(next, ['a', 'b'])), false);
	});

	test('creates intermediate containers: arrays for numeric segments', () => {
		const fromNumber = setValueAtPath({} as SaveData, ['list', 1, 'name'], 'x');
		assert.equal(Array.isArray(getValueAtPath(fromNumber, ['list'])), true);
		assert.equal(getValueAtPath(fromNumber, ['list', 0]), undefined);
		assert.equal(getValueAtPath(fromNumber, ['list', 1, 'name']), 'x');

		// A numeric *string* segment counts as an array index too.
		const fromNumericString = setValueAtPath({} as SaveData, ['list', '2', 'name'], 'y');
		assert.equal(Array.isArray(getValueAtPath(fromNumericString, ['list'])), true);
	});

	test('replaces a primitive or null standing where a container is needed', () => {
		const fromPrimitive = setValueAtPath({ a: 5 } as SaveData, ['a', 'b'], 1);
		assert.deepEqual(fromPrimitive, { a: { b: 1 } });

		const fromNull = setValueAtPath({ a: null } as SaveData, ['a', 'b'], 1);
		assert.deepEqual(fromNull, { a: { b: 1 } });
	});

	test('writes undefined as a present key, which JSON.stringify then drops', () => {
		const next = setValueAtPath({ type: 'pc' } as SaveData, ['type'], undefined);

		assert.equal('type' in next, true);
		assert.equal(next.type, undefined);
		assert.equal(JSON.stringify(next), '{}');
	});

	test('an empty path is a no-op that returns the source untouched', () => {
		const save = sampleSave();
		assert.equal(setValueAtPath(save, [], 'ignored'), save);
	});

	test('writes array elements without turning the array into an object', () => {
		const save = sampleSave();
		const next = setValueAtPath(save, ['autoclickerSkins', 2], true);

		assert.equal(Array.isArray(next.autoclickerSkins), true);
		assert.deepEqual(next.autoclickerSkins, [true, false, true]);
	});
});

describe('setValuesAtPaths', () => {
	test('applies every update', () => {
		const save = sampleSave();
		const next = setValuesAtPaths(save, [
			{ path: ['heroCollection', 'heroes', '1', 'level'], value: 100 },
			{ path: ['heroCollection', 'heroes', '2', 'level'], value: 200 },
			{ path: ['rubies'], value: 999 },
			{ path: ['clanName'], value: '' }
		]);

		assert.equal(getValueAtPath(next, ['heroCollection', 'heroes', '1', 'level']), 100);
		assert.equal(getValueAtPath(next, ['heroCollection', 'heroes', '2', 'level']), 200);
		assert.equal(next.rubies, 999);
		assert.equal(next.clanName, '');
	});

	test('does not mutate the source', () => {
		const save = sampleSave();
		const before = structuredClone(save);

		setValuesAtPaths(save, [
			{ path: ['rubies'], value: 1 },
			{ path: ['heroCollection', 'heroes', '1', 'level'], value: 2 }
		]);

		assert.deepEqual(save, before);
	});

	test('lets the last update win when two paths collide', () => {
		const next = setValuesAtPaths({} as SaveData, [
			{ path: ['a', 'b'], value: 1 },
			{ path: ['a', 'b'], value: 2 }
		]);

		assert.deepEqual(next, { a: { b: 2 } });
	});

	test('matches a fold of setValueAtPath', () => {
		const save = sampleSave();
		const updates = [
			{ path: ['rubies'], value: 5 },
			{ path: ['heroCollection', 'heroes', '1', 'epicLevel'], value: 7 },
			{ path: ['newField', 'deep', 'deeper'], value: true }
		];

		assert.deepEqual(
			setValuesAtPaths(save, updates),
			updates.reduce((current, { path, value }) => setValueAtPath(current, path, value), save)
		);
	});

	test('ignores empty paths and an empty update list', () => {
		const save = sampleSave();
		assert.equal(setValuesAtPaths(save, []), save);
		assert.deepEqual(setValuesAtPaths(save, [{ path: [], value: 1 }]), save);
	});
});

describe('removeValueAtPath', () => {
	test('removes a nested key and leaves its siblings alone', () => {
		const save = sampleSave();
		const next = removeValueAtPath(save, ['achievements', '1']);

		assert.deepEqual(next.achievements, { '2': true });
		assert.equal(hasPath(next, ['achievements', '1']), false);
	});

	test('does not mutate the source', () => {
		const save = sampleSave();
		const before = structuredClone(save);

		removeValueAtPath(save, ['achievements', '1']);
		removeValueAtPath(save, ['heroCollection', 'heroes', '2']);

		assert.deepEqual(save, before);
	});

	test('shares the untouched branches', () => {
		const save = sampleSave();
		const next = removeValueAtPath(save, ['achievements', '1']);

		assert.notEqual(next, save);
		assert.notEqual(next.achievements, save.achievements);
		assert.equal(next.heroCollection, save.heroCollection);
	});

	test('removes a top-level key', () => {
		const next = removeValueAtPath({ a: 1, b: 2 } as SaveData, ['a']);
		assert.deepEqual(next, { b: 2 });
	});

	test('is a no-op for a missing key', () => {
		const save = sampleSave();
		const next = removeValueAtPath(save, ['achievements', '404']);

		assert.deepEqual(next, save);
		assert.equal(next, save);
	});

	test('is a no-op for a path that runs through a primitive', () => {
		const save = sampleSave();
		assert.equal(removeValueAtPath(save, ['rubies', 'nested']), save);
		assert.equal(removeValueAtPath(save, ['missing', 'deep', 'leaf']), save);
	});

	test('is a no-op for an empty path', () => {
		const save = sampleSave();
		assert.equal(removeValueAtPath(save, []), save);
	});
});

describe('parseNumberish', () => {
	test('parses plain and grouped numbers', () => {
		assert.equal(parseNumberish('42'), 42);
		assert.equal(parseNumberish('1,234,567'), 1234567);
		assert.equal(parseNumberish('-2.5'), -2.5);
		assert.equal(parseNumberish('1e3'), 1000);
		assert.equal(parseNumberish('  7  '), 7);
	});

	test('takes the leading number when there is trailing junk', () => {
		assert.equal(parseNumberish('12abc'), 12);
	});

	test('falls back to 0 rather than NaN', () => {
		assert.equal(parseNumberish(''), 0);
		assert.equal(parseNumberish('abc'), 0);
		assert.equal(parseNumberish('-'), 0);
	});
});

describe('sanitizeNumberInput (decimal mode)', () => {
	test('keeps well-formed input as typed', () => {
		assert.equal(sanitizeNumberInput('12.34'), '12.34');
		assert.equal(sanitizeNumberInput('-12.34'), '-12.34');
		assert.equal(sanitizeNumberInput('1e5'), '1e5');
		assert.equal(sanitizeNumberInput('1e+5'), '1e+5');
		assert.equal(sanitizeNumberInput('1.5e-5'), '1.5e-5');
	});

	test('keeps partial input usable mid-typing', () => {
		assert.equal(sanitizeNumberInput(''), '');
		assert.equal(sanitizeNumberInput('-'), '-');
		assert.equal(sanitizeNumberInput('.'), '.');
		assert.equal(sanitizeNumberInput('.5'), '.5');
		assert.equal(sanitizeNumberInput('1.'), '1.');
		assert.equal(sanitizeNumberInput('1e'), '1e');
	});

	test('strips characters that are not part of a number', () => {
		assert.equal(sanitizeNumberInput('1a2b3'), '123');
		assert.equal(sanitizeNumberInput('1 000'), '1000');
		assert.equal(sanitizeNumberInput('1,000'), '1000');
		assert.equal(sanitizeNumberInput('$12.50'), '12.50');
	});

	test('collapses multiple dots into the first one', () => {
		assert.equal(sanitizeNumberInput('1.2.3'), '1.23');
		assert.equal(sanitizeNumberInput('1...2'), '1.2');
		assert.equal(sanitizeNumberInput('..1'), '.1');
	});

	test('keeps only a leading sign on the mantissa', () => {
		assert.equal(sanitizeNumberInput('--5'), '-5');
		assert.equal(sanitizeNumberInput('+-5'), '+5');
		assert.equal(sanitizeNumberInput('5-3'), '53');
		assert.equal(sanitizeNumberInput('5+3'), '53');
		assert.equal(sanitizeNumberInput('-5-'), '-5');
	});

	test('collapses multiple exponents into one', () => {
		assert.equal(sanitizeNumberInput('1e5e6'), '1e56');
		assert.equal(sanitizeNumberInput('1e2e3e4'), '1e234');
		assert.equal(sanitizeNumberInput('1ee5'), '1e5');
	});

	test('normalises the exponent sign and case', () => {
		assert.equal(sanitizeNumberInput('1E5'), '1e5');
		assert.equal(sanitizeNumberInput('1e+-5'), '1e+5');
		assert.equal(sanitizeNumberInput('1e5-'), '1e5');
		assert.equal(sanitizeNumberInput('1e-5-6'), '1e-56');
	});

	test('is idempotent on its own output', () => {
		const inputs = ['1.2.3', '--5', '1e5e6', '1e+-5', '$12.50', '..1', '1E5', '-', '.', '1e', '1.'];

		for (const input of inputs) {
			const once = sanitizeNumberInput(input);
			assert.equal(sanitizeNumberInput(once), once, `not idempotent for ${JSON.stringify(input)}`);
		}
	});

	test('a dot inside an exponent merges the digits instead of being dropped', () => {
		// Known wart, asserted so a future change to it is deliberate: typing
		// `1e3.5` yields `1e35`, not `1e3` or `1e3.5`.
		assert.equal(sanitizeNumberInput('1e3.5'), '1e35');
	});
});

describe('sanitizeNumberInput (integer mode)', () => {
	test('drops dots and exponents entirely', () => {
		assert.equal(sanitizeNumberInput('12.34', false), '1234');
		assert.equal(sanitizeNumberInput('1.5e3', false), '153');
		assert.equal(sanitizeNumberInput('1e5', false), '15');
		assert.equal(sanitizeNumberInput('12a', false), '12');
	});

	test('keeps a single leading minus', () => {
		assert.equal(sanitizeNumberInput('-123', false), '-123');
		assert.equal(sanitizeNumberInput('-12-3', false), '-123');
		assert.equal(sanitizeNumberInput('--123', false), '-123');
		assert.equal(sanitizeNumberInput('-', false), '-');
	});

	test('a minus typed after the first digit negates the whole value', () => {
		// Known behaviour: the sign is hoisted rather than discarded.
		assert.equal(sanitizeNumberInput('12-3', false), '-123');
		assert.equal(sanitizeNumberInput('123-', false), '-123');
	});

	test('is idempotent on its own output', () => {
		for (const input of ['12.34', '-12-3', '12-3', '1e5', '-', '']) {
			const once = sanitizeNumberInput(input, false);
			assert.equal(sanitizeNumberInput(once, false), once, `not idempotent for ${input}`);
		}
	});
});

describe('formatNumber (re-exported from lib/format)', () => {
	test('groups thousands and falls back to the raw value', () => {
		assert.equal(formatNumber(1234567), '1,234,567');
		assert.equal(formatNumber('1,234'), '1,234');
		assert.equal(formatNumber('abc'), 'abc');
		assert.equal(formatNumber(null), '');
	});
});

describe('toSelectValue', () => {
	test('stringifies numbers and strings', () => {
		assert.equal(toSelectValue(3), '3');
		assert.equal(toSelectValue(0), '0');
		assert.equal(toSelectValue('a'), 'a');
	});

	test('maps nullish to the empty option', () => {
		assert.equal(toSelectValue(undefined), '');
	});
});

describe('isPrimitive', () => {
	test('accepts strings, numbers, booleans, null and undefined', () => {
		assert.equal(isPrimitive('a'), true);
		assert.equal(isPrimitive(0), true);
		assert.equal(isPrimitive(false), true);
		assert.equal(isPrimitive(null), true);
		assert.equal(isPrimitive(undefined), true);
	});

	test('rejects objects, arrays and functions', () => {
		assert.equal(isPrimitive({}), false);
		assert.equal(isPrimitive([]), false);
		assert.equal(
			isPrimitive(() => 0),
			false
		);
	});
});

describe('listPrimitiveKeys', () => {
	test('lists only the top-level primitive keys, in insertion order', () => {
		assert.deepEqual(listPrimitiveKeys(sampleSave()), ['primalSouls', 'rubies']);
	});

	test('includes keys holding null or undefined', () => {
		assert.deepEqual(listPrimitiveKeys({ a: null, b: undefined, c: {} }), ['a', 'b']);
	});

	test('returns an empty list for no save', () => {
		assert.deepEqual(listPrimitiveKeys(null), []);
		assert.deepEqual(listPrimitiveKeys({}), []);
	});
});
