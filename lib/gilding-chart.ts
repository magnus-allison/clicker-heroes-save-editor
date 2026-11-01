/**
 * Hero gilding chart for Clicker Heroes 1.0e12 (hero balance unchanged since 1.0e11).
 *
 * Adapted from the community e10 chart (/u/parker_cube) and the ClickerHeroes
 * Wiki, extended through the Ace Scouts rotation. Gold thresholds are log10:
 * `goldFrom: 442` means 1e442 gold.
 *
 * The rows are a step function over gold — each row runs until the next one
 * starts, so `goldTo` is always the next row's `goldFrom` and the final row is
 * open-ended. `gildingRowForExponent` relies on that being true, and
 * `gilding-chart.test.ts` asserts it.
 */

export type GildingPhaseId = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Phase titles, summaries and row notes are translated: they live in the
 * `guidesUi.gildingChart` and `guides.gildingChart` messages, keyed by phase
 * id and by `GildingNoteKey`. This file holds only the numbers and hero names.
 */
export type GildingPhase = {
	id: GildingPhaseId;
	/** log10 gold span shown in headings. Not always the rows' exact span. */
	rangeFrom: number;
	/** `null` when the phase runs to the end of the chart. */
	rangeTo: number | null;
};

export const gildingNoteKeys = [
	'dreadKnight',
	'bareExponent',
	'rangersAndBeasts',
	'thePattern',
	'bomberMaxUpgrade',
	'gogUpgrade',
	'followWepwawet',
	'bettyClicker',
	'kingMidas',
	'wepAndGog',
	'stayOnWep',
	'hireTsuchi',
	'lastSoulsEstimate',
	'eitherGuardian',
	'ceusBoostsCadu',
	'lastCeusUpgrade',
	'theMaw',
	'yachiyl',
	'roseLevel',
	'noUpgradesFirst',
	'firstUpgrades',
	'skipDorothy1',
	'skipDorothy2',
	'dorothy3',
	'skipDorothy4',
	'endOfChart'
] as const;

/** Message key under `guidesUi.gildingChart.notes`. */
export type GildingNoteKey = (typeof gildingNoteKeys)[number];

export type GildingRow = {
	/** 1-based position in the chart, stable across filtering. */
	step: number;
	hero: string;
	/** Levels are strings: a couple are ranges rather than numbers. */
	fromLevel: string;
	/** `null` on the final row: keep levelling it forever. */
	toLevel: string | null;
	/** log10 gold at which this hero becomes the optimal gild target. */
	goldFrom: number;
	/** log10 gold at which the next row takes over. `null` on the final row. */
	goldTo: number | null;
	/** Rough Ancient Souls when you get here. Not tabulated past Xavira. */
	approxAncientSouls: string | null;
	note: GildingNoteKey | null;
	/** Notes worth backtracking for even when you are skipping rows. */
	highlight?: boolean;
	phase: GildingPhaseId;
};

export const gildingPhases = [
	{ id: 1, rangeFrom: 35, rangeTo: 295 },
	{ id: 2, rangeFrom: 383, rangeTo: 500 },
	{ id: 3, rangeFrom: 500, rangeTo: 25500 },
	{ id: 4, rangeFrom: 25500, rangeTo: 45500 },
	{ id: 5, rangeFrom: 45500, rangeTo: 108838 },
	{ id: 6, rangeFrom: 108838, rangeTo: null }
] as const satisfies readonly GildingPhase[];

const exponentFormatter = new Intl.NumberFormat('en-US');

/**
 * `e442`, `e25,500`. Always grouped the English way, whatever the page locale,
 * so it reads the same as the game’s own gold display.
 */
export const formatGoldExponent = (value: number) => `e${exponentFormatter.format(value)}`;

type RawRow = [
	hero: string,
	fromLevel: string,
	toLevel: string | null,
	goldFrom: number,
	goldTo: number | null,
	approxAncientSouls: string | null,
	note: GildingNoteKey | null,
	phase: GildingPhaseId,
	highlight?: true
];

const rawRows: readonly RawRow[] = [
	['The Masked Samurai', '1,000-1,500', '2,425', 35, 77, '10', 'dreadKnight', 1],
	['Atlas', '725', '1,500', 77, 100, '12', 'bareExponent', 1],
	['Terra', '1,000', '1,500', 100, 115, '14', 'rangersAndBeasts', 1],
	['Phthalo', '1,000', '1,500', 115, 130, '17', null, 1],
	['Orntchya Gladeye, Didensy Banana', '1,000', '1,500', 130, 145, '20', null, 1],
	['Lilin', '1,000', '1,500', 145, 160, '22', 'thePattern', 1],
	['Cadmia', '1,000', '1,500', 160, 175, '24', null, 1],
	['Alabaster', '1,000', '1,500', 175, 190, '26', null, 1],
	['Astraea', '1,000', '1,500', 190, 205, '28', null, 1],
	['Chiron', '1,000', '1,500', 205, 220, '31', 'bomberMaxUpgrade', 1, true],
	['Moloch', '1,000', '1,500', 220, 235, '34', 'gogUpgrade', 1, true],
	['Bomber Max', '1,000', '1,500', 235, 250, '36', null, 1],
	['Gog', '1,000', '1,500', 250, 265, '38', null, 1],
	['Wepwawet', '1,000', '1,500', 265, 280, '40', 'followWepwawet', 1],
	['Betty Clicker', '9,350', '9,850', 280, 295, '42', 'bettyClicker', 1],
	['King Midas', '9,575', '12,575', 295, 383, '44', 'kingMidas', 1],
	['Wepwawet', '5,000', '5,500', 383, 397, '56', 'wepAndGog', 2],
	['Gog', '6,000', '6,500', 397, 412, '59', null, 2],
	['Wepwawet', '6,000', '6,500', 412, 427, '61', null, 2],
	['Gog', '7,000', '7,500', 427, 442, '63', null, 2],
	['Wepwawet', '7,000', '9,000', 442, 500, '65', 'stayOnWep', 2],
	['Tsuchi', '1', '16,975', 500, 1000, '75', 'hireTsuchi', 3],
	['Skogur', '1', '33,975', 1000, 2000, '200', null, 3],
	['Moeru', '1', '68,025', 2000, 4000, '500', null, 3],
	['Zilar', '1', '136,075', 4000, 8000, '1,500', null, 3],
	['Madzi', '1', '204,175', 8000, 14000, '2,750', null, 3],
	['Xavira', '1', '391,375', 14000, 25500, '6,000', 'lastSoulsEstimate', 3],
	['Cadu, Tomb Guardian', '1', '58,000', 25500, 27204, null, 'eitherGuardian', 4],
	['Ceus, Tomb Guardian', '58,000', '116,000', 27204, 28908, null, 'ceusBoostsCadu', 4],
	['Cadu, Tomb Guardian', '116,000', '180,000', 28908, 30789, null, null, 4],
	['Ceus, Tomb Guardian', '180,000', '250,000', 30789, 32845, null, null, 4],
	['Cadu, Tomb Guardian', '250,000', '326,000', 32845, 35079, null, null, 4],
	['Ceus, Tomb Guardian', '326,000', '407,500', 35079, 37473, null, null, 4],
	['Cadu, Tomb Guardian', '407,500', '495,000', 37473, 40044, null, null, 4],
	['Ceus, Tomb Guardian', '495,000', '588,000', 40044, 42777, null, 'lastCeusUpgrade', 4],
	['Cadu, Tomb Guardian', '588,000', '680,625', 42777, 45500, null, null, 4],
	['The Maw', '1', '1,059,350', 45500, 76628, null, 'theMaw', 5],
	['Yachiyl', '157,500', '1,253,675', 76628, 108838, null, 'yachiyl', 5],
	['Rose', '9,700', '75,250', 108838, 114500, null, 'roseLevel', 6],
	['Sophia', '1', '150,525', 114500, 127500, null, 'noUpgradesFirst', 6],
	['Blanche', '1', '170,200', 127500, 142200, null, null, 6],
	['Dorothy', '1', '205,975', 142200, 159989, null, null, 6],
	['Rose', '602,000', '752,500', 159989, 172987, null, 'firstUpgrades', 6],
	['Sophia', '677,250', '903,025', 172987, 192486, null, null, 6],
	['Blanche', '752,500', '978,200', 192486, 211977, null, null, 6],
	['Rose', '1,204,000', '1,354,500', 211977, 224976, null, 'skipDorothy1', 6],
	['Sophia', '1,279,250', '1,505,025', 224976, 244474, null, null, 6],
	['Blanche', '1,354,500', '1,580,200', 244474, 263966, null, null, 6],
	['Rose', '1,806,000', '1,956,500', 263966, 276964, null, 'skipDorothy2', 6],
	['Sophia', '1,881,250', '2,107,025', 276964, 296463, null, null, 6],
	['Blanche', '1,956,500', '2,126,700', 296463, 311163, null, null, 6],
	['Dorothy', '1,956,500', '2,011,975', 311163, 315954, null, 'dorothy3', 6],
	['Rose', '2,408,000', '2,558,500', 315954, 328953, null, null, 6],
	['Sophia', '2,483,250', '2,709,025', 328953, 348452, null, null, 6],
	['Blanche', '2,558,500', '2,784,200', 348452, 367943, null, null, 6],
	['Rose', '3,010,000', '3,160,500', 367943, 380942, null, 'skipDorothy4', 6],
	['Sophia', '3,085,250', '3,311,025', 380942, 400440, null, null, 6],
	['Blanche', '3,160,500', '3,405,950', 400440, 421639, null, null, 6],
	['Dorothy', '3,235,750', null, 421639, null, null, 'endOfChart', 6]
];

export const gildingRows: readonly GildingRow[] = rawRows.map(
	([hero, fromLevel, toLevel, goldFrom, goldTo, approxAncientSouls, note, phase, highlight], index) => ({
		step: index + 1,
		hero,
		fromLevel,
		toLevel,
		goldFrom,
		goldTo,
		approxAncientSouls,
		note,
		phase,
		...(highlight ? { highlight } : {})
	})
);

/** log10 gold of the first chart entry. Below this, the chart does not apply yet. */
export const firstGildingExponent = gildingRows[0]!.goldFrom;

/**
 * Reads the log10 exponent out of whatever the user pasted from the game.
 *
 * Accepts a full gold reading (`1.4e442`, `4.21E+250`), a bare exponent
 * (`442`), or a lone suffix (`e442`). Anything else is `null`. The mantissa is
 * deliberately discarded: chart rows are whole orders of magnitude apart, so
 * `9.9e441` and `1.0e441` land on the same row.
 */
export const parseGoldExponent = (input: string): number | null => {
	const normalized = input.trim().toLowerCase().replaceAll(',', '').replaceAll(' ', '');

	if (normalized === '') return null;

	const withSuffix = /^[\d.]*e\+?(-?\d+)$/.exec(normalized);

	if (withSuffix?.[1]) {
		return Number.parseInt(withSuffix[1], 10);
	}

	// No `e`, so the whole string has to be the exponent itself.
	if (!/^-?\d+(\.\d+)?$/.test(normalized)) return null;

	return Math.floor(Number.parseFloat(normalized));
};

/**
 * The row whose gold threshold the player has passed most recently, or `null`
 * when they are not on the chart yet.
 */
export const gildingRowForExponent = (exponent: number): GildingRow | null => {
	if (exponent < firstGildingExponent) return null;

	let match: GildingRow | null = null;

	for (const row of gildingRows) {
		if (row.goldFrom > exponent) break;
		match = row;
	}

	return match;
};

export const gildingPhaseById = (id: GildingPhaseId): GildingPhase =>
	gildingPhases.find((phase) => phase.id === id)!;

export const nextGildingRow = (row: GildingRow): GildingRow | null => gildingRows[row.step] ?? null;
