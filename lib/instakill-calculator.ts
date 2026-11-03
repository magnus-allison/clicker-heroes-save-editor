// Relative path with an explicit extension rather than `@/lib/format`: the
// `@/*` alias is a bundler/tsconfig convenience and does not resolve when this
// module is loaded by plain Node (`node --test`).
import { formatLongDuration, toFiniteNumber } from './format.ts';
import { getValueAtPath, type SaveData } from './save-utils.ts';

export type InstakillCalculatorInputs = {
	kumawakamaruLevel: number;
	borbLevel: number;
	startZone: number;
	endZone: number;
	fps: number;
	acInstakill: boolean;
	root2: boolean;
};

export type InstakillCalculation = {
	inputs: InstakillCalculatorInputs;
	mpzReduction: number;
	rawStartMonstersPerZone: number;
	rawEndMonstersPerZone: number;
	startMonstersPerZone: number;
	endMonstersPerZone: number;
	zonesTotal: number;
	framesTotal: number;
	durationSeconds: number;
	durationLabel: string;
	zonesPerHour: number;
};

export const maxZone = 2 ** 31 - 1;

export const defaultInstakillInputs = {
	kumawakamaruLevel: 0,
	borbLevel: 0,
	startZone: 1,
	endZone: 1,
	fps: 30,
	acInstakill: true,
	root2: false
} satisfies InstakillCalculatorInputs;

const zoneBandSize = 500;
const monstersPerZoneStep = 0.1;
const nonBossZonesPerBand = 400;
const framesPerBand = 500;

export function normalizeInstakillInputs(
	inputs: Partial<InstakillCalculatorInputs>
): InstakillCalculatorInputs {
	const withDefaults = {
		...defaultInstakillInputs,
		...inputs
	};
	const startZone = clampInteger(withDefaults.startZone, 1, maxZone);

	return {
		kumawakamaruLevel: clampInteger(withDefaults.kumawakamaruLevel, 0, Number.MAX_SAFE_INTEGER),
		borbLevel: clampInteger(withDefaults.borbLevel, 0, Number.MAX_SAFE_INTEGER),
		startZone,
		endZone: clampInteger(withDefaults.endZone, startZone, maxZone),
		fps: clamp(roundToHundredth(toFiniteNumber(withDefaults.fps) ?? defaultInstakillInputs.fps), 0.01, 30),
		acInstakill: withDefaults.acInstakill,
		root2: withDefaults.root2
	};
}

const kumawakamaruAncientId = 21;
const borbOutsiderId = 6;

/**
 * The inputs a save can supply: Kumawakamaru and Borb levels, and the highest
 * zone reached as the target zone. FPS, AC instakill and root2 are play-style
 * settings the save does not record, so they are left as they are. A field the
 * save is missing is left out rather than zeroed.
 */
export function readInstakillSave(saveData: SaveData | null | undefined): Partial<InstakillCalculatorInputs> {
	if (!saveData) {
		return {};
	}

	const kumawakamaruLevel = toFiniteNumber(
		getValueAtPath(saveData, ['ancients', 'ancients', String(kumawakamaruAncientId), 'level'])
	);
	const borbLevel = toFiniteNumber(
		getValueAtPath(saveData, ['outsiders', 'outsiders', String(borbOutsiderId), 'level'])
	);
	// The persisted zone is the best ever and normally the larger, but a save
	// edited by hand can leave it behind this ascension's.
	const zones = [saveData.highestFinishedZonePersist, saveData.highestFinishedZone]
		.map(toFiniteNumber)
		.filter((zone) => zone !== null);
	const highestZone = zones.length > 0 ? Math.max(...zones) : null;

	return {
		...(kumawakamaruLevel === null ? {} : { kumawakamaruLevel }),
		...(borbLevel === null ? {} : { borbLevel }),
		...(highestZone === null || highestZone < 1 ? {} : { endZone: highestZone })
	};
}

export function calculateInstakill(rawInputs: Partial<InstakillCalculatorInputs>): InstakillCalculation {
	const inputs = normalizeInstakillInputs(rawInputs);
	const mpzReduction = calculateMonstersPerZoneReduction(inputs);
	const rawStartMonstersPerZone = calculateRawMonstersPerZone(inputs.startZone, mpzReduction);
	const rawEndMonstersPerZone = calculateRawMonstersPerZone(inputs.endZone, mpzReduction);
	const zonesTotal = inputs.endZone - inputs.startZone;
	const framesTotal = calculateFrames(inputs, rawStartMonstersPerZone);
	const durationSeconds = framesTotal / inputs.fps;
	const zonesPerHour = durationSeconds > 0 ? (zonesTotal / durationSeconds) * 3600 : 0;

	return {
		inputs,
		mpzReduction,
		rawStartMonstersPerZone,
		rawEndMonstersPerZone,
		startMonstersPerZone: Math.max(2, rawStartMonstersPerZone),
		endMonstersPerZone: Math.max(2, rawEndMonstersPerZone),
		zonesTotal,
		framesTotal,
		durationSeconds,
		durationLabel: formatLongDuration(durationSeconds),
		zonesPerHour
	};
}

export function calculateMonstersPerZoneReduction({
	borbLevel,
	kumawakamaruLevel,
	root2
}: Pick<InstakillCalculatorInputs, 'borbLevel' | 'kumawakamaruLevel' | 'root2'>) {
	if (root2) {
		const coefficient = 0.00008 * borbLevel * borbLevel + 0.1 * borbLevel + 2.5;
		return kumawakamaruLevel > 0 ? Math.log(kumawakamaruLevel + 2.719) * coefficient : 0;
	}

	const kumawakamaruEffect = 8 * (1 - Math.exp(-0.025 * kumawakamaruLevel));
	return kumawakamaruEffect * (1 + borbLevel / 8);
}

/**
 * Route durations are formatted by the shared long-duration formatter, which
 * this calculator used to own. Re-exported under the old name so callers and
 * tests keep working.
 */
export const formatInstakillDuration = formatLongDuration;

function calculateRawMonstersPerZone(zone: number, mpzReduction: number) {
	return Math.floor(zone / zoneBandSize) / 10 + 10 - mpzReduction;
}

function calculateFrames(inputs: InstakillCalculatorInputs, rawStartMonstersPerZone: number) {
	const killFrames = inputs.acInstakill ? 14 : 15;
	let currentZone = inputs.startZone;
	let framesTotal = 0;
	let monstersBeforeBossAdjustment = rawStartMonstersPerZone - 1;

	while (currentZone < inputs.endZone && currentZone % zoneBandSize) {
		framesTotal += calculateZoneFrames(currentZone, monstersBeforeBossAdjustment, killFrames);
		currentZone += 1;

		if (currentZone % zoneBandSize === 0) {
			monstersBeforeBossAdjustment += monstersPerZoneStep;
		}
	}

	const fullBands = Math.floor((inputs.endZone - currentZone) / zoneBandSize);

	if (fullBands > 0) {
		framesTotal +=
			fullBands * framesPerBand +
			nonBossZonesPerBand *
				killFrames *
				sumCappedMonsters(monstersBeforeBossAdjustment, monstersPerZoneStep, fullBands);
		currentZone += fullBands * zoneBandSize;
		monstersBeforeBossAdjustment += fullBands * monstersPerZoneStep;
	}

	while (currentZone < inputs.endZone) {
		framesTotal += calculateZoneFrames(currentZone, monstersBeforeBossAdjustment, killFrames);
		currentZone += 1;
	}

	return framesTotal;
}

function calculateZoneFrames(zone: number, monstersBeforeBossAdjustment: number, killFrames: number) {
	return zone % 5 ? 1 + killFrames * Math.max(1, monstersBeforeBossAdjustment) : 1;
}

function sumCappedMonsters(start: number, step: number, count: number) {
	if (count <= 0) {
		return 0;
	}

	const finalValue = start + step * (count - 1);

	if (start >= 1) {
		return sumArithmeticSeries(start, step, count);
	}

	if (finalValue < 1) {
		return count;
	}

	const cappedCount = Math.min(count, Math.max(0, Math.ceil((1 - start) / step - 1e-12)));
	return cappedCount + sumArithmeticSeries(start + step * cappedCount, step, count - cappedCount);
}

function sumArithmeticSeries(start: number, step: number, count: number) {
	return (count / 2) * (2 * start + (count - 1) * step);
}

function clampInteger(value: number, min: number, max: number) {
	return Math.min(max, Math.max(min, Math.floor(toFiniteNumber(value) ?? min)));
}

function roundToHundredth(value: number) {
	return Math.round(value * 100) / 100;
}

function clamp(value: number, min: number, max: number) {
	return Math.min(max, Math.max(min, value));
}
