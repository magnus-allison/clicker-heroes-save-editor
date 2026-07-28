import Decimal from 'decimal.js';

import { formatNumber } from '@/lib/format';
import { getValueAtPath, type SaveData } from '@/lib/save-utils';

/**
 * Ancient level optimiser, ported from the kepow.org calculator
 * (github.com/zuils/ClickerHeroesCalculator, MIT). It distributes the hero
 * souls you have available over the ancients you own using the community
 * "Rules of Thumb":
 * https://www.reddit.com/r/ClickerHeroes/comments/4naohc/math_and_transcendance/
 *
 * Everything here is pure so the component can memoise a whole run: read a
 * snapshot out of the save with `readAncientsSnapshot`, then feed it to
 * `calculateAncients` alongside the on-page settings.
 */

export type BuildMode = 'idle' | 'hybrid' | 'active';
export type HeroTier = 'base' | 'e9' | 'e10' | 'scout';

export type AncientsSettings = {
	buildMode: BuildMode;
	heroTier: HeroTier;
	/** Fragsworth levels per Siyalatas level. Only used by hybrid builds. */
	hybridRatio: number;
	/** 0 = never level Revolc, 1 = level it as hard as the rules allow. */
	revolcRate: number;
	/** Same scale as `revolcRate`, applied to the skill duration ancients. */
	skillAncientsRate: number;
	/** Significant digits the optimiser converges to. */
	precision: number;
	includeSoulsAfterAscension: boolean;
	keepSoulsForRegilding: boolean;
	ignoreMinimizedAncients: boolean;
};

export const defaultAncientsSettings = {
	buildMode: 'idle',
	heroTier: 'base',
	hybridRatio: 5,
	revolcRate: 0.3,
	skillAncientsRate: 0.1,
	precision: 7,
	includeSoulsAfterAscension: false,
	keepSoulsForRegilding: false,
	ignoreMinimizedAncients: false
} satisfies AncientsSettings;

export const buildModeOptions = [
	{ label: 'Idle', value: 'idle' },
	{ label: 'Hybrid', value: 'hybrid' },
	{ label: 'Active', value: 'active' }
] as const satisfies readonly { label: string; value: BuildMode }[];

export const heroTierOptions = [
	{ label: 'Treebeast - Lvl 7,999 Wepwawet', value: 'base' },
	{ label: 'Lvl 8,000 Wepwawet - Madzi', value: 'e9' },
	{ label: 'Xavira - Yachiyl', value: 'e10' },
	{ label: 'Ace Scouts', value: 'scout' }
] as const satisfies readonly { label: string; value: HeroTier }[];

/** Hero souls the game charges per gild when regilding a hero. */
const heroSoulsPerGild = 80;
/** Hero levels that add up to one soul when ascending. */
const heroLevelsPerAscensionSoul = 2000;
const ancientSoulsPerHeroSoulDecade = 5;

/*
 * Gold-to-damage ratios per hero tier. Which hero you are pushing changes how
 * much a level of gold is worth relative to a level of damage, so the gold
 * ancients get scaled by one of these against the tuning ancient.
 */
const earlyGameGoldRatio = Math.sqrt(1 + Math.log(0.007368) / (15 * Math.log(10)));
const tsuchiGoldRatio = 0.2 * Math.sqrt(Math.log(4) / Math.log(1.07));
const xaviraGoldRatio = 0.2 * Math.sqrt(Math.log(4.5) / Math.log(1.07));
const scoutsGoldRatio = 0.2 * Math.sqrt(Math.log(1000) / Math.log(1.22));

/** Per-level hero soul cost, keyed the same way the game data keys it. */
type CostFormula = 'one' | 'linear' | 'polynomial1_5' | 'exponential2';

type GoalContext = {
	/** Level of the tuning ancient (Siyalatas, or Fragsworth for active). */
	baseLevel: Decimal;
	currentLevel: Decimal;
	alpha: Decimal;
	transcendent: boolean;
	heroTier: HeroTier;
	hybridRatio: Decimal;
	settings: AncientsSettings;
};

type GoalFunction = (context: GoalContext) => Decimal;

export type AncientDefinition = {
	id: number;
	key: string;
	name: string;
	effect: string;
	cost: CostFormula;
	/**
	 * Soft cap from the reference calculator rather than the game data, which
	 * reports no cap. Past these levels the ancient's own diminishing returns
	 * make further levels worthless.
	 */
	cap?: number;
	goals: Partial<Record<BuildMode, GoalFunction>>;
	/** Ancients the settings can switch off entirely. */
	exclude?: (settings: AncientsSettings) => boolean;
};

const goldRatio = (heroTier: HeroTier) => {
	if (heroTier === 'base') {
		return earlyGameGoldRatio;
	}

	if (heroTier === 'e9') {
		return tsuchiGoldRatio;
	}

	if (heroTier === 'e10') {
		return xaviraGoldRatio;
	}

	return scoutsGoldRatio;
};

/**
 * Ancients that are useful to both builds are levelled against whichever of
 * Siyalatas or Fragsworth is further ahead, which for hybrid means the tuning
 * ancient scaled by the hybrid ratio.
 */
const hybridBaseLevel = ({ baseLevel, hybridRatio }: GoalContext) =>
	Decimal.max(baseLevel, baseLevel.times(hybridRatio));

const skillBaseLevel = (context: GoalContext, rate: number) =>
	hybridBaseLevel(context).times(new Decimal(rate).pow(2));

/**
 * Shared shape of the rules for the "diminishing returns" ancients: level up
 * to where the next level's marginal gain drops below the tuning ancient's.
 */
const diminishingGoal = ({
	baseLevel,
	coefficient,
	decay,
	innerCoefficient,
	limit,
	offset,
	currentLevel,
	subtract
}: {
	baseLevel: Decimal;
	coefficient: number;
	/** Exponential decay rate of the ancient's own bonus. */
	decay: number;
	/** Defaults to half of `coefficient`, which is all but one of the rules. */
	innerCoefficient?: number;
	/** Constant the decaying term is combined with. */
	limit: Decimal;
	offset: number;
	currentLevel: Decimal;
	/** Whether the decaying term is subtracted from, or added to, `limit`. */
	subtract: boolean;
}) => {
	const decayTerm = currentLevel.times(-decay).exp();
	const inner = subtract ? limit.minus(decayTerm) : limit.plus(decayTerm);

	return baseLevel
		.ln()
		.times(coefficient)
		.minus(inner.ln().times(innerCoefficient ?? coefficient / 2))
		.minus(offset);
};

/** Chronos-shaped rule, shared by every skill duration ancient. */
const skillDurationGoal = (baseLevel: Decimal, currentLevel: Decimal) =>
	diminishingGoal({
		baseLevel,
		coefficient: 2.75,
		currentLevel,
		decay: 0.034,
		limit: new Decimal(2),
		offset: 5.1,
		subtract: true
	});

const excludeWithoutSkillRate = (settings: AncientsSettings) => settings.skillAncientsRate <= 0;

const skillAncient = (id: number, key: string, name: string, effect: string): AncientDefinition => {
	const goal: GoalFunction = (context) =>
		skillDurationGoal(skillBaseLevel(context, context.settings.skillAncientsRate), context.currentLevel);

	return {
		cost: 'exponential2',
		effect,
		exclude: excludeWithoutSkillRate,
		goals: { active: goal, hybrid: goal, idle: goal },
		id,
		key,
		name
	};
};

/**
 * Every ancient the optimiser has a rule for, by save-file id. Ancients that
 * were removed from the game before transcendence (Khrysos, Thusia, Iris) have
 * no rule and are left out.
 */
export const ancientDefinitions: AncientDefinition[] = [
	{
		id: 3,
		key: 'solomon',
		name: 'Solomon',
		effect: '+% Primal Hero Souls',
		cost: 'polynomial1_5',
		goals: {
			active: solomonGoal,
			hybrid: solomonGoal,
			idle: solomonGoal
		}
	},
	{
		id: 4,
		key: 'libertas',
		name: 'Libertas',
		effect: '+% gold from monsters while idle',
		cost: 'linear',
		goals: {
			hybrid: goldAncientIdleGoal,
			idle: goldAncientIdleGoal
		}
	},
	{
		id: 5,
		key: 'siyalatas',
		name: 'Siyalatas',
		effect: '+% DPS while idle',
		cost: 'linear',
		goals: {
			hybrid: ({ baseLevel }) => baseLevel,
			idle: ({ baseLevel }) => baseLevel
		}
	},
	{
		id: 8,
		key: 'mammon',
		name: 'Mammon',
		effect: '+% gold dropped',
		cost: 'linear',
		goals: {
			active: goldAncientGoal,
			hybrid: goldAncientGoal,
			idle: goldAncientGoal
		}
	},
	{
		id: 9,
		key: 'mimzee',
		name: 'Mimzee',
		effect: '+% gold from treasure chests',
		cost: 'linear',
		goals: {
			active: goldAncientGoal,
			hybrid: goldAncientGoal,
			idle: goldAncientGoal
		}
	},
	{
		id: 10,
		key: 'pluto',
		name: 'Pluto',
		effect: '+% gold from Golden Clicks',
		cost: 'linear',
		goals: {
			active: goldAncientGoal,
			hybrid: goldAncientGoal
		}
	},
	{
		id: 11,
		key: 'dogcog',
		name: 'Dogcog',
		effect: '-% hero hire and level-up cost',
		cost: 'exponential2',
		cap: 3743,
		goals: {
			active: dogcogGoal,
			hybrid: dogcogGoal,
			idle: dogcogGoal
		}
	},
	{
		id: 12,
		key: 'fortuna',
		name: 'Fortuna',
		effect: '+% chance of 10x gold',
		cost: 'exponential2',
		cap: 14972,
		goals: {
			active: fortunaGoal,
			hybrid: fortunaGoal,
			idle: fortunaGoal
		}
	},
	{
		id: 13,
		key: 'atman',
		name: 'Atman',
		effect: '+% chance of Primal Bosses',
		cost: 'exponential2',
		cap: 2880,
		goals: {
			active: atmanGoal,
			hybrid: atmanGoal,
			idle: atmanGoal
		}
	},
	{
		id: 14,
		key: 'dora',
		name: 'Dora',
		effect: '+% more treasure chests',
		cost: 'exponential2',
		cap: 18715,
		goals: {
			active: doraGoal,
			hybrid: doraGoal,
			idle: doraGoal
		}
	},
	{
		id: 15,
		key: 'bhaal',
		name: 'Bhaal',
		effect: '+% critical click damage',
		cost: 'linear',
		goals: {
			active: clickAncientGoal,
			hybrid: clickAncientGoal
		}
	},
	{
		id: 16,
		key: 'morgulis',
		name: 'Morgulis',
		effect: '+% base DPS per Hero Soul spent',
		cost: 'one',
		goals: {
			active: morgulisGoal,
			hybrid: morgulisGoal,
			idle: morgulisGoal
		}
	},
	{
		id: 17,
		key: 'chronos',
		name: 'Chronos',
		effect: '+ seconds on boss fight timers',
		cost: 'exponential2',
		cap: 1101,
		goals: {
			active: chronosGoal,
			hybrid: chronosGoal,
			idle: chronosGoal
		}
	},
	{
		id: 18,
		key: 'bubos',
		name: 'Bubos',
		effect: '-% boss life',
		cost: 'exponential2',
		cap: 18715,
		goals: {
			active: bubosGoal,
			hybrid: bubosGoal,
			idle: bubosGoal
		}
	},
	{
		id: 19,
		key: 'fragsworth',
		name: 'Fragsworth',
		effect: '+% click damage',
		cost: 'linear',
		goals: {
			active: clickAncientGoal,
			hybrid: clickAncientGoal
		}
	},
	{
		id: 20,
		key: 'vaagur',
		name: 'Vaagur',
		effect: '-% skill cooldowns',
		cost: 'exponential2',
		cap: 1440,
		exclude: excludeWithoutSkillRate,
		goals: {
			active: vaagurGoal,
			hybrid: vaagurGoal,
			idle: vaagurGoal
		}
	},
	{
		id: 21,
		key: 'kumawakamaru',
		name: 'Kumawakamaru',
		effect: '- monsters required per zone',
		cost: 'exponential2',
		cap: 1498,
		goals: {
			active: kumawakamaruGoal,
			hybrid: kumawakamaruGoal,
			idle: kumawakamaruGoal
		}
	},
	skillAncient(22, 'chawedo', 'Chawedo', '+ seconds of Clickstorm'),
	skillAncient(23, 'hecatoncheir', 'Hecatoncheir', '+ seconds of Super Clicks'),
	skillAncient(24, 'berserker', 'Berserker', '+ seconds of Powersurge'),
	skillAncient(25, 'sniperino', 'Sniperino', '+ seconds of Lucky Strikes'),
	skillAncient(26, 'energon', 'Energon', '+ seconds of Golden Clicks'),
	skillAncient(27, 'kleptos', 'Kleptos', '+ seconds of Metal Detector'),
	{
		id: 28,
		key: 'argaiv',
		name: 'Argaiv',
		effect: '+% gilded damage bonus',
		cost: 'linear',
		goals: {
			active: hybridBaseLevel,
			hybrid: hybridBaseLevel,
			idle: hybridBaseLevel
		}
	},
	{
		id: 29,
		key: 'juggernaut',
		name: 'Juggernaut',
		effect: '+% DPS per click combo',
		cost: 'polynomial1_5',
		goals: {
			active: comboAncientGoal,
			hybrid: comboAncientGoal
		}
	},
	{
		id: 31,
		key: 'revolc',
		name: 'Revolc',
		effect: '+% chance of double rubies',
		cost: 'exponential2',
		cap: 3743,
		exclude: (settings) => settings.revolcRate <= 0,
		goals: {
			active: revolcGoal,
			hybrid: revolcGoal,
			idle: revolcGoal
		}
	},
	{
		id: 32,
		key: 'nogardnit',
		name: 'Nogardnit',
		effect: '+% DPS per idle Auto Clicker',
		cost: 'polynomial1_5',
		goals: {
			hybrid: comboAncientGoal,
			idle: comboAncientGoal
		}
	}
];

/**
 * Stands in for Morgulis when you do not own it: leftover souls are worth
 * keeping unspent, and Morgulis' rule is what says how many.
 */
const soulBankDefinition: AncientDefinition = {
	cost: 'one',
	effect: 'Hero Souls held back because Morgulis is not owned',
	goals: {
		active: morgulisGoal,
		hybrid: morgulisGoal,
		idle: morgulisGoal
	},
	id: -1,
	key: 'soulbank',
	name: 'Soul Bank'
};

function solomonGoal({ alpha, baseLevel, hybridRatio, transcendent }: GoalContext) {
	const base = Decimal.max(baseLevel, baseLevel.times(hybridRatio));

	if (transcendent) {
		return base.pow(0.8).dividedBy(alpha.pow(0.4));
	}

	return Decimal.min(base, base.pow(2).times(3.25).ln().pow(0.4).times(base.pow(0.8)).times(1.15));
}

function morgulisGoal(context: GoalContext) {
	return hybridBaseLevel(context).pow(2);
}

function goldAncientGoal(context: GoalContext) {
	return hybridBaseLevel(context).times(goldRatio(context.heroTier));
}

function goldAncientIdleGoal({ baseLevel, heroTier }: GoalContext) {
	return baseLevel.times(goldRatio(heroTier));
}

function clickAncientGoal({ baseLevel, hybridRatio }: GoalContext) {
	return baseLevel.times(hybridRatio);
}

function comboAncientGoal({ baseLevel, hybridRatio }: GoalContext) {
	return baseLevel.times(hybridRatio).pow(0.8);
}

function doraGoal(context: GoalContext) {
	return diminishingGoal({
		baseLevel: hybridBaseLevel(context),
		coefficient: 2.877,
		currentLevel: context.currentLevel,
		decay: 0.002,
		innerCoefficient: 1.4365,
		limit: Decimal.div(100, 99),
		offset: 9.63,
		subtract: true
	});
}

function atmanGoal(context: GoalContext) {
	if (!context.transcendent) {
		return preTranscendenceGoal(context);
	}

	return diminishingGoal({
		baseLevel: hybridBaseLevel(context),
		coefficient: 2.832,
		currentLevel: context.currentLevel,
		decay: 0.013,
		limit: Decimal.div(4, 3),
		offset: 6.613,
		subtract: true
	}).minus(context.alpha.ln().times(1.416));
}

function kumawakamaruGoal(context: GoalContext) {
	if (!context.transcendent) {
		return preTranscendenceGoal(context);
	}

	return diminishingGoal({
		baseLevel: hybridBaseLevel(context),
		coefficient: 2.844,
		currentLevel: context.currentLevel,
		decay: 0.01,
		limit: Decimal.div(1, 4),
		offset: 7.014,
		subtract: false
	}).minus(context.alpha.ln().times(1.422));
}

function dogcogGoal(context: GoalContext) {
	return diminishingGoal({
		baseLevel: hybridBaseLevel(context),
		coefficient: 2.844,
		currentLevel: context.currentLevel,
		decay: 0.01,
		limit: Decimal.div(1, 99),
		offset: 7.232,
		subtract: false
	});
}

function fortunaGoal(context: GoalContext) {
	return diminishingGoal({
		baseLevel: hybridBaseLevel(context),
		coefficient: 2.875,
		currentLevel: context.currentLevel,
		decay: 0.0025,
		limit: Decimal.div(10, 9),
		offset: 9.3,
		subtract: true
	});
}

function bubosGoal(context: GoalContext) {
	return diminishingGoal({
		baseLevel: hybridBaseLevel(context),
		coefficient: 2.8,
		currentLevel: context.currentLevel,
		decay: 0.02,
		limit: new Decimal(1),
		offset: 5.94,
		subtract: false
	});
}

function chronosGoal(context: GoalContext) {
	return skillDurationGoal(hybridBaseLevel(context), context.currentLevel);
}

function vaagurGoal(context: GoalContext) {
	return skillDurationGoal(skillBaseLevel(context, context.settings.skillAncientsRate), context.currentLevel);
}

function revolcGoal(context: GoalContext) {
	return skillDurationGoal(skillBaseLevel(context, context.settings.revolcRate), context.currentLevel);
}

/**
 * Atman and Kumawakamaru scale off transcendent power, which a save that has
 * never transcended does not have. No rule of thumb exists for that case, so
 * the reference calculator falls back to a plain log2 of the tuning level.
 */
function preTranscendenceGoal(context: GoalContext) {
	return hybridBaseLevel(context).ln().dividedBy(new Decimal(2).ln());
}

/**
 * Cost of every level up to and including `level`: the per-level costs are
 * `1`, `n`, `2^n` and `ceil(n * sqrt(n))`, and the cost of a purchase is the
 * difference of two of these sums. `polynomial1_5` has no closed form and uses
 * the same Euler-Maclaurin approximation as the reference calculator, which
 * over-estimates very slightly; the level recommendations are unaffected.
 */
function ancientLevelCostSum(cost: CostFormula, level: Decimal) {
	switch (cost) {
		case 'one':
			return level;
		case 'linear':
			return level.times(level.plus(1)).dividedBy(2);
		case 'exponential2':
			return new Decimal(2).pow(level.plus(1)).minus(2);
		case 'polynomial1_5':
			return Decimal.div(2, 5)
				.times(level.pow(Decimal.div(5, 2)))
				.plus(Decimal.div(1, 2).times(level.pow(Decimal.div(3, 2))))
				.plus(Decimal.div(1, 8).times(level.sqrt()))
				.plus(Decimal.div(1, 1920).times(level.pow(Decimal.div(-3, 2))))
				.ceil();
	}
}

export type AncientsSnapshot = {
	heroSouls: Decimal;
	heroSoulsSacrificed: Decimal;
	/** Everything ever earned this transcension, for the ancient soul planner. */
	totalHeroSoulsEarned: Decimal;
	/** Souls the next ascension would hand over. */
	ascensionSouls: Decimal;
	ancientSoulsTotal: Decimal;
	transcendentPower: Decimal;
	transcendent: boolean;
	ascensionZone: Decimal;
	gilds: Decimal;
	chorgorlothLevel: Decimal;
	ancientLevels: Record<number, Decimal>;
	minimizedAncients: Record<number, boolean>;
	outsiderLevels: Record<number, Decimal>;
};

const chorgorlothOutsiderId = 2;
const morgulisAncientId = 16;

export function readAncientsSnapshot(saveData: SaveData | null | undefined): AncientsSnapshot | null {
	if (!saveData) {
		return null;
	}

	const ancients = getValueAtPath<Record<string, unknown>>(saveData, ['ancients', 'ancients']);

	if (!ancients || typeof ancients !== 'object') {
		return null;
	}

	const outsiders = getValueAtPath<Record<string, unknown>>(saveData, ['outsiders', 'outsiders']) ?? {};
	const heroes = getValueAtPath<Record<string, unknown>>(saveData, ['heroCollection', 'heroes']) ?? {};
	const ancientEntrySizes = getValueAtPath<Record<string, unknown>>(saveData, ['ancientEntrySizes']) ?? {};

	const ancientLevels: Record<number, Decimal> = {};
	const minimizedAncients: Record<number, boolean> = {};
	let spentHeroSouls = new Decimal(0);

	for (const definition of ancientDefinitions) {
		const entry = ancients[String(definition.id)];
		// A decimal ancient level is possible through an old game bug, and the
		// game itself floors it when charging for the next level.
		ancientLevels[definition.id] = toDecimal(readField(entry, 'level')).floor();
		minimizedAncients[definition.id] = String(definition.id) in ancientEntrySizes;
		spentHeroSouls = spentHeroSouls.plus(toDecimal(readField(entry, 'spentHeroSouls')));
	}

	const outsiderLevels: Record<number, Decimal> = {};

	for (const [id, entry] of Object.entries(outsiders)) {
		outsiderLevels[Number(id)] = toDecimal(readField(entry, 'level'));
	}

	let heroLevels = new Decimal(0);

	for (const hero of Object.values(heroes)) {
		heroLevels = heroLevels.plus(toDecimal(readField(hero, 'level')));
	}

	const heroSouls = toDecimal(saveData.heroSouls);
	const heroSoulsSacrificed = toDecimal(saveData.heroSoulsSacrificed);
	const ancientSoulsTotal = toDecimal(saveData.ancientSoulsTotal);
	const transcendent = saveData.transcendent === true;
	const ascensionSouls = heroLevels
		.dividedBy(heroLevelsPerAscensionSoul)
		.floor()
		.plus(toDecimal(saveData.primalSouls));

	return {
		ancientLevels,
		ancientSoulsTotal,
		ascensionSouls,
		ascensionZone: toDecimal(saveData.highestFinishedZonePersist),
		chorgorlothLevel: outsiderLevels[chorgorlothOutsiderId] ?? new Decimal(0),
		gilds: readGilds(saveData),
		heroSouls,
		heroSoulsSacrificed,
		minimizedAncients,
		outsiderLevels,
		totalHeroSoulsEarned: heroSoulsSacrificed.plus(heroSouls).plus(spentHeroSouls),
		transcendent,
		transcendentPower: readTranscendentPower(ancientSoulsTotal, transcendent)
	};
}

/** One gild per ten zones past 90, plus any handed out separately. */
function readGilds(saveData: SaveData) {
	const receivedUpTo = toDecimal(saveData.epicHeroReceivedUpTo);
	const awarded = Decimal.max(0, receivedUpTo.minus(90).dividedBy(10));

	return awarded.plus(toDecimal(saveData.extraGildsAwarded));
}

function readTranscendentPower(ancientSoulsTotal: Decimal, transcendent: boolean) {
	if (!transcendent) {
		return new Decimal(0);
	}

	const fromAncientSouls = new Decimal(0.25)
		.minus(new Decimal(0.23).times(ancientSoulsTotal.times(-0.0003).exp()))
		.times(100);

	return Decimal.max(fromAncientSouls, 1);
}

export type AncientRow = {
	id: number;
	key: string;
	name: string;
	effect: string;
	currentLevel: Decimal;
	optimalLevel: Decimal;
	change: Decimal;
	cost: Decimal;
	/** Whether the rule wanted to go past the ancient's useful ceiling. */
	capped: boolean;
};

export type AncientsCalculation = {
	rows: AncientRow[];
	/** Souls in the save, plus the ascension bonus when that option is on. */
	heroSoulsAvailable: Decimal;
	/** What the optimiser was allowed to distribute. */
	heroSoulsForLeveling: Decimal;
	heroSoulsSpent: Decimal;
	heroSoulsRemaining: Decimal;
	/** Souls Morgulis' rule says to sit on when you do not own Morgulis. */
	soulBankLevel: Decimal | null;
	transcendentPower: Decimal;
	alpha: Decimal;
	transcendent: boolean;
	tuningAncientName: string;
	durationMs: number;
};

type AncientState = {
	definition: AncientDefinition;
	currentLevel: Decimal;
	optimalLevel: Decimal | null;
	cost: Decimal;
};

export function calculateAncients({
	heroSoulsOverride,
	settings,
	snapshot
}: {
	snapshot: AncientsSnapshot;
	settings: AncientsSettings;
	/** Souls typed in by hand. Falsy means "use the save". */
	heroSoulsOverride?: string | null;
}): AncientsCalculation {
	const startedAt = Date.now();

	// The reference calculator carries three guard digits over the requested
	// precision, and every Decimal below is created after this point.
	Decimal.set({ precision: Math.ceil(settings.precision) + 3 });

	const heroSoulsAvailable = settings.includeSoulsAfterAscension
		? snapshot.heroSouls.plus(snapshot.ascensionSouls)
		: snapshot.heroSouls;
	const overrideSouls = parseHeroSouls(heroSoulsOverride);
	const reservedSouls = settings.keepSoulsForRegilding
		? snapshot.gilds.times(heroSoulsPerGild)
		: new Decimal(0);
	const heroSoulsForLeveling = Decimal.max(0, (overrideSouls ?? heroSoulsAvailable).minus(reservedSouls));

	const alpha = calculateAlpha(snapshot, settings.heroTier);
	const hybridRatio = new Decimal(settings.buildMode === 'hybrid' ? settings.hybridRatio : 1);
	const costMultiplier = new Decimal(0.95).pow(snapshot.chorgorlothLevel);
	const tuningKey = settings.buildMode === 'active' ? 'fragsworth' : 'siyalatas';
	const states = createAncientStates(snapshot, settings);
	const tuningLevel =
		states.find((state) => state.definition.key === tuningKey)?.currentLevel ?? new Decimal(0);

	const context = {
		alpha,
		costMultiplier,
		hybridRatio,
		settings,
		states,
		transcendent: alpha.greaterThan(0),
		tuningLevel
	};

	let heroSoulsSpent = optimize(context, heroSoulsForLeveling);
	const soulBank = states.find((state) => state.definition.key === soulBankDefinition.key);
	const bankedSouls = soulBank?.optimalLevel;
	const soulBankLevel = bankedSouls?.greaterThan(0) ? bankedSouls : null;

	if (soulBankLevel) {
		// Souls parked in the bank were never really spent.
		heroSoulsSpent = heroSoulsSpent.minus(soulBankLevel);
	}

	const rows = states
		.filter((state) => state.definition.key !== soulBankDefinition.key)
		.filter((state): state is AncientState & { optimalLevel: Decimal } => Boolean(state.optimalLevel))
		.map(({ cost, currentLevel, definition, optimalLevel }) => ({
			capped: definition.cap !== undefined && optimalLevel.greaterThanOrEqualTo(definition.cap),
			change: optimalLevel.minus(currentLevel),
			cost,
			currentLevel,
			effect: definition.effect,
			id: definition.id,
			key: definition.key,
			name: definition.name,
			optimalLevel
		}))
		.sort((left, right) => left.name.localeCompare(right.name));

	return {
		alpha,
		durationMs: Date.now() - startedAt,
		heroSoulsAvailable,
		heroSoulsForLeveling,
		heroSoulsRemaining: heroSoulsAvailable.minus(heroSoulsSpent),
		heroSoulsSpent,
		rows,
		soulBankLevel,
		transcendent: alpha.greaterThan(0),
		transcendentPower: snapshot.transcendentPower,
		tuningAncientName: tuningKey === 'fragsworth' ? 'Fragsworth' : 'Siyalatas'
	};
}

type OptimizeContext = {
	alpha: Decimal;
	costMultiplier: Decimal;
	hybridRatio: Decimal;
	settings: AncientsSettings;
	states: AncientState[];
	transcendent: boolean;
	tuningLevel: Decimal;
};

/** Ancients you own, plus the soul bank when Morgulis is not one of them. */
function createAncientStates(snapshot: AncientsSnapshot, settings: AncientsSettings): AncientState[] {
	const states = ancientDefinitions
		.filter((definition) => {
			if (settings.ignoreMinimizedAncients && snapshot.minimizedAncients[definition.id]) {
				return false;
			}

			if (definition.exclude?.(settings)) {
				return false;
			}

			return (snapshot.ancientLevels[definition.id] ?? new Decimal(0)).greaterThan(0);
		})
		.map((definition) => ({
			cost: new Decimal(0),
			currentLevel: snapshot.ancientLevels[definition.id] ?? new Decimal(0),
			definition,
			optimalLevel: null
		}));

	if (!(snapshot.ancientLevels[morgulisAncientId] ?? new Decimal(0)).greaterThan(0)) {
		states.push({
			cost: new Decimal(0),
			currentLevel: new Decimal(0),
			definition: soulBankDefinition,
			optimalLevel: null
		});
	}

	return states;
}

function calculateAlpha(snapshot: AncientsSnapshot, heroTier: HeroTier) {
	const tierCoefficient = heroTier === 'e10' ? 1.8053 : heroTier === 'e9' ? 1.1085 : 1.4067;

	return snapshot.transcendentPower
		.dividedBy(100)
		.plus(1)
		.ln()
		.times(tierCoefficient)
		.dividedBy(calculateHpScaleFactor(snapshot.ascensionZone).ln());
}

/** How fast monster health grows at the zone this save ascended from. */
function calculateHpScaleFactor(zone: Decimal) {
	if (zone.lessThan(141)) {
		return new Decimal(1.55);
	}

	if (zone.lessThan(501)) {
		return new Decimal(1.145);
	}

	if (zone.lessThan(200001)) {
		return zone.dividedBy(500).floor().times(0.001).plus(1.145);
	}

	return new Decimal(1.545);
}

/**
 * Binary search on the tuning ancient's level: every other ancient follows
 * from it through the rules of thumb, so the whole build is a function of one
 * number and the search only has to find the level the souls run out at.
 */
function optimize(context: OptimizeContext, heroSouls: Decimal) {
	const { costMultiplier, settings, tuningLevel } = context;

	let left = tuningLevel.negated();
	// Spending everything on the tuning ancient alone costs
	// (bf^2 - bi^2) / 2 * multiplier, so this bf is a hard upper bound.
	let right = heroSouls.greaterThan(0)
		? heroSouls.dividedBy(costMultiplier).times(2).plus(tuningLevel.pow(2)).sqrt().ceil()
		: new Decimal(0);
	let spentHeroSouls: Decimal | undefined;

	// Converging exactly costs O(log(hero souls)), and hero souls grow
	// exponentially with play time, so stop once the interval is small
	// relative to where it started.
	const initialInterval = right.minus(left);
	const targetInterval = new Decimal(10).pow(-settings.precision);

	while (
		right.minus(left).greaterThan(1) &&
		right.minus(left).dividedBy(initialInterval).greaterThan(targetInterval)
	) {
		const interval = right.minus(left);
		const midpoint = spentHeroSouls
			? offCenterMidpoint(left, right, interval, spentHeroSouls.dividedBy(heroSouls).ln())
			: right.plus(left).dividedBy(2).floor();

		spentHeroSouls = compute(context, midpoint);

		if (spentHeroSouls.lessThan(heroSouls)) {
			left = midpoint;
		} else {
			right = midpoint;
		}
	}

	return compute(context, left);
}

/**
 * When the last guess spent far too much or far too little, bias the next
 * search point instead of halving blindly.
 */
function offCenterMidpoint(left: Decimal, right: Decimal, interval: Decimal, fitIndicator: Decimal) {
	if (fitIndicator.lessThan(-0.1)) {
		return left.plus(interval.dividedBy(1.25)).floor();
	}

	if (fitIndicator.greaterThan(0.1)) {
		return left.plus(interval.dividedBy(4)).floor();
	}

	return right.plus(left).dividedBy(2).floor();
}

/** Level every ancient for this tuning level and total up what it costs. */
function compute(context: OptimizeContext, addedLevels: Decimal) {
	const baseLevel = Decimal.max(0, context.tuningLevel.plus(addedLevels));

	for (const state of context.states) {
		const goal = state.definition.goals[context.settings.buildMode];

		state.cost = new Decimal(0);
		state.optimalLevel = null;

		if (!goal) {
			continue;
		}

		const goalLevel = goal({
			alpha: context.alpha,
			baseLevel,
			currentLevel: state.currentLevel,
			heroTier: context.settings.heroTier,
			hybridRatio: context.hybridRatio,
			settings: context.settings,
			transcendent: context.transcendent
		});

		if (goalLevel.isNaN()) {
			continue;
		}

		const cappedGoal =
			state.definition.cap === undefined ? goalLevel : Decimal.min(goalLevel, state.definition.cap);

		state.optimalLevel = Decimal.max(state.currentLevel, cappedGoal.ceil());
	}

	let total = new Decimal(0);

	for (const state of context.states) {
		if (!state.optimalLevel) {
			continue;
		}

		const levels = state.optimalLevel.minus(state.currentLevel);

		if (levels.lessThanOrEqualTo(0)) {
			continue;
		}

		const rawCost = ancientLevelCostSum(state.definition.cost, state.optimalLevel).minus(
			ancientLevelCostSum(state.definition.cost, state.currentLevel)
		);
		// Chor'gorloth discounts real ancients, but not banked souls.
		state.cost =
			state.definition.key === soulBankDefinition.key
				? rawCost
				: rawCost.times(context.costMultiplier).ceil();
		total = total.plus(state.cost);
	}

	return total;
}

export type AncientSoulPlanRow = {
	ancientSoulsGained: Decimal;
	heroSoulsRequired: Decimal;
	heroSoulsFromPrevious: Decimal;
};

/**
 * Ancient souls are `floor(5 * log10(hero souls sacrificed))`, so each extra
 * one costs exponentially more. This lists the next few and what transcending
 * at that point would take.
 */
export function planAncientSouls({
	count = 20,
	settings,
	snapshot
}: {
	snapshot: AncientsSnapshot;
	settings: AncientsSettings;
	count?: number;
}): AncientSoulPlanRow[] {
	const heroSoulsEarned = settings.includeSoulsAfterAscension
		? snapshot.totalHeroSoulsEarned.plus(snapshot.ascensionSouls)
		: snapshot.totalHeroSoulsEarned;

	if (!heroSoulsEarned.greaterThan(0)) {
		return [];
	}

	const currentAncientSouls = ancientSoulsFor(snapshot.heroSoulsSacrificed);
	const pendingAncientSouls = ancientSoulsFor(heroSoulsEarned).minus(currentAncientSouls);

	return Array.from({ length: count }, (_unused, index) => {
		const gained = pendingAncientSouls.plus(index + 1);
		const total = gained.plus(currentAncientSouls);
		const required = heroSoulsForAncientSouls(total).minus(heroSoulsEarned);
		const previousRequired =
			index === 0 ? new Decimal(0) : heroSoulsForAncientSouls(total.minus(1)).minus(heroSoulsEarned);

		return {
			ancientSoulsGained: gained,
			heroSoulsFromPrevious: required.minus(previousRequired),
			heroSoulsRequired: required
		};
	});
}

function ancientSoulsFor(heroSouls: Decimal) {
	if (!heroSouls.greaterThan(0)) {
		return new Decimal(0);
	}

	return heroSouls.log(10).times(ancientSoulsPerHeroSoulDecade).floor();
}

function heroSoulsForAncientSouls(ancientSouls: Decimal) {
	return Decimal.pow(10, ancientSouls.dividedBy(ancientSoulsPerHeroSoulDecade));
}

const exponentialAbove = 1_000_000;

/**
 * Hero soul counts run past 1e1000, well beyond what a double can hold, so
 * they are formatted from the Decimal itself. Matches `formatLargeNumber`:
 * grouped digits up to a million, four significant digits above it.
 */
export function formatHeroSouls(value: Decimal | undefined) {
	if (value === undefined) {
		return '0';
	}

	if (!value.isFinite()) {
		return '-';
	}

	if (value.abs().lessThan(exponentialAbove)) {
		return formatNumber(Number(value.toFixed(0)));
	}

	return value.toExponential(4).replace('e+', 'e');
}

/** Digits only, for pasting into the game's bulk level-up field. */
export function toPasteableNumber(value: Decimal) {
	return value.isFinite() ? value.toFixed(0) : '0';
}

function parseHeroSouls(value: string | null | undefined) {
	const trimmed = String(value ?? '')
		.trim()
		.replaceAll(',', '');

	if (!trimmed) {
		return null;
	}

	try {
		const parsed = new Decimal(trimmed);
		return parsed.isFinite() ? parsed : null;
	} catch {
		return null;
	}
}

function readField(entry: unknown, key: string) {
	return entry && typeof entry === 'object' ? (entry as Record<string, unknown>)[key] : undefined;
}

function toDecimal(value: unknown) {
	if (typeof value === 'number') {
		return Number.isFinite(value) ? new Decimal(value) : new Decimal(0);
	}

	if (typeof value === 'string' && value.trim()) {
		try {
			const parsed = new Decimal(value.trim());
			return parsed.isFinite() ? parsed : new Decimal(0);
		} catch {
			return new Decimal(0);
		}
	}

	return new Decimal(0);
}
