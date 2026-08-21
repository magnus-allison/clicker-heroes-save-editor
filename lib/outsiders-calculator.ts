// Relative paths with explicit extensions rather than `@/lib/...`: the `@/*`
// alias is a bundler/tsconfig convenience and does not resolve when this module
// is loaded by plain Node (`node --test`).
import { ascensionDurations, zoneForBorbLevel } from './data/outsiders-tables.ts';
import { formatLongDuration } from './format.ts';
import { getValueAtPath, type PathSegment, type SaveData, type ValueUpdate } from './save-utils.ts';

/**
 * Outsider level planner, ported from Driej's Clicker Heroes Outsiders
 * calculator (github.com/Driej/Clicker-Heroes-Outsiders, Unlicense):
 * https://driej.github.io/Clicker-Heroes-Outsiders/
 *
 * Everything here is pure, so the component can memoise a whole run: read a
 * snapshot out of the save with `readOutsidersSnapshot`, feed its ancient soul
 * total to `calculateOutsiders`, and optionally project the transcensions after
 * this one with `simulateTranscensions`.
 *
 * The original is a spend-in-priority-order planner rather than an optimiser:
 * Borb first (it decides how far the run goes), then the four "super" outsiders
 * up to their caps, then whatever is left is split between Chor'gorloth,
 * Phandoryss and Ponyboy by marginal value per ancient soul.
 */

/**
 * The original ran behind an Internet Explorer polyfill that *replaced*
 * `Math.log10`, and its published test fixtures were produced with that
 * replacement in place. Dividing by `Math.LN10` reproduces them exactly;
 * `Math.log10` differs in the last bits for some inputs.
 */
const log10 = (value: number) => Math.log(value) / Math.LN10;

export type OutsiderKey =
	| 'xyliqil'
	| 'chorgorloth'
	| 'phandoryss'
	| 'ponyboy'
	| 'borb'
	| 'rhageist'
	| 'kariqua'
	| 'orphalas'
	| 'senakhan';

export type OutsiderLevels = Record<OutsiderKey, number>;

export type OutsiderDefinition = {
	key: OutsiderKey;
	/** Save-file id under `outsiders.outsiders`. */
	id: number;
	name: string;
	/** Phandoryss costs a flat 1 AS per level; everyone else costs `n` at level `n`. */
	flatCost: boolean;
};

/** In the order the original's share string lists them. */
export const outsiderDefinitions: readonly OutsiderDefinition[] = [
	{ key: 'xyliqil', id: 1, name: 'Xyliqil', flatCost: false },
	{ key: 'chorgorloth', id: 2, name: "Chor'gorloth", flatCost: false },
	{ key: 'phandoryss', id: 3, name: 'Phandoryss', flatCost: true },
	{ key: 'ponyboy', id: 5, name: 'Ponyboy', flatCost: false },
	{ key: 'borb', id: 6, name: 'Borb', flatCost: false },
	{ key: 'rhageist', id: 7, name: 'Rhageist', flatCost: false },
	{ key: 'kariqua', id: 8, name: "K'Ariqua", flatCost: false },
	{ key: 'orphalas', id: 9, name: 'Orphalas', flatCost: false },
	{ key: 'senakhan', id: 10, name: 'Sen-Akhan', flatCost: false }
];

export type OutsidersSettings = {
	/** Target zone to plan for. 0 derives it from the ancient soul count. */
	zoneOverride: number;
	/**
	 * Orphalas only buys boss timer, which active play rarely needs, so the
	 * original leaves it at zero unless you ask for it.
	 */
	levelOrphalas: boolean;
	/** Hold back a tenth of what is left after Borb instead of spending it. */
	reserveAncientSouls: boolean;
};

export const defaultOutsidersSettings = {
	zoneOverride: 0,
	levelOrphalas: false,
	reserveAncientSouls: false
} satisfies OutsidersSettings;

/** Cost of every level up to and including `level`. */
export function outsiderCost(level: number, flatCost = false) {
	return flatCost ? level : ((level + 1) * level) / 2;
}

/**
 * Highest level `ratio` of `ancientSouls` can pay for, inverting the triangular
 * cost. Anything under a single soul buys nothing.
 */
function affordableLevel(ratio: number, ancientSouls: number) {
	const spendable = ratio * ancientSouls;

	if (spendable < 1) {
		return 0;
	}

	return Math.floor(Math.pow(8 * spendable + 1, 0.5) / 2 - 0.5);
}

/** Transcendent Power as a fraction, the form every formula below wants. */
export function transcendentPowerFor(ancientSouls: number) {
	return (25 - 23 * Math.exp(-0.0003 * ancientSouls)) / 100;
}

/**
 * Transcendent Power as the game shows it. Truncated rather than rounded, and
 * pinned below 25% until the point where the game itself would print 25%,
 * so the two never disagree.
 */
export function formatTranscendentPower(ancientSouls: number) {
	if (ancientSouls >= 124767) {
		return '25%';
	}

	const percent = 25 - 23 * Math.exp(-0.0003 * ancientSouls);

	if (percent === 25) {
		return '24.9999%';
	}

	return `${percent.toString().substring(0, percent < 10 ? 6 : 7)}%`;
}

const chorgorlothCap = 150;
const chorgorlothCapCost = outsiderCost(chorgorlothCap);
/** Chor'gorloth shaves 5% off ancient costs per level. */
const chorgorlothMultiplier = 1 / 0.95;
/** Where the tabulated end-game routes stop: nothing reaches past this zone. */
export const maxReachableZone = 5.46e6;

/**
 * Split the souls left after Borb between Chor'gorloth, Phandoryss and
 * Ponyboy. Each candidate is scored by how much its next level multiplies
 * damage or hero souls, taken to the power of one over what that level costs,
 * so the three are comparable per soul spent.
 */
function splitCoreOutsiders(ancientSouls: number, transcendentPower: number, zone: number) {
	if (ancientSouls > 20000) {
		// Past this point Chor'gorloth is always worth capping first, and the
		// per-level comparison below would only spend a long time agreeing.
		let remaining = ancientSouls - chorgorlothCapCost;
		const ponyboy = affordableLevel(0.88, remaining);
		remaining -= outsiderCost(ponyboy);

		return { chorgorloth: chorgorlothCap, phandoryss: remaining, ponyboy };
	}

	const hpMultiplier = Math.min(1.545, 1.145 + zone / 500000);
	const heroSoulMultiplier = Math.pow(1 + transcendentPower, 0.2);
	const heroDamageMultiplier = zone > 1.2e6 ? 1000 : zone > 168000 ? 4.5 : 4;
	const heroCostMultiplier = zone > 1.2e6 ? 1.22 : 1.07;
	const goldToDps = log10(heroDamageMultiplier) / log10(heroCostMultiplier) / 25;
	const dpsToZones = log10(hpMultiplier) - log10(1.15) * goldToDps;

	let remaining = ancientSouls;
	let chorgorloth = 0;
	let phandoryss = 0;
	let ponyboy = 0;

	while (remaining > 0) {
		if (ponyboy < 1) {
			remaining -= ++ponyboy;
			continue;
		}

		if (phandoryss < 3) {
			phandoryss++;
			remaining--;
			continue;
		}

		const damageIncrease = (phandoryss + 2) / (phandoryss + 1);
		const zoneIncrease = log10(damageIncrease) / dpsToZones;
		let phandoryssValue = Math.pow(heroSoulMultiplier, zoneIncrease);

		// Early Phandoryss levels also pull the first-ascension breakpoint in,
		// which the raw damage figure does not capture.
		if (phandoryss < 50) {
			phandoryssValue *= Math.pow(1.1, 1 / phandoryss);
		}

		if (chorgorloth < remaining && chorgorloth < chorgorlothCap) {
			const chorgorlothValue = Math.pow(chorgorlothMultiplier, 1 / (chorgorloth + 1));

			if (chorgorlothValue >= phandoryssValue) {
				if (ponyboy < remaining) {
					const ponyboyValue = Math.pow(
						(Math.pow(ponyboy + 1, 2) * 10 + 1) / (Math.pow(ponyboy, 2) * 10 + 1),
						1 / (ponyboy + 1)
					);

					if (ponyboyValue >= chorgorlothValue) {
						remaining -= ++ponyboy;
						continue;
					}
				}

				remaining -= ++chorgorloth;
				continue;
			}
		}

		if (ponyboy < remaining) {
			const ponyboyValue = Math.pow(
				(Math.pow(ponyboy + 1, 2) * 10 + 1) / (Math.pow(ponyboy, 2) * 10 + 1),
				1 / (ponyboy + 1)
			);

			if (ponyboyValue >= phandoryssValue) {
				remaining -= ++ponyboy;
				continue;
			}
		}

		phandoryss++;
		remaining--;
	}

	return { chorgorloth, phandoryss, ponyboy };
}

/**
 * Borb needed to still hit two monsters per zone right after the *first*
 * ascension of the next transcension, which is what makes early runs quick.
 * Half the souls stand in for the outsider spread you will actually have then.
 */
function borbForFirstAscension(ancientSouls: number, transcendentPower: number) {
	const { chorgorloth, ponyboy } = splitCoreOutsiders(ancientSouls * 0.5, transcendentPower, 100);
	const ponyboyBonus = Math.pow(ponyboy, 2) * 10 + 1;
	const transcendence = 1 + transcendentPower;
	const squared = transcendence * transcendence;
	const primalSeries = squared + squared * squared + squared * squared * squared;
	const heroSouls = 20 * ponyboyBonus * primalSeries;
	const logHeroSouls = log10(Math.max(1, heroSouls)) + log10(Math.pow(chorgorlothMultiplier, chorgorloth));
	// `Math.log(2)` rather than `log10(2)` here, faithfully to the original.
	const kumawakamaru = Math.max(1, Math.floor(logHeroSouls / log10(2) - 3 / Math.log(2)) - 1);
	const kumawakamaruEffect = 8 * (1 - Math.exp(-0.025 * kumawakamaru));

	return Math.ceil((8 / kumawakamaruEffect - 1) * 8);
}

/** Where this transcension can realistically end, from the souls it starts with. */
function projectHighestZone(ancientSouls: number, transcendentPower: number) {
	if (ancientSouls === 0) {
		// The zone transcendence unlocks at.
		return { highestZone: 300, borbTarget: 0 };
	}

	if (ancientSouls < 100) {
		const souls = ancientSouls + 42;

		return {
			highestZone: ((souls / 5 - 6) * 51.8 * Math.log(1.25)) / Math.log(1 + transcendentPower),
			borbTarget: 0
		};
	}

	if (ancientSouls < 10500) {
		return { highestZone: (1 - Math.exp(-ancientSouls / 3900)) * 200000 + 4800, borbTarget: 0 };
	}

	if (ancientSouls < 21000) {
		const offset = 8000 + ((10500 - ancientSouls) / 10500) * 4000;

		return { highestZone: ancientSouls * 10.32 + offset * 12, borbTarget: 0 };
	}

	// Past 21k the run is Borb-limited: everything but a small float goes into
	// Borb, and how far you get is whatever that Borb level reached in practice.
	const nonBorbSouls = ancientSouls > 433000 ? 500 : 1000;
	const borbLevel = affordableLevel(1, ancientSouls - nonBorbSouls);
	const borbTarget = borbLevel * 5000;

	if (borbLevel > 1026) {
		return { highestZone: maxReachableZone, borbTarget };
	}

	const tabulatedZone = zoneForBorbLevel(borbLevel);

	return {
		borbTarget,
		highestZone: tabulatedZone ? Math.max(borbTarget + 500, tabulatedZone) : borbTarget + 500
	};
}

export type ZoneStats = {
	monstersPerZone: number;
	/** Unbuffed is a multiplier (0-1); buffed is a percentage. */
	treasureChestChance: number;
	bossHealth: number;
	bossTimer: number;
	primalBossChance: number;
};

export type OutsiderRecommendation = OutsiderDefinition & {
	level: number;
	cost: number;
};

export type OutsidersCalculation = {
	ancientSouls: number;
	/** Fraction, not percent. */
	transcendentPower: number;
	levels: OutsiderLevels;
	rows: OutsiderRecommendation[];
	/** `xyl/chor/phan/pony//borb/rha/kar/orph/sen`, the community's paste format. */
	shareString: string;
	ancientSoulsSpent: number;
	ancientSoulsUnspent: number;
	ancientSoulsReserved: number;
	/** Where this plan expects the transcension to end. */
	highestZone: number;
	logHeroSouls: number;
	nextAncientSouls: number;
	ancientSoulsGained: number;
	/** Fraction, not percent. */
	nextTranscendentPower: number;
	/** Level every ancient reaches at `highestZone`, by the rules of thumb. */
	ancientLevels: number;
	/** Each ancient's effect at that level, signed the way the game shows it. */
	ancientEffects: {
		kumawakamaru: number;
		atman: number;
		bubos: number;
		chronos: number;
		dora: number;
	};
	unbuffed: ZoneStats;
	buffed: ZoneStats;
	/** Zone at which each buffed stat hits its floor or ceiling. */
	breakpoints: {
		highMonstersPerZone: number;
		primalChanceFloor: number;
		bossHealthCeiling: number;
		bossTimerFloor: number;
		treasureChestCeiling: number;
		treasureChestFloor: number;
	};
	/** Borb the last ascension needs, versus the one the early ones want. */
	borbForZone: number;
	borbForFirstAscension: number;
	hints: string[];
};

type PlanOptions = {
	ancientSouls: number;
	settings: OutsidersSettings;
	/** The simulator honours the reserve setting; the upstream fixtures do not. */
	applyReserve?: boolean;
};

export function calculateOutsiders({
	ancientSouls: rawAncientSouls,
	settings,
	applyReserve = true
}: PlanOptions): OutsidersCalculation {
	const ancientSouls = Math.max(0, Math.floor(rawAncientSouls) || 0);
	const transcendentPower = transcendentPowerFor(ancientSouls);

	const projected =
		settings.zoneOverride > 0
			? { highestZone: settings.zoneOverride, borbTarget: 0 }
			: projectHighestZone(ancientSouls, transcendentPower);
	const highestZone = Math.floor(projected.highestZone);
	const { borbTarget } = projected;

	// Hero souls the run ends on, which is what sets every ancient's level.
	const endLogHeroSouls = (log10(1 + transcendentPower) * highestZone) / 5 + 6;
	const ancientLevels = Math.floor(endLogHeroSouls / log10(2) - 3 / log10(2)) - 1;
	const kumawakamaru = -8 * (1 - Math.exp(-0.025 * ancientLevels));
	const atman = 75 * (1 - Math.exp(-0.013 * ancientLevels));
	const bubos = -5 * (1 - Math.exp(-0.002 * ancientLevels));
	const chronos = 30 * (1 - Math.exp(-0.034 * ancientLevels));
	const dora = 9900 * (1 - Math.exp(-0.002 * ancientLevels));

	// Every 500 zones the game makes monsters, bosses and chests worse.
	const nerfs = Math.floor(highestZone / 500);
	const unbuffed: ZoneStats = {
		bossHealth: 10 + nerfs * 0.4,
		bossTimer: 30 - nerfs * 2,
		monstersPerZone: roundToHundredths(10 + nerfs * 0.1),
		primalBossChance: 25 - nerfs * 2,
		treasureChestChance: 1 - 0.99999999 * (1 - Math.exp(-0.006 * nerfs))
	};

	// Levels past these do nothing, because the stat they buy is already at its
	// floor (or ceiling) by the time you get there.
	const borbCap = borbTarget
		? Math.ceil((borbTarget - 500) / 5000)
		: ancientSouls >= 10500
			? Math.ceil((highestZone - 500) / 5000)
			: Math.max(0, Math.ceil(((unbuffed.monstersPerZone - 2.1) / -kumawakamaru - 1) / 0.125));
	const rhageistCap = Math.ceil(((100 - unbuffed.primalBossChance) / atman - 1) / 0.25);
	const kariquaCap = Math.ceil(((unbuffed.bossHealth - 5) / -bubos - 1) / 0.5);
	const orphalasCap = Math.max(1, Math.ceil(((2 - unbuffed.bossTimer) / chronos - 1) / 0.75)) + 2;
	const senakhanCap = Math.max(1, Math.ceil(100 / unbuffed.treasureChestChance / (dora / 100 + 1) - 1));

	// Shares of the remaining souls each super outsider is allowed to take. They
	// fade in over the first hundred souls and switch off entirely once the run
	// is long enough that no realistic level keeps their stat capped.
	const superShare = ancientSouls < 100 ? ancientSouls / 100 : ancientSouls < 21000 ? 1 : 0;
	const rhageistShare = 0.2 * superShare;
	const kariquaShare = 0.01 * superShare;
	const orphalasShare = settings.levelOrphalas ? 0.05 * superShare : 0;
	const senakhanShare = 0.05 * superShare;

	let remaining = ancientSouls;

	const wantedBorbForFirstAscension = borbForFirstAscension(ancientSouls, transcendentPower);
	const borbForFant =
		ancientSouls <= 2000 ? Math.min(affordableLevel(0.35, remaining), wantedBorbForFirstAscension) : 0;
	const borbForZone =
		remaining >= 21000
			? borbCap
			: Math.min(affordableLevel(ancientSouls >= 50 ? 0.99 : 0.5, remaining), borbCap + 1);
	let borb = Math.max(borbForFant, borbForZone);

	// Always leave a few souls behind: a plan that buys Borb and nothing else
	// cannot ascend fast enough to be worth it.
	if (outsiderCost(borb) > remaining - 5) {
		borb = affordableLevel(1, remaining - 5);
	}

	remaining -= outsiderCost(borb);

	// Xyliqil boosts idle bonuses, and no modern build is idle.
	const xyliqil = 0;

	const ancientSoulsReserved = applyReserve && settings.reserveAncientSouls ? Math.floor(remaining * 0.1) : 0;
	remaining -= ancientSoulsReserved;

	const capOrShare = (cap: number, share: number) =>
		outsiderCost(cap) > remaining * share ? affordableLevel(share, remaining) : cap;

	const rhageist = capOrShare(rhageistCap, rhageistShare);
	const kariqua = capOrShare(kariquaCap, kariquaShare);
	const orphalas = capOrShare(orphalasCap, orphalasShare);
	const senakhan = capOrShare(senakhanCap, senakhanShare);

	remaining -= outsiderCost(rhageist);
	remaining -= outsiderCost(kariqua);
	remaining -= outsiderCost(orphalas);
	remaining -= outsiderCost(senakhan);

	const core = splitCoreOutsiders(remaining, transcendentPower, highestZone);
	remaining -= outsiderCost(core.chorgorloth);
	remaining -= outsiderCost(core.phandoryss, true);
	remaining -= outsiderCost(core.ponyboy);

	const levels: OutsiderLevels = {
		borb,
		chorgorloth: core.chorgorloth,
		kariqua,
		orphalas,
		phandoryss: core.phandoryss,
		ponyboy: core.ponyboy,
		rhageist,
		senakhan,
		xyliqil
	};

	const rows = outsiderDefinitions.map((definition) => ({
		...definition,
		cost: outsiderCost(levels[definition.key], definition.flatCost),
		level: levels[definition.key]
	}));

	// Hero souls the run finishes with, now that the outsider levels are known.
	const ponyboyBonus = Math.pow(core.ponyboy, 2) * 10;
	const primalSeries = 1 / (1 - 1 / (1 + transcendentPower));
	const buffed: ZoneStats = {
		bossHealth: Math.floor(Math.max(5, unbuffed.bossHealth + bubos * (1 + kariqua * 0.5))),
		bossTimer: Math.max(2, unbuffed.bossTimer + chronos * (1 + orphalas * 0.75)),
		monstersPerZone: unbuffed.monstersPerZone + kumawakamaru * (1 + borb / 8),
		primalBossChance: Math.max(5, unbuffed.primalBossChance + atman * (1 + rhageist * 0.25)),
		treasureChestChance: Math.max(1, ((dora * (1 + senakhan)) / 100 + 1) * unbuffed.treasureChestChance)
	};
	const primalChanceMultiplier = Math.min(buffed.primalBossChance, 100) / 100;
	const logHeroSouls =
		(log10(1 + transcendentPower) * (highestZone - 100)) / 5 +
		log10(ponyboyBonus + 1) +
		log10(20 * primalSeries * primalChanceMultiplier);
	const nextAncientSouls = Math.max(ancientSouls, Math.floor(logHeroSouls * 5));

	return {
		ancientEffects: { atman, bubos, chronos, dora, kumawakamaru },
		ancientLevels,
		ancientSouls,
		ancientSoulsGained: nextAncientSouls - ancientSouls,
		ancientSoulsReserved,
		ancientSoulsSpent: ancientSouls - remaining - ancientSoulsReserved,
		ancientSoulsUnspent: remaining + ancientSoulsReserved,
		borbForFirstAscension: wantedBorbForFirstAscension,
		borbForZone,
		breakpoints: {
			bossHealthCeiling: Math.ceil((bubos * (1 + kariqua / 2) * -10 - 10) / 0.4) * 500,
			bossTimerFloor: 7000 + Math.floor((chronos * (1 + orphalas * 0.75)) / 2) * 500,
			highMonstersPerZone: -39500 - Math.floor(kumawakamaru * (1 + borb / 8) * 10) * 500,
			primalChanceFloor: 5500 + Math.floor((atman * (1 + rhageist / 4)) / 2) * 500,
			treasureChestCeiling:
				Math.ceil(Math.log(0.995 / ((dora / 10000) * (1 + senakhan) + 0.01)) / -0.006) * 500,
			treasureChestFloor: Math.ceil(Math.log(0.015 / ((dora / 10000) * (1 + senakhan) + 0.01)) / -0.006) * 500
		},
		buffed,
		highestZone,
		hints: buildHints({
			ancientSouls,
			borb,
			borbForFirstAscension: wantedBorbForFirstAscension,
			borbForZone,
			buffedMonstersPerZone: buffed.monstersPerZone,
			highestZone
		}),
		levels,
		logHeroSouls,
		nextAncientSouls,
		nextTranscendentPower: transcendentPowerFor(nextAncientSouls),
		rows,
		shareString: `${xyliqil}/${core.chorgorloth}/${core.phandoryss}/${core.ponyboy}//${borb}/${rhageist}/${kariqua}/${orphalas}/${senakhan}`,
		transcendentPower,
		unbuffed
	};
}

/** Two decimal places, matching how the game reports monsters per zone. */
function roundToHundredths(value: number) {
	return Math.round(value * 100) / 100;
}

type HintContext = {
	ancientSouls: number;
	borb: number;
	borbForFirstAscension: number;
	borbForZone: number;
	buffedMonstersPerZone: number;
	highestZone: number;
};

/** The original's contextual advice, as plain sentences. */
function buildHints({
	ancientSouls,
	borb,
	borbForFirstAscension: borbFant,
	borbForZone,
	buffedMonstersPerZone,
	highestZone
}: HintContext) {
	const hints: string[] = [];

	if (ancientSouls === 0) {
		hints.push(
			'You need ancient souls for this to work. Transcend as soon as you unlock transcendence at zone 300. It is worth it.'
		);

		return hints;
	}

	if (ancientSouls < 2000) {
		hints.push(
			'Your first ascension should be at zone 130, so you unlock Kumawakamaru and a few other ancients as soon as possible. That speeds up every ascension after it.'
		);

		if (borbForZone < borb && ancientSouls > 50) {
			hints.push(
				`Only ${borbForZone} Borb is needed for two monsters per zone on your final ascension, but ${borbFant} is needed for two monsters per zone after ascending for the first time at zone 130.`
			);
			hints.push(
				'There are more ascensions than the last one, so Borb is levelled higher to speed up the earlier ones.'
			);
		}
	}

	if (ancientSouls < 10500) {
		hints.push(
			'Transcend after 3 or 4 ascensions that give new ancient souls. An ascension only counts if it earns you more hero souls than your previous transcension.'
		);
		hints.push(
			'The highest zone below is an estimate and assumes active play, which you should switch to as soon as you have two autoclickers.'
		);

		return hints;
	}

	if (ancientSouls < 27000) {
		hints.push(
			'The "3 or 4 ascensions that give ancient souls" guideline does not apply beyond 24% Transcendent Power.'
		);
		hints.push(
			'Keep ascending until you reach at least the estimated highest zone below. That takes more ascensions than you are used to.'
		);
		hints.push(
			'You are getting close to 25% Transcendent Power, so transcending no longer gives the boost it used to.'
		);
	}

	if (ancientSouls >= 21000) {
		if (ancientSouls < 50000) {
			hints.push(
				'You have enough Transcendent Power to reach any hero. Borb is your only limit now, and putting more levels into it is the only reason to transcend.'
			);
			hints.push(
				'The last four outsiders are impractical to maintain at high zones, so they are kept at 0. This is not a bug.'
			);
		}

		if (highestZone < 5.37e6 && buffedMonstersPerZone > 10) {
			hints.push(
				'You can do one less ascension than the highest zone estimate asks for if you want a more pleasant run. It is only slightly worse long term.'
			);
		}
	}

	return hints;
}

export type TranscensionRow = {
	ancientSouls: number;
	borbLevel: number;
	highestZone: number;
	monstersPerZone: number;
	/** `null` when the route is not tabulated, or when nothing reaches the zone. */
	durationSeconds: number | null;
	durationLabel: string;
	nextAncientSouls: number;
};

export type TranscensionSimulation = {
	rows: TranscensionRow[];
	/** Ancient souls the last projected transcension ends on. */
	finalAncientSouls: number;
	/** Whether `maxRows` cut the projection short. */
	truncated: boolean;
};

/**
 * Every transcension from here to the end of the game, each one starting with
 * the souls the previous one earned. A zone override pins the run to a zone you
 * chose, which says nothing about the runs after it, so only one row comes back.
 */
export function simulateTranscensions({
	calculation,
	settings,
	maxRows = 400
}: {
	calculation: OutsidersCalculation;
	settings: OutsidersSettings;
	maxRows?: number;
}): TranscensionSimulation {
	const toRow = (source: OutsidersCalculation): TranscensionRow => {
		const durationSeconds = transcensionDurationSeconds(source.levels.borb, source.highestZone);

		return {
			ancientSouls: source.ancientSouls,
			borbLevel: source.levels.borb,
			durationLabel: durationSeconds === null ? '-' : formatLongDuration(durationSeconds),
			durationSeconds,
			highestZone: source.highestZone,
			monstersPerZone: source.buffed.monstersPerZone,
			nextAncientSouls: source.nextAncientSouls
		};
	};

	const rows = [toRow(calculation)];
	let current = calculation;

	if (settings.zoneOverride > 0) {
		return { finalAncientSouls: current.nextAncientSouls, rows, truncated: false };
	}

	while (current.highestZone < maxReachableZone) {
		if (rows.length >= maxRows) {
			return { finalAncientSouls: current.nextAncientSouls, rows, truncated: true };
		}

		const next = calculateOutsiders({ ancientSouls: current.nextAncientSouls, settings });

		// A transcension that earns nothing new would loop forever.
		if (next.nextAncientSouls <= current.nextAncientSouls) {
			rows.push(toRow(next));
			return { finalAncientSouls: next.nextAncientSouls, rows, truncated: true };
		}

		rows.push(toRow(next));
		current = next;
	}

	return { finalAncientSouls: current.nextAncientSouls, rows, truncated: false };
}

const zonesPerHourBelowMillion = 8050;
/** Fixed overhead of an ascension: hero re-levelling, gilding, and so on. */
const ascensionOverheadSeconds = 3600;

/**
 * How long a transcension takes, in seconds. Below zone 200,000 runs are quick
 * enough that the original does not bother, and past the tabulated routes
 * nothing finishes at all — both come back as `null`.
 */
function transcensionDurationSeconds(borbLevel: number, zone: number) {
	if (zone < 200000) {
		return null;
	}

	if (zone >= maxReachableZone) {
		return null;
	}

	if (zone < 1e6) {
		return Math.floor((zone / zonesPerHourBelowMillion) * 3600);
	}

	const lastTabulatedZone = ascensionDurations[ascensionDurations.length - 1][0];

	if (zone > lastTabulatedZone) {
		return null;
	}

	const borbLimit = borbLevel * 5000;
	let durationSeconds = (1e6 / zonesPerHourBelowMillion) * 3600;
	let tabulatedZone = 0;
	let index = 0;

	do {
		const [ascensionZone, ascensionSeconds] = ascensionDurations[index++];
		tabulatedZone = ascensionZone;
		durationSeconds += ascensionSeconds;

		// Zones past Borb's reach stop being instakills, and the walk out there
		// costs quadratically more the further past it you go.
		if (tabulatedZone > borbLimit + 499) {
			const zonesPastBorb = tabulatedZone - borbLimit;
			durationSeconds += Math.ceil(
				((zonesPastBorb * zonesPastBorb) / 10830 / zonesPerHourBelowMillion) * 3600
			);
		}

		durationSeconds += ascensionOverheadSeconds;
	} while (tabulatedZone < zone && index < ascensionDurations.length);

	return durationSeconds;
}

export type OutsidersSnapshot = {
	/** Every ancient soul ever earned, which is what the planner spends. */
	ancientSoulsTotal: number;
	/** Ancient souls not currently sunk into an outsider. */
	ancientSoulsUnspent: number;
	outsiderLevels: Record<number, number>;
	transcendent: boolean;
};

export function readOutsidersSnapshot(saveData: SaveData | null | undefined): OutsidersSnapshot | null {
	if (!saveData) {
		return null;
	}

	const outsiders = getValueAtPath<Record<string, unknown>>(saveData, ['outsiders', 'outsiders']);

	if (!outsiders || typeof outsiders !== 'object') {
		return null;
	}

	const outsiderLevels: Record<number, number> = {};

	for (const definition of outsiderDefinitions) {
		outsiderLevels[definition.id] = toWholeNumber(
			getValueAtPath(saveData, ['outsiders', 'outsiders', definition.id, 'level'])
		);
	}

	return {
		ancientSoulsTotal: toWholeNumber(saveData.ancientSoulsTotal),
		ancientSoulsUnspent: toWholeNumber(saveData.ancientSouls),
		outsiderLevels,
		transcendent: saveData.transcendent === true
	};
}

export type OutsiderAutoLevelPlan = {
	updates: ValueUpdate[];
	/** Outsiders already levelled past the recommendation, which needs a respec. */
	blockedBy: OutsiderDefinition[];
};

/**
 * Save writes that apply a plan to the loaded save. Outsider levels can only go
 * up without a respec, so an outsider that is already higher than the plan
 * blocks the whole thing rather than being silently left alone.
 */
export function planOutsiderAutoLevel({
	calculation,
	snapshot
}: {
	calculation: OutsidersCalculation;
	snapshot: OutsidersSnapshot;
}): OutsiderAutoLevelPlan {
	const updates: ValueUpdate[] = [];
	const blockedBy: OutsiderDefinition[] = [];

	for (const definition of outsiderDefinitions) {
		const level = calculation.levels[definition.key];
		const currentLevel = snapshot.outsiderLevels[definition.id] ?? 0;

		if (currentLevel > level) {
			blockedBy.push(definition);
			continue;
		}

		const path = (field: string): PathSegment[] => ['outsiders', 'outsiders', definition.id, field];

		updates.push({ path: path('level'), value: level });
		updates.push({ path: path('spentAncientSouls'), value: outsiderCost(level, definition.flatCost) });
	}

	if (blockedBy.length > 0) {
		return { blockedBy, updates: [] };
	}

	updates.push({ path: ['ancientSouls'], value: calculation.ancientSoulsUnspent });

	return { blockedBy, updates };
}

function toWholeNumber(value: unknown) {
	const numericValue = typeof value === 'number' ? value : Number(String(value ?? '').trim());

	return Number.isFinite(numericValue) ? Math.floor(numericValue) : 0;
}
