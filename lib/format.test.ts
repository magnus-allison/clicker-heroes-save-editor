import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
	formatDecimal,
	formatDurationMinutes,
	formatDurationSeconds,
	formatLargeNumber,
	formatNumber,
	log10OfSaveValue,
	toFiniteNumber
} from './format.ts';

describe('toFiniteNumber', () => {
	test('passes finite numbers through', () => {
		assert.equal(toFiniteNumber(0), 0);
		assert.equal(toFiniteNumber(-12.5), -12.5);
		assert.equal(toFiniteNumber(1e300), 1e300);
	});

	test('rejects non-finite numbers', () => {
		assert.equal(toFiniteNumber(Number.NaN), null);
		assert.equal(toFiniteNumber(Number.POSITIVE_INFINITY), null);
		assert.equal(toFiniteNumber(Number.NEGATIVE_INFINITY), null);
	});

	test('parses numeric strings, ignoring padding and thousands separators', () => {
		assert.equal(toFiniteNumber('42'), 42);
		assert.equal(toFiniteNumber('  1,234,567  '), 1234567);
		assert.equal(toFiniteNumber('1e3'), 1000);
		assert.equal(toFiniteNumber('-2.5'), -2.5);
	});

	test('rejects empty, blank and non-numeric strings', () => {
		assert.equal(toFiniteNumber(''), null);
		assert.equal(toFiniteNumber('   '), null);
		assert.equal(toFiniteNumber('abc'), null);
		// `Number` is stricter than `parseFloat`: a trailing suffix is rejected
		// outright rather than silently truncated.
		assert.equal(toFiniteNumber('12abc'), null);
	});

	test('rejects everything that is not a number or string', () => {
		assert.equal(toFiniteNumber(null), null);
		assert.equal(toFiniteNumber(undefined), null);
		assert.equal(toFiniteNumber(true), null);
		assert.equal(toFiniteNumber({}), null);
		assert.equal(toFiniteNumber([1]), null);
	});
});

describe('formatNumber', () => {
	test('groups thousands', () => {
		assert.equal(formatNumber(1234567), '1,234,567');
		assert.equal(formatNumber(-1234567), '-1,234,567');
		assert.equal(formatNumber(0), '0');
	});

	test('accepts numeric strings, including already grouped ones', () => {
		assert.equal(formatNumber('1234'), '1,234');
		assert.equal(formatNumber('1,234'), '1,234');
	});

	test('keeps up to three fraction digits despite the "integer" doc comment', () => {
		assert.equal(formatNumber(1234.5678), '1,234.568');
	});

	test('falls back to the stringified input when it is not numeric', () => {
		assert.equal(formatNumber('abc'), 'abc');
		assert.equal(formatNumber(Number.NaN), 'NaN');
		assert.equal(formatNumber(null), '');
		assert.equal(formatNumber(undefined), '');
	});
});

describe('formatLargeNumber', () => {
	test('groups values below the threshold', () => {
		assert.equal(formatLargeNumber(999_999), '999,999');
		assert.equal(formatLargeNumber(-999_999), '-999,999');
	});

	test('switches to scientific notation at the threshold, inclusive', () => {
		assert.equal(formatLargeNumber(1_000_000), '1.0000e6');
		assert.equal(formatLargeNumber(999_999.9), '999,999.9');
		assert.equal(formatLargeNumber(1_234_567), '1.2346e6');
	});

	test('honours a custom threshold', () => {
		assert.equal(formatLargeNumber(1500, 1000), '1.5000e3');
		assert.equal(formatLargeNumber(999, 1000), '999');
		assert.equal(formatLargeNumber(1_000_000, Number.POSITIVE_INFINITY), '1,000,000');
	});

	test('compares against the threshold by magnitude', () => {
		assert.equal(formatLargeNumber(-2_000_000), '-2.0000e6');
	});

	test('falls back to the stringified input when it is not numeric', () => {
		assert.equal(formatLargeNumber('abc'), 'abc');
		assert.equal(formatLargeNumber(undefined), '');
	});
});

describe('formatDecimal', () => {
	test('always emits exactly one fraction digit', () => {
		assert.equal(formatDecimal(2), '2.0');
		assert.equal(formatDecimal(2.26), '2.3');
		assert.equal(formatDecimal(2.24), '2.2');
		assert.equal(formatDecimal('1500.05'), '1,500.1');
	});

	test('falls back to the stringified input when it is not numeric', () => {
		assert.equal(formatDecimal('abc'), 'abc');
		assert.equal(formatDecimal(null), '');
	});
});

describe('formatDurationMinutes', () => {
	test('returns 0m for zero, negative and non-finite input', () => {
		assert.equal(formatDurationMinutes(0), '0m');
		assert.equal(formatDurationMinutes(-90), '0m');
		assert.equal(formatDurationMinutes(Number.NaN), '0m');
		assert.equal(formatDurationMinutes(Number.POSITIVE_INFINITY), '0m');
	});

	test('floors sub-minute durations to 0m rather than dropping every unit', () => {
		assert.equal(formatDurationMinutes(0.5), '0m');
	});

	test('formats minutes, hours and days, dropping the zero units', () => {
		assert.equal(formatDurationMinutes(1), '1m');
		assert.equal(formatDurationMinutes(59), '59m');
		assert.equal(formatDurationMinutes(60), '1h');
		assert.equal(formatDurationMinutes(90), '1h 30m');
		assert.equal(formatDurationMinutes(1440), '1d');
		assert.equal(formatDurationMinutes(1500), '1d 1h');
		assert.equal(formatDurationMinutes(1501), '1d 1h 1m');
		// 3 whole days plus 2 minutes: the zero hours component is dropped.
		assert.equal(formatDurationMinutes(4322), '3d 2m');
		assert.equal(formatDurationMinutes(20_000), '13d 21h 20m');
	});
});

describe('formatDurationSeconds', () => {
	test('returns 0m for zero, negative and non-finite input', () => {
		assert.equal(formatDurationSeconds(0), '0m');
		assert.equal(formatDurationSeconds(-1), '0m');
		assert.equal(formatDurationSeconds(Number.NaN), '0m');
	});

	test('converts to the minute-based format', () => {
		assert.equal(formatDurationSeconds(30), '0m');
		assert.equal(formatDurationSeconds(60), '1m');
		assert.equal(formatDurationSeconds(3600), '1h');
		assert.equal(formatDurationSeconds(5400), '1h 30m');
		assert.equal(formatDurationSeconds(86_400), '1d');
		assert.equal(formatDurationSeconds(90_061), '1d 1h 1m');
	});
});

describe('log10OfSaveValue', () => {
	const closeTo = (actual: number | null, expected: number, tolerance = 1e-9) => {
		assert.ok(actual !== null, 'expected a number, got null');
		assert.ok(
			Math.abs(actual - expected) <= tolerance,
			`expected ${actual} to be within ${tolerance} of ${expected}`
		);
	};

	test('handles plain numbers', () => {
		closeTo(log10OfSaveValue(1), 0);
		closeTo(log10OfSaveValue(1000), 3);
		closeTo(log10OfSaveValue(1e100), 100);
		closeTo(log10OfSaveValue(0.001), -3);
	});

	test('handles scientific-notation strings', () => {
		closeTo(log10OfSaveValue('1e50'), 50);
		closeTo(log10OfSaveValue('1.5e300'), Math.log10(1.5) + 300);
		closeTo(log10OfSaveValue('2E10'), Math.log10(2) + 10);
		closeTo(log10OfSaveValue('1e+25'), 25);
		closeTo(log10OfSaveValue('5e-3'), Math.log10(5) - 3);
		closeTo(log10OfSaveValue('.5e3'), Math.log10(0.5) + 3);
	});

	test('strips thousands separators and surrounding whitespace', () => {
		closeTo(log10OfSaveValue(' 1,234,567 '), Math.log10(1234567), 1e-12);
	});

	test('handles digit strings far beyond Number.MAX_VALUE', () => {
		// 1 followed by 399 zeroes: 400 digits, so log10 is exactly 399.
		closeTo(log10OfSaveValue(`1${'0'.repeat(399)}`), 399, 1e-12);

		// 400 nines is a hair under 10^400. The 16 leading digits round up to 1e16
		// in a double, so the answer saturates at exactly 400 — the difference is
		// far below what a double can represent at this magnitude.
		const allNines = log10OfSaveValue('9'.repeat(400));
		assert.ok(allNines !== null);
		assert.ok(allNines <= 400 && allNines > 399.99, `unexpected log ${allNines}`);

		// 400 digits again, but with significant leading digits: only the first 16
		// feed the mantissa, which is all a double can carry anyway.
		closeTo(
			log10OfSaveValue(`123456789012345678${'0'.repeat(382)}`),
			Math.log10(1.23456789012345678) + 399,
			1e-9
		);
	});

	test('handles values that are only representable as strings but small', () => {
		closeTo(log10OfSaveValue('0.00042'), Math.log10(0.00042), 1e-12);
		closeTo(log10OfSaveValue('0.5'), Math.log10(0.5), 1e-12);
		closeTo(log10OfSaveValue(`0.${'0'.repeat(50)}7`), Math.log10(7) - 51, 1e-9);
	});

	test('approximates fractional strings from the integer part only', () => {
		// A known and harmless imprecision: for a string with both an integer and
		// a fraction part, only the integer digits feed the log.
		const actual = log10OfSaveValue('1234.5678');
		closeTo(actual, Math.log10(1234), 1e-12);
		closeTo(actual, Math.log10(1234.5678), 1e-3);
	});

	test('returns null for non-positive, empty and unparseable input', () => {
		assert.equal(log10OfSaveValue(0), null);
		assert.equal(log10OfSaveValue(-5), null);
		assert.equal(log10OfSaveValue('-1e10'), null);
		assert.equal(log10OfSaveValue('0'), null);
		assert.equal(log10OfSaveValue('0.000'), null);
		assert.equal(log10OfSaveValue(''), null);
		assert.equal(log10OfSaveValue('   '), null);
		assert.equal(log10OfSaveValue(null), null);
		assert.equal(log10OfSaveValue(undefined), null);
		assert.equal(log10OfSaveValue('abc'), null);
		assert.equal(log10OfSaveValue('12abc'), null);
		assert.equal(log10OfSaveValue(Number.NaN), null);
		assert.equal(log10OfSaveValue(Number.POSITIVE_INFINITY), null);
	});

	test('is monotonic across the string/number boundary', () => {
		const ascending = ['1', '9', '10', '1e2', '999', '1000', '1e100', `1${'0'.repeat(200)}`, '9'.repeat(300)];

		for (let index = 1; index < ascending.length; index += 1) {
			const previous = log10OfSaveValue(ascending[index - 1]);
			const current = log10OfSaveValue(ascending[index]);
			assert.ok(previous !== null && current !== null);
			assert.ok(
				current > previous,
				`log10(${ascending[index]}) = ${current} should exceed log10(${ascending[index - 1]}) = ${previous}`
			);
		}
	});
});
