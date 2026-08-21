import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { ascensionDurations, zoneForBorbLevel } from './data/outsiders-tables.ts';
import {
	calculateOutsiders,
	defaultOutsidersSettings,
	formatTranscendentPower,
	outsiderCost,
	outsiderDefinitions,
	planOutsiderAutoLevel,
	readOutsidersSnapshot,
	simulateTranscensions,
	transcendentPowerFor,
	type OutsidersSettings
} from './outsiders-calculator.ts';

/**
 * The upstream calculator publishes the output of its own regression run in
 * `test results.json` (github.com/Driej/Clicker-Heroes-Outsiders). Reproducing
 * it exactly is the whole bar for this port: every level, the leftover souls,
 * and the end-of-transcension projections have to match to the last bit.
 *
 * The fixture was produced with Orphalas levelling on and the ancient soul
 * reserve off, which is what `fixtureSettings` sets.
 */
const fixtureSettings: OutsidersSettings = {
	...defaultOutsidersSettings,
	levelOrphalas: true,
	reserveAncientSouls: false
};

type Fixture = {
	ancientSouls: number;
	/** xyliqil, chorgorloth, phandoryss, ponyboy, borb, rhageist, kariqua, orphalas, senakhan */
	expectedLevels: number[];
	expectedRemaining: number;
	newHze: number;
	newLogHeroSouls: number;
	newAncientSouls: number;
	/** Percent, where the calculator works in fractions. */
	newTranscendentPower: number;
};

const fixtures: Fixture[] = [
	{
		ancientSouls: 0,
		expectedLevels: [0, 0, 0, 0, 0, 0, 0, 0, 0],
		expectedRemaining: 0,
		newHze: 300,
		newLogHeroSouls: 2.8859067192182297,
		newAncientSouls: 14,
		newTranscendentPower: 2.0963974237060476
	},
	{
		ancientSouls: 1,
		expectedLevels: [0, 0, 0, 1, 0, 0, 0, 0, 0],
		expectedRemaining: 0,
		newHze: 1512,
		newLogHeroSouls: 6.015341466253366,
		newAncientSouls: 30,
		newTranscendentPower: 2.2060712882236757
	},
	{
		ancientSouls: 10,
		expectedLevels: [0, 0, 4, 2, 2, 0, 0, 0, 0],
		expectedRemaining: 0,
		newHze: 2483,
		newLogHeroSouls: 8.406471463122548,
		newAncientSouls: 42,
		newTranscendentPower: 2.2879819040142024
	},
	{
		ancientSouls: 100,
		expectedLevels: [0, 1, 10, 9, 7, 4, 0, 2, 2],
		expectedRemaining: 0,
		newHze: 9863,
		newLogHeroSouls: 28.156549260635654,
		newAncientSouls: 140,
		newTranscendentPower: 2.9459950468328557
	},
	{
		ancientSouls: 500,
		expectedLevels: [0, 9, 45, 19, 18, 7, 2, 5, 2],
		expectedRemaining: 0,
		newHze: 28865,
		newLogHeroSouls: 132.90919228913452,
		newAncientSouls: 664,
		newTranscendentPower: 6.154122005884222
	},
	{
		ancientSouls: 1000,
		expectedLevels: [0, 20, 63, 28, 20, 11, 3, 8, 2],
		expectedRemaining: 0,
		newHze: 50035,
		newLogHeroSouls: 338.5714764811143,
		newAncientSouls: 1692,
		newTranscendentPower: 11.155414522699742
	},
	{
		ancientSouls: 5000,
		expectedLevels: [0, 66, 220, 50, 31, 32, 9, 20, 5],
		expectedRemaining: 0,
		newHze: 149306,
		newLogHeroSouls: 2355.079917042647,
		newAncientSouls: 11775,
		newTranscendentPower: 24.327669863183736
	},
	{
		ancientSouls: 10000,
		expectedLevels: [0, 104, 312, 63, 39, 41, 13, 29, 9],
		expectedRemaining: 0,
		newHze: 189402,
		newLogHeroSouls: 3524.3453685619443,
		newAncientSouls: 17621,
		newTranscendentPower: 24.883609665499616
	},
	{
		ancientSouls: 12500,
		expectedLevels: [0, 117, 378, 68, 45, 46, 14, 33, 13],
		expectedRemaining: 0,
		newHze: 215857,
		newLogHeroSouls: 4107.204665809476,
		newAncientSouls: 20536,
		newTranscendentPower: 24.951457024668308
	},
	{
		ancientSouls: 15000,
		expectedLevels: [0, 131, 401, 72, 47, 50, 16, 36, 15],
		expectedRemaining: 0,
		newHze: 230228,
		newLogHeroSouls: 4426.159989891835,
		newAncientSouls: 22130,
		newTranscendentPower: 24.96990829672933
	},
	{
		ancientSouls: 17500,
		expectedLevels: [0, 144, 400, 75, 50, 53, 17, 39, 18],
		expectedRemaining: 0,
		newHze: 244600,
		newLogHeroSouls: 4725.136297772104,
		newAncientSouls: 23625,
		newTranscendentPower: 24.98078388029214
	},
	{
		ancientSouls: 20000,
		expectedLevels: [0, 150, 580, 86, 53, 56, 18, 42, 22],
		expectedRemaining: 0,
		newHze: 258971,
		newLogHeroSouls: 5014.050545879064,
		newAncientSouls: 25070,
		newTranscendentPower: 24.98754341380212
	},
	{
		ancientSouls: 50000,
		expectedLevels: [0, 30, 112, 34, 312, 0, 0, 0, 0],
		expectedRemaining: 0,
		newHze: 1560500,
		newLogHeroSouls: 30248.43119635196,
		newAncientSouls: 151242,
		newTranscendentPower: 25
	},
	{
		ancientSouls: 100000,
		expectedLevels: [0, 30, 115, 35, 444, 0, 0, 0, 0],
		expectedRemaining: 0,
		newHze: 2227158,
		newLogHeroSouls: 43169.63109148008,
		newAncientSouls: 215848,
		newTranscendentPower: 25
	},
	{
		ancientSouls: 200000,
		expectedLevels: [0, 30, 140, 35, 630, 0, 0, 0, 0],
		expectedRemaining: 0,
		newHze: 3239688,
		newLogHeroSouls: 62794.490185692885,
		newAncientSouls: 313972,
		newTranscendentPower: 25
	},
	{
		ancientSouls: 300000,
		expectedLevels: [0, 38, 140, 38, 772, 0, 0, 0, 0],
		expectedRemaining: 0,
		newHze: 4020679,
		newLogHeroSouls: 77931.731205256,
		newAncientSouls: 389658,
		newTranscendentPower: 25
	},
	{
		ancientSouls: 400000,
		expectedLevels: [0, 39, 162, 39, 892, 0, 0, 0, 0],
		expectedRemaining: 0,
		newHze: 4727997,
		newLogHeroSouls: 91640.99308192084,
		newAncientSouls: 458204,
		newTranscendentPower: 25
	},
	{
		ancientSouls: 500000,
		expectedLevels: [0, 16, 64, 24, 999, 0, 0, 0, 0],
		expectedRemaining: 0,
		newHze: 5348289,
		newLogHeroSouls: 103663.0725797884,
		newAncientSouls: 518315,
		newTranscendentPower: 25
	}
];

describe('calculateOutsiders', () => {
	for (const fixture of fixtures) {
		test(`matches the upstream fixture at ${fixture.ancientSouls} ancient souls`, () => {
			const calculation = calculateOutsiders({
				ancientSouls: fixture.ancientSouls,
				settings: fixtureSettings
			});

			assert.deepEqual(
				outsiderDefinitions.map((definition) => calculation.levels[definition.key]),
				fixture.expectedLevels
			);
			assert.equal(calculation.ancientSoulsUnspent, fixture.expectedRemaining);
			assert.equal(calculation.highestZone, fixture.newHze);
			assert.equal(calculation.logHeroSouls, fixture.newLogHeroSouls);
			assert.equal(calculation.nextAncientSouls, fixture.newAncientSouls);
			assert.equal(calculation.nextTranscendentPower * 100, fixture.newTranscendentPower);
		});
	}

	test('never spends more ancient souls than it has', () => {
		for (let ancientSouls = 0; ancientSouls <= 3000; ancientSouls += 7) {
			const calculation = calculateOutsiders({ ancientSouls, settings: fixtureSettings });
			const spent = calculation.rows.reduce((total, row) => total + row.cost, 0);

			assert.ok(spent <= ancientSouls, `spent ${spent} of ${ancientSouls} at ${ancientSouls} ancient souls`);
			assert.equal(spent + calculation.ancientSoulsUnspent, ancientSouls);
		}
	});

	test('holds back a tenth of the post-Borb souls when reserving', () => {
		const spending = calculateOutsiders({ ancientSouls: 5000, settings: fixtureSettings });
		const reserving = calculateOutsiders({
			ancientSouls: 5000,
			settings: { ...fixtureSettings, reserveAncientSouls: true }
		});

		assert.equal(reserving.ancientSoulsReserved > 0, true);
		assert.ok(reserving.ancientSoulsSpent < spending.ancientSoulsSpent);
		assert.equal(reserving.levels.borb, spending.levels.borb);
	});

	test('leaves Orphalas alone unless asked', () => {
		const calculation = calculateOutsiders({
			ancientSouls: 5000,
			settings: { ...fixtureSettings, levelOrphalas: false }
		});

		assert.equal(calculation.levels.orphalas, 0);
	});

	test('plans for the zone you pin it to', () => {
		const calculation = calculateOutsiders({
			ancientSouls: 5000,
			settings: { ...fixtureSettings, zoneOverride: 120000 }
		});

		assert.equal(calculation.highestZone, 120000);
	});
});

describe('transcendentPowerFor', () => {
	test('starts at 2% and closes on 25%', () => {
		assert.equal(transcendentPowerFor(0) * 100, 2);
		assert.ok(transcendentPowerFor(500000) * 100 > 24.99);
		assert.ok(transcendentPowerFor(500000) * 100 <= 25);
	});
});

describe('formatTranscendentPower', () => {
	test('matches the in-game readout', () => {
		assert.equal(formatTranscendentPower(0), '2%');
		assert.equal(formatTranscendentPower(5000), '19.8680%');
		assert.equal(formatTranscendentPower(11775), '24.3276%');
		assert.equal(formatTranscendentPower(124767), '25%');
	});
});

describe('simulateTranscensions', () => {
	test('runs the projection out to the end of the game', () => {
		const calculation = calculateOutsiders({ ancientSouls: 5000, settings: defaultOutsidersSettings });
		const simulation = simulateTranscensions({ calculation, settings: defaultOutsidersSettings });

		assert.equal(simulation.truncated, false);
		assert.equal(simulation.rows[0].ancientSouls, 5000);
		assert.ok(simulation.rows.length > 1);

		for (let index = 1; index < simulation.rows.length; index += 1) {
			assert.ok(
				simulation.rows[index].ancientSouls > simulation.rows[index - 1].ancientSouls,
				'each transcension should start with more souls than the last'
			);
		}

		assert.ok(simulation.rows[simulation.rows.length - 1].highestZone >= 5.46e6);
	});

	test('stops at one row when the zone is pinned', () => {
		const settings = { ...defaultOutsidersSettings, zoneOverride: 250000 };
		const calculation = calculateOutsiders({ ancientSouls: 5000, settings });

		assert.equal(simulateTranscensions({ calculation, settings }).rows.length, 1);
	});
});

describe('save integration', () => {
	const save = {
		ancientSouls: 1200,
		ancientSoulsTotal: 5000,
		outsiders: {
			outsiders: {
				1: { id: 1, level: 0, spentAncientSouls: 0 },
				2: { id: 2, level: 10, spentAncientSouls: 55 },
				3: { id: 3, level: 20, spentAncientSouls: 20 },
				5: { id: 5, level: 4, spentAncientSouls: 10 },
				6: { id: 6, level: 3, spentAncientSouls: 6 },
				7: { id: 7, level: 0, spentAncientSouls: 0 },
				8: { id: 8, level: 0, spentAncientSouls: 0 },
				9: { id: 9, level: 0, spentAncientSouls: 0 },
				10: { id: 10, level: 0, spentAncientSouls: 0 }
			}
		},
		transcendent: true
	};

	test('reads the ancient soul total and current outsider levels', () => {
		const snapshot = readOutsidersSnapshot(save);

		assert.ok(snapshot);
		assert.equal(snapshot.ancientSoulsTotal, 5000);
		assert.equal(snapshot.ancientSoulsUnspent, 1200);
		assert.equal(snapshot.outsiderLevels[2], 10);
		assert.equal(snapshot.transcendent, true);
	});

	test('returns null without an outsiders block', () => {
		assert.equal(readOutsidersSnapshot({ ancientSoulsTotal: 10 }), null);
		assert.equal(readOutsidersSnapshot(null), null);
	});

	test('writes every outsider level, its cost, and the leftover souls', () => {
		const snapshot = readOutsidersSnapshot(save);
		assert.ok(snapshot);

		const calculation = calculateOutsiders({
			ancientSouls: snapshot.ancientSoulsTotal,
			settings: defaultOutsidersSettings
		});
		const plan = planOutsiderAutoLevel({ calculation, snapshot });

		assert.deepEqual(plan.blockedBy, []);
		// Two writes per outsider, plus the unspent ancient souls.
		assert.equal(plan.updates.length, outsiderDefinitions.length * 2 + 1);

		const phandoryss = outsiderDefinitions.find((definition) => definition.key === 'phandoryss');
		assert.ok(phandoryss);
		const spent = plan.updates.find(
			(update) => update.path.join('.') === `outsiders.outsiders.${phandoryss.id}.spentAncientSouls`
		);
		// Phandoryss is the one outsider that costs a flat soul per level.
		assert.equal(spent?.value, calculation.levels.phandoryss);
	});

	test('refuses to lower an outsider that is already too high', () => {
		const overLevelled = {
			...save,
			outsiders: {
				outsiders: {
					...save.outsiders.outsiders,
					7: { id: 7, level: 9000, spentAncientSouls: 0 }
				}
			}
		};
		const snapshot = readOutsidersSnapshot(overLevelled);
		assert.ok(snapshot);

		const calculation = calculateOutsiders({
			ancientSouls: snapshot.ancientSoulsTotal,
			settings: defaultOutsidersSettings
		});
		const plan = planOutsiderAutoLevel({ calculation, snapshot });

		assert.deepEqual(
			plan.blockedBy.map((definition) => definition.key),
			['rhageist']
		);
		assert.deepEqual(plan.updates, []);
	});
});

describe('lookup tables', () => {
	test('cover the full tabulated Borb range', () => {
		assert.equal(zoneForBorbLevel(184), undefined);
		assert.equal(zoneForBorbLevel(185), 966409);
		assert.equal(zoneForBorbLevel(1026), 5452205);
		assert.equal(zoneForBorbLevel(1027), undefined);
	});

	test('list ascension durations in zone order', () => {
		assert.equal(ascensionDurations.length, 250);
		assert.deepEqual(ascensionDurations[0], [1021362, 42073]);
		assert.deepEqual(ascensionDurations[ascensionDurations.length - 1], [5455474, 226096]);

		for (let index = 1; index < ascensionDurations.length; index += 1) {
			assert.ok(ascensionDurations[index][0] > ascensionDurations[index - 1][0]);
		}
	});
});

describe('outsiderCost', () => {
	test('is triangular, except for Phandoryss', () => {
		assert.equal(outsiderCost(0), 0);
		assert.equal(outsiderCost(1), 1);
		assert.equal(outsiderCost(150), 11325);
		assert.equal(outsiderCost(150, true), 150);
	});
});
