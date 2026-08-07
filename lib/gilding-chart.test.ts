import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
	firstGildingExponent,
	gildingPhaseById,
	gildingPhases,
	gildingRowForExponent,
	gildingRows,
	nextGildingRow,
	parseGoldExponent
} from './gilding-chart.ts';

describe('gildingRows', () => {
	test('numbers every step from 1 with no gaps', () => {
		gildingRows.forEach((row, index) => {
			assert.equal(row.step, index + 1);
		});
	});

	test('gold thresholds strictly increase down the chart', () => {
		for (let index = 1; index < gildingRows.length; index += 1) {
			const previous = gildingRows[index - 1]!;
			const current = gildingRows[index]!;

			assert.ok(
				current.goldFrom > previous.goldFrom,
				`step ${current.step} (${current.hero}) starts at e${current.goldFrom}, not after e${previous.goldFrom}`
			);
		}
	});

	test('each row ends exactly where the next begins', () => {
		for (let index = 0; index < gildingRows.length - 1; index += 1) {
			const current = gildingRows[index]!;
			const next = gildingRows[index + 1]!;

			assert.equal(
				current.goldTo,
				next.goldFrom,
				`step ${current.step} (${current.hero}) leaves a gap before step ${next.step}`
			);
		}
	});

	test('only the final row is open-ended', () => {
		const openEnded = gildingRows.filter((row) => row.goldTo === null);

		assert.equal(openEnded.length, 1);
		assert.equal(openEnded[0]!.step, gildingRows.length);
	});

	test('phases run in order and every phase has rows', () => {
		const phaseIds = gildingRows.map((row) => row.phase);

		for (let index = 1; index < phaseIds.length; index += 1) {
			assert.ok(phaseIds[index]! >= phaseIds[index - 1]!, 'phases are out of order');
		}

		for (const phase of gildingPhases) {
			assert.ok(
				gildingRows.some((row) => row.phase === phase.id),
				`phase ${phase.id} has no rows`
			);
		}
	});

	test('every row resolves to a known phase', () => {
		for (const row of gildingRows) {
			assert.equal(gildingPhaseById(row.phase).id, row.phase);
		}
	});
});

describe('parseGoldExponent', () => {
	test('reads the exponent out of a full gold reading', () => {
		assert.equal(parseGoldExponent('1.4e442'), 442);
		assert.equal(parseGoldExponent('4.21E+250'), 250);
		assert.equal(parseGoldExponent('9.99e34'), 34);
	});

	test('accepts a bare exponent', () => {
		assert.equal(parseGoldExponent('442'), 442);
		assert.equal(parseGoldExponent('  108838  '), 108838);
	});

	test('accepts a lone suffix', () => {
		assert.equal(parseGoldExponent('e77'), 77);
	});

	test('ignores thousands separators and inner spaces', () => {
		assert.equal(parseGoldExponent('1,234e500'), 500);
		assert.equal(parseGoldExponent('25,500'), 25500);
	});

	test('floors a fractional bare exponent rather than rounding up', () => {
		assert.equal(parseGoldExponent('442.9'), 442);
	});

	test('rejects blank and non-numeric input', () => {
		assert.equal(parseGoldExponent(''), null);
		assert.equal(parseGoldExponent('   '), null);
		assert.equal(parseGoldExponent('abc'), null);
		assert.equal(parseGoldExponent('12abc'), null);
		assert.equal(parseGoldExponent('1e'), null);
	});
});

describe('gildingRowForExponent', () => {
	test('returns nothing below the first chart entry', () => {
		assert.equal(gildingRowForExponent(firstGildingExponent - 1), null);
		assert.equal(gildingRowForExponent(0), null);
	});

	test('matches on the exact threshold, not one past it', () => {
		for (const row of gildingRows) {
			assert.equal(
				gildingRowForExponent(row.goldFrom)!.step,
				row.step,
				`e${row.goldFrom} should land on step ${row.step}`
			);
		}
	});

	test('holds the previous row right up to the next threshold', () => {
		for (let index = 0; index < gildingRows.length - 1; index += 1) {
			const row = gildingRows[index]!;

			assert.equal(gildingRowForExponent(row.goldTo! - 1)!.step, row.step);
		}
	});

	test('sticks on the final row forever', () => {
		const last = gildingRows.at(-1)!;

		assert.equal(gildingRowForExponent(last.goldFrom)!.step, last.step);
		assert.equal(gildingRowForExponent(last.goldFrom + 1_000_000)!.step, last.step);
	});

	test('lands on the expected heroes at known checkpoints', () => {
		assert.equal(gildingRowForExponent(35)!.hero, 'The Masked Samurai');
		assert.equal(gildingRowForExponent(76)!.hero, 'The Masked Samurai');
		assert.equal(gildingRowForExponent(77)!.hero, 'Atlas');
		assert.equal(gildingRowForExponent(500)!.hero, 'Tsuchi');
		assert.equal(gildingRowForExponent(45500)!.hero, 'The Maw');
		assert.equal(gildingRowForExponent(108838)!.hero, 'Rose');
	});
});

describe('nextGildingRow', () => {
	test('steps forward one row', () => {
		const first = gildingRows[0]!;

		assert.equal(nextGildingRow(first)!.step, 2);
	});

	test('returns nothing past the end of the chart', () => {
		assert.equal(nextGildingRow(gildingRows.at(-1)!), null);
	});
});
