import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
	calculateInstakill,
	calculateMonstersPerZoneReduction,
	defaultInstakillInputs,
	formatInstakillDuration,
	maxZone,
	normalizeInstakillInputs,
	type InstakillCalculatorInputs
} from './instakill-calculator.ts';

const closeTo = (actual: number, expected: number, tolerance = 1e-6) => {
	assert.ok(
		Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(expected)),
		`expected ${actual} to be within ${tolerance} (relative) of ${expected}`
	);
};

/**
 * Slow, obvious restatement of the model the banded fast path optimises:
 * every zone from `startZone` up to (but not including) `endZone` costs one
 * frame, plus `killFrames` per monster on non-boss zones (every fifth zone is a
 * boss and holds a single monster that instakill removes for free). The monster
 * count per zone rises by 0.1 every 500 zones and never drops below one.
 */
const referenceFrames = (rawInputs: Partial<InstakillCalculatorInputs>) => {
	const inputs = normalizeInstakillInputs(rawInputs);
	const killFrames = inputs.acInstakill ? 14 : 15;
	const reduction = calculateMonstersPerZoneReduction(inputs);
	let framesTotal = 0;

	for (let zone = inputs.startZone; zone < inputs.endZone; zone += 1) {
		const monsters = Math.floor(zone / 500) / 10 + 10 - reduction - 1;
		framesTotal += zone % 5 === 0 ? 1 : 1 + killFrames * Math.max(1, monsters);
	}

	return framesTotal;
};

describe('normalizeInstakillInputs', () => {
	test('fills in the defaults', () => {
		assert.deepEqual(normalizeInstakillInputs({}), defaultInstakillInputs);
	});

	test('is idempotent', () => {
		const once = normalizeInstakillInputs({
			startZone: 12.7,
			endZone: 4000.2,
			kumawakamaruLevel: 5.9,
			borbLevel: 3.4,
			fps: 24.567
		});

		assert.deepEqual(normalizeInstakillInputs(once), once);
	});

	test('floors and clamps the zones', () => {
		assert.equal(normalizeInstakillInputs({ startZone: 12.9 }).startZone, 12);
		assert.equal(normalizeInstakillInputs({ startZone: 0 }).startZone, 1);
		assert.equal(normalizeInstakillInputs({ startZone: -50 }).startZone, 1);
		assert.equal(normalizeInstakillInputs({ startZone: maxZone + 1000 }).startZone, maxZone);
		assert.equal(normalizeInstakillInputs({ endZone: maxZone * 2 }).endZone, maxZone);
	});

	test('never lets the end zone fall below the start zone', () => {
		const inputs = normalizeInstakillInputs({ startZone: 100, endZone: 50 });
		assert.equal(inputs.startZone, 100);
		assert.equal(inputs.endZone, 100);
	});

	test('floors ancient levels at zero', () => {
		assert.equal(normalizeInstakillInputs({ kumawakamaruLevel: -5 }).kumawakamaruLevel, 0);
		assert.equal(normalizeInstakillInputs({ borbLevel: -5 }).borbLevel, 0);
		assert.equal(normalizeInstakillInputs({ kumawakamaruLevel: 7.9 }).kumawakamaruLevel, 7);
	});

	test('clamps fps into the playable range and rounds to hundredths', () => {
		assert.equal(normalizeInstakillInputs({ fps: 30 }).fps, 30);
		assert.equal(normalizeInstakillInputs({ fps: 1000 }).fps, 30);
		assert.equal(normalizeInstakillInputs({ fps: 0 }).fps, 0.01);
		assert.equal(normalizeInstakillInputs({ fps: -10 }).fps, 0.01);
		assert.equal(normalizeInstakillInputs({ fps: 0.001 }).fps, 0.01);
		assert.equal(normalizeInstakillInputs({ fps: 24.567 }).fps, 24.57);
	});

	test('falls back to the defaults for non-finite numbers', () => {
		assert.equal(normalizeInstakillInputs({ fps: Number.NaN }).fps, defaultInstakillInputs.fps);
		assert.equal(normalizeInstakillInputs({ startZone: Number.NaN }).startZone, 1);
		// Infinity is not finite either, so it falls back to the clamp minimum
		// rather than to `Number.MAX_SAFE_INTEGER`.
		assert.equal(
			normalizeInstakillInputs({ kumawakamaruLevel: Number.POSITIVE_INFINITY }).kumawakamaruLevel,
			0
		);
		assert.equal(normalizeInstakillInputs({ kumawakamaruLevel: Number.NaN }).kumawakamaruLevel, 0);
		assert.equal(normalizeInstakillInputs({ endZone: Number.NaN }).endZone, 1);
	});

	test('accepts the numeric strings a text field produces', () => {
		// The inputs are typed as numbers, but they arrive from text fields, and
		// `toFiniteNumber` deliberately copes with grouped strings.
		const inputs = normalizeInstakillInputs({
			startZone: '1,000' as unknown as number,
			endZone: '2000' as unknown as number
		});

		assert.equal(inputs.startZone, 1000);
		assert.equal(inputs.endZone, 2000);
	});
});

describe('calculateMonstersPerZoneReduction', () => {
	const reduction = (kumawakamaruLevel: number, borbLevel: number, root2 = false) =>
		calculateMonstersPerZoneReduction({ kumawakamaruLevel, borbLevel, root2 });

	test('is zero without Kumawakamaru, whatever Borb is', () => {
		assert.equal(reduction(0, 0), 0);
		assert.equal(reduction(0, 1000), 0);
		assert.equal(reduction(0, 0, true), 0);
		assert.equal(reduction(0, 1000, true), 0);
	});

	test('Borb at level 8 doubles the Kumawakamaru effect', () => {
		// reduction = kumaEffect * (1 + borbLevel / 8)
		closeTo(reduction(50, 8), reduction(50, 0) * 2, 1e-12);
		closeTo(reduction(50, 16), reduction(50, 0) * 3, 1e-12);
	});

	test('the Kumawakamaru effect approaches 8 monsters from below', () => {
		assert.ok(reduction(1000, 0) < 8);
		closeTo(reduction(1000, 0), 8, 1e-9);
		// Far enough out, exp(-0.025 * level) underflows and the asymptote is hit
		// exactly. Still bounded, which is what the frame maths relies on.
		assert.equal(reduction(100_000, 0), 8);
	});

	test('is monotonic in both levels', () => {
		for (const root2 of [false, true]) {
			let previous = reduction(1, 0, root2);

			for (const level of [2, 5, 10, 50, 100, 1000, 10_000]) {
				const current = reduction(level, 0, root2);
				assert.ok(current > previous, `Kumawakamaru ${level} should reduce more (root2: ${root2})`);
				previous = current;
			}

			let previousBorb = reduction(50, 0, root2);
			for (const level of [1, 2, 8, 50, 500]) {
				const current = reduction(50, level, root2);
				assert.ok(current > previousBorb, `Borb ${level} should reduce more (root2: ${root2})`);
				previousBorb = current;
			}
		}
	});

	test('root2 reduction is the Borb coefficient times log(k + 2.719)', () => {
		// log(k + 2.719) === 2 when k === e^2 - 2.719, which makes the reduction
		// twice the coefficient 0.00008b^2 + 0.1b + 2.5. (log(...) === 1 would need
		// a negative level, since e < 2.719.)
		const kumawakamaruLevel = Math.E ** 2 - 2.719;

		closeTo(reduction(kumawakamaruLevel, 0, true), 2 * 2.5, 1e-9);
		closeTo(reduction(kumawakamaruLevel, 10, true), 2 * (0.00008 * 100 + 1 + 2.5), 1e-9);
	});

	test('the two formulas disagree, so the root2 flag matters', () => {
		assert.notEqual(reduction(100, 10, true), reduction(100, 10, false));
	});
});

describe('calculateInstakill', () => {
	test('an empty range costs nothing', () => {
		const result = calculateInstakill({ startZone: 100, endZone: 100 });

		assert.equal(result.zonesTotal, 0);
		assert.equal(result.framesTotal, 0);
		assert.equal(result.durationSeconds, 0);
		assert.equal(result.zonesPerHour, 0);
		assert.equal(result.durationLabel, '00:00:00');
	});

	test('a single non-boss zone costs one frame plus the kill frames', () => {
		// Zone 1 holds 10 - 1 = 9 monsters before the boss adjustment, and
		// instakill with the auto clicker takes 14 frames per monster.
		assert.equal(calculateInstakill({ startZone: 1, endZone: 2 }).framesTotal, 1 + 14 * 9);
		assert.equal(
			calculateInstakill({ startZone: 1, endZone: 2, acInstakill: false }).framesTotal,
			1 + 15 * 9
		);
	});

	test('a boss zone costs a single frame', () => {
		assert.equal(calculateInstakill({ startZone: 5, endZone: 6 }).framesTotal, 1);
		assert.equal(calculateInstakill({ startZone: 1, endZone: 6 }).framesTotal, 4 * (1 + 14 * 9) + 1);
	});

	test('one whole 500-zone band matches the hand-derived total', () => {
		// Zones 500-999 hold 10.1 monsters, so 9.1 before the boss adjustment:
		// 400 non-boss zones at 1 + 14 * 9.1 frames, 100 boss zones at 1 frame.
		closeTo(calculateInstakill({ startZone: 500, endZone: 1000 }).framesTotal, 400 * (1 + 14 * 9.1) + 100);
	});

	test('monsters per zone step up every 500 zones', () => {
		const at = (zone: number) =>
			calculateInstakill({ startZone: zone, endZone: zone }).rawStartMonstersPerZone;

		closeTo(at(1), 10, 1e-12);
		closeTo(at(499), 10, 1e-12);
		closeTo(at(500), 10.1, 1e-12);
		closeTo(at(999), 10.1, 1e-12);
		closeTo(at(1000), 10.2, 1e-12);
		closeTo(at(5000), 11, 1e-12);
	});

	test('reports both raw and floored monsters per zone', () => {
		const modest = calculateInstakill({ startZone: 1, endZone: 1000 });
		assert.equal(modest.startMonstersPerZone, modest.rawStartMonstersPerZone);
		assert.equal(modest.endMonstersPerZone, modest.rawEndMonstersPerZone);

		// Enough ancient levels to push the raw count negative; the displayed
		// number floors at 2 while the raw value keeps the real figure.
		const heavy = calculateInstakill({
			startZone: 1,
			endZone: 1000,
			kumawakamaruLevel: 1000,
			borbLevel: 100
		});

		assert.ok(heavy.rawStartMonstersPerZone < 0);
		assert.equal(heavy.startMonstersPerZone, 2);
		assert.equal(heavy.endMonstersPerZone, 2);
	});

	test('matches the slow reference implementation', () => {
		const cases: Partial<InstakillCalculatorInputs>[] = [
			{ startZone: 1, endZone: 2 },
			{ startZone: 1, endZone: 6 },
			{ startZone: 1, endZone: 500 },
			{ startZone: 1, endZone: 501 },
			{ startZone: 499, endZone: 501 },
			{ startZone: 500, endZone: 1000 },
			{ startZone: 500, endZone: 1001 },
			{ startZone: 501, endZone: 1000 },
			{ startZone: 1, endZone: 2000 },
			{ startZone: 4990, endZone: 5010 },
			{ startZone: 1, endZone: 5000, acInstakill: false },
			{ startZone: 3, endZone: 7500, kumawakamaruLevel: 10, borbLevel: 2 },
			// Reduction ~8.26, so monsters start below the floor of 1 and climb
			// through it partway along: the capped-arithmetic-series branch.
			{ startZone: 1, endZone: 10_000, kumawakamaruLevel: 100, borbLevel: 1 },
			{ startZone: 250, endZone: 9750, kumawakamaruLevel: 100, borbLevel: 1 },
			// Reduction far above the monster count: every zone stays at the floor.
			{ startZone: 1, endZone: 6000, kumawakamaruLevel: 1000, borbLevel: 100 },
			{ startZone: 1, endZone: 8000, kumawakamaruLevel: 30, borbLevel: 5, root2: true },
			{ startZone: 1234, endZone: 6789, kumawakamaruLevel: 250, borbLevel: 40, root2: true }
		];

		for (const inputs of cases) {
			closeTo(calculateInstakill(inputs).framesTotal, referenceFrames(inputs));
		}
	});

	test('adding ancient levels never costs more frames', () => {
		for (const root2 of [false, true]) {
			let previous = calculateInstakill({ startZone: 1, endZone: 6000, root2 }).framesTotal;

			for (const kumawakamaruLevel of [1, 5, 20, 100, 500, 5000]) {
				const current = calculateInstakill({
					startZone: 1,
					endZone: 6000,
					kumawakamaruLevel,
					root2
				}).framesTotal;

				assert.ok(
					current <= previous,
					`Kumawakamaru ${kumawakamaruLevel} should not cost more frames (root2: ${root2})`
				);
				previous = current;
			}
		}
	});

	test('extending the range never costs fewer frames', () => {
		let previous = 0;

		for (const endZone of [1, 2, 6, 500, 501, 1000, 5000, 12_345]) {
			const result = calculateInstakill({ startZone: 1, endZone });
			assert.ok(result.framesTotal >= previous, `endZone ${endZone} lost frames`);
			assert.equal(result.zonesTotal, endZone - 1);
			previous = result.framesTotal;
		}
	});

	test('frames stay at or above one per zone', () => {
		const inputs = { startZone: 1, endZone: 5000, kumawakamaruLevel: 5000, borbLevel: 5000 };
		const result = calculateInstakill(inputs);

		assert.ok(result.framesTotal >= result.zonesTotal);
		// Floor case: 4000 non-boss zones at 1 + 14 frames, 999 boss zones at 1.
		closeTo(result.framesTotal, referenceFrames(inputs));
	});

	test('duration follows frames and fps', () => {
		const base = calculateInstakill({ startZone: 1, endZone: 1000, fps: 30 });
		const halfSpeed = calculateInstakill({ startZone: 1, endZone: 1000, fps: 15 });

		closeTo(base.durationSeconds, base.framesTotal / 30);
		closeTo(halfSpeed.durationSeconds, base.durationSeconds * 2);
		closeTo(base.zonesPerHour, (base.zonesTotal / base.durationSeconds) * 3600);
		assert.ok(halfSpeed.zonesPerHour < base.zonesPerHour);
		assert.equal(base.durationLabel, formatInstakillDuration(base.durationSeconds));
	});

	test('handles the whole zone range without iterating it', () => {
		const full = calculateInstakill({ startZone: 1, endZone: maxZone });
		const slightlyShorter = calculateInstakill({ startZone: 1, endZone: maxZone - 1000 });

		assert.ok(Number.isFinite(full.framesTotal));
		assert.ok(full.framesTotal > slightlyShorter.framesTotal);
		assert.equal(full.zonesTotal, maxZone - 1);
	});

	test('echoes the normalised inputs back', () => {
		const result = calculateInstakill({ startZone: 10.9, endZone: 5, fps: 1000 });

		assert.deepEqual(result.inputs, {
			...defaultInstakillInputs,
			startZone: 10,
			endZone: 10,
			fps: 30
		});
	});
});

describe('formatInstakillDuration', () => {
	test('uses clock notation below 72 hours', () => {
		assert.equal(formatInstakillDuration(0), '00:00:00');
		assert.equal(formatInstakillDuration(1), '00:00:01');
		assert.equal(formatInstakillDuration(61), '00:01:01');
		assert.equal(formatInstakillDuration(3661), '01:01:01');
		assert.equal(formatInstakillDuration(72 * 3600 - 1), '71:59:59');
	});

	test('rounds to the nearest second and clamps negatives', () => {
		assert.equal(formatInstakillDuration(0.4), '00:00:00');
		assert.equal(formatInstakillDuration(0.6), '00:00:01');
		assert.equal(formatInstakillDuration(-500), '00:00:00');
	});

	test('switches to days at exactly 72 hours', () => {
		assert.equal(formatInstakillDuration(72 * 3600), '3d 0.00h');
		assert.equal(formatInstakillDuration(72 * 3600 + 1800), '3d 0.50h');
	});

	test('adds a years component for very long runs', () => {
		const year = 31_557_600;

		assert.equal(formatInstakillDuration(year), '1y 0d 0.00h');
		assert.equal(formatInstakillDuration(year + 86_400 * 2 + 3600), '1y 2d 1.00h');
		assert.equal(formatInstakillDuration(year * 1000), '1,000y 0d 0.00h');
	});
});
