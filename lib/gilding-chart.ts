/**
 * Hero gilding chart for Clicker Heroes 1.0e11.
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

export type GildingPhase = {
	id: GildingPhaseId;
	title: string;
	summary: string;
	/** Human-readable gold span, for headings. */
	range: string;
};

export type GildingRow = {
	/** 1-based position in the chart, stable across filtering. */
	step: number;
	hero: string;
	/** Levels are strings: a couple are ranges or 'Forever' rather than numbers. */
	fromLevel: string;
	toLevel: string;
	/** log10 gold at which this hero becomes the optimal gild target. */
	goldFrom: number;
	/** log10 gold at which the next row takes over. `null` on the final row. */
	goldTo: number | null;
	/** Rough Ancient Souls when you get here. Not tabulated past Xavira. */
	approxAncientSouls: string | null;
	note: string | null;
	/** Notes worth backtracking for even when you are skipping rows. */
	highlight?: boolean;
	phase: GildingPhaseId;
};

export const gildingPhases = [
	{
		id: 1,
		title: 'The e10 climb',
		summary:
			'Hire each new hero at 1,000, gild it, push to 1,500, move on. Mechanical and fast. Two upgrade detours matter: Bomber Max and Gog, both at level 100.',
		range: 'e35 to e295'
	},
	{
		id: 2,
		title: 'Wepwawet and Gog',
		summary:
			'The two leapfrog each other every ~500 levels as each picks up a new 10x multiplier. Ends when Gog runs out of multipliers at level 8,000.',
		range: 'e383 to e500'
	},
	{
		id: 3,
		title: 'Solo heroes',
		summary:
			'The easiest stretch in the game. Each new hero is so much stronger that you hire it at level 1, move every gild across, and ride it to the next one.',
		range: 'e500 to e25,500'
	},
	{
		id: 4,
		title: 'Tomb Guardians',
		summary:
			'Cadu and Ceus buff each other, so you alternate, pushing whichever one unlocks the upgrade the other needs. Nine steps of ping-pong.',
		range: 'e25,500 to e45,500'
	},
	{
		id: 5,
		title: 'The Maw and Yachiyl',
		summary:
			'Two enormous jumps. The Maw at level 1 outdamages a maxed Cadu by roughly 1e6750x. Yachiyl only overtakes The Maw at level 157,500, so you start it there.',
		range: 'e45,500 to e108,838'
	},
	{
		id: 6,
		title: 'Ace Scouts',
		summary:
			'Rose, Sophia, Blanche and Dorothy rotate as each unlocks upgrades for the others. Run them bare first, then cycle through upgrade tiers, skipping most of Dorothy.',
		range: 'e108,838 onwards'
	}
] as const satisfies readonly GildingPhase[];

type RawRow = [
	hero: string,
	fromLevel: string,
	toLevel: string,
	goldFrom: number,
	goldTo: number | null,
	approxAncientSouls: string | null,
	note: string | null,
	phase: GildingPhaseId,
	highlight?: true
];

const rawRows: readonly RawRow[] = [
	[
		'The Masked Samurai',
		'1,000-1,500',
		'2,425',
		35,
		77,
		'10',
		'Dread Knight is never optimal to gild. Sources list the start level as either 1,000 or 1,500; either is fine.',
		1
	],
	[
		'Atlas',
		'725',
		'1,500',
		77,
		100,
		'12',
		'From here on gold is written as the bare exponent, the number after the "e".',
		1
	],
	['Terra', '1,000', '1,500', 100, 115, '14', 'Most rangers and beasts become optimal at level 1,000.', 1],
	['Phthalo', '1,000', '1,500', 115, 130, '17', null, 1],
	['Orntchya Gladeye, Didensy Banana', '1,000', '1,500', 130, 145, '20', null, 1],
	[
		'Lilin',
		'1,000',
		'1,500',
		145,
		160,
		'22',
		'The pattern by now: hire to 1,000, gild, level to 1,500, move on.',
		1
	],
	['Cadmia', '1,000', '1,500', 160, 175, '24', null, 1],
	['Alabaster', '1,000', '1,500', 175, 190, '26', null, 1],
	['Astraea', '1,000', '1,500', 190, 205, '28', null, 1],
	[
		'Chiron',
		'1,000',
		'1,500',
		205,
		220,
		'31',
		'At Chiron 1,100, buy Bomber Max to level 100 for his +50% gold found upgrade.',
		1,
		true
	],
	[
		'Moloch',
		'1,000',
		'1,500',
		220,
		235,
		'34',
		'At Moloch 1,100, buy Gog to level 100 for his +50% all-hero DPS upgrade.',
		1,
		true
	],
	['Bomber Max', '1,000', '1,500', 235, 250, '36', null, 1],
	['Gog', '1,000', '1,500', 250, 265, '38', null, 1],
	['Wepwawet', '1,000', '1,500', 265, 280, '40', 'From here, gilding follows Wepwawet upgrades.', 1],
	[
		'Betty Clicker',
		'9,350',
		'9,850',
		280,
		295,
		'42',
		'Needs the Wepwawet upgrade at level 1,500, which boosts Betty heavily.',
		1
	],
	[
		'King Midas',
		'9,575',
		'12,575',
		295,
		383,
		'44',
		'Needs the Wepwawet upgrade at level 2,000. The wiki lists the end level as 13,575.',
		1
	],
	[
		'Wepwawet',
		'5,000',
		'5,500',
		383,
		397,
		'56',
		'Wep and Gog now trade off every ~500 levels as each gains a new 10x.',
		2
	],
	['Gog', '6,000', '6,500', 397, 412, '59', null, 2],
	['Wepwawet', '6,000', '6,500', 412, 427, '61', null, 2],
	['Gog', '7,000', '7,500', 427, 442, '63', null, 2],
	[
		'Wepwawet',
		'7,000',
		'9,000',
		442,
		500,
		'65',
		'Gog gets no more 10x multipliers after level 8,000, so stay on Wep from here.',
		2
	],
	[
		'Tsuchi',
		'1',
		'16,975',
		500,
		1000,
		'75',
		'Hiring Tsuchi at level 1 costs less than 25 more levels of Wepwawet, and is instantly better.',
		3
	],
	['Skogur', '1', '33,975', 1000, 2000, '200', null, 3],
	['Moeru', '1', '68,025', 2000, 4000, '500', null, 3],
	['Zilar', '1', '136,075', 4000, 8000, '1,500', null, 3],
	['Madzi', '1', '204,175', 8000, 14000, '2,750', null, 3],
	[
		'Xavira',
		'1',
		'391,375',
		14000,
		25500,
		'6,000',
		'Last row with a meaningful Ancient Souls estimate. Past here, use a progression calculator.',
		3
	],
	[
		'Cadu, Tomb Guardian',
		'1',
		'58,000',
		25500,
		27204,
		null,
		'Either Guardian works here. Cadu gets the first upgrade, which boosts Ceus.',
		4
	],
	[
		'Ceus, Tomb Guardian',
		'58,000',
		'116,000',
		27204,
		28908,
		null,
		'At 116,000 Ceus boosts Cadu. The alternating pattern continues from here.',
		4
	],
	['Cadu, Tomb Guardian', '116,000', '180,000', 28908, 30789, null, null, 4],
	['Ceus, Tomb Guardian', '180,000', '250,000', 30789, 32845, null, null, 4],
	['Cadu, Tomb Guardian', '250,000', '326,000', 32845, 35079, null, null, 4],
	['Ceus, Tomb Guardian', '326,000', '407,500', 35079, 37473, null, null, 4],
	['Cadu, Tomb Guardian', '407,500', '495,000', 37473, 40044, null, null, 4],
	[
		'Ceus, Tomb Guardian',
		'495,000',
		'588,000',
		40044,
		42777,
		null,
		'The last Ceus upgrade unlocks here. After this, stay on Cadu until The Maw.',
		4
	],
	['Cadu, Tomb Guardian', '588,000', '680,625', 42777, 45500, null, null, 4],
	[
		'The Maw',
		'1',
		'1,059,350',
		45500,
		76628,
		null,
		'The Maw at level 1 deals roughly 1e6750x the damage of Cadu at 680,625, for the same price.',
		5
	],
	[
		'Yachiyl',
		'157,500',
		'1,253,675',
		76628,
		108838,
		null,
		'Yachiyl does less damage than The Maw until its first upgrade at 157,500, which is why you start it there. Reaching this row means you have beaten 1.0e10.',
		5
	],
	[
		'Rose',
		'9,700',
		'75,250',
		108838,
		114500,
		null,
		'Because of 1.0e11 hero scaling, Rose is not immediately better than Yachiyl. She needs level 9,700.',
		6
	],
	['Sophia', '1', '150,525', 114500, 127500, null, 'Run through each scout with no upgrades first.', 6],
	['Blanche', '1', '170,200', 127500, 142200, null, null, 6],
	['Dorothy', '1', '205,975', 142200, 159989, null, null, 6],
	[
		'Rose',
		'602,000',
		'752,500',
		159989,
		172987,
		null,
		'Now start collecting each scout first upgrade. This rotating pattern continues to the end.',
		6
	],
	['Sophia', '677,250', '903,025', 172987, 192486, null, null, 6],
	['Blanche', '752,500', '978,200', 192486, 211977, null, null, 6],
	[
		'Rose',
		'1,204,000',
		'1,354,500',
		211977,
		224976,
		null,
		'Skip Dorothy 1: it costs more but deals less damage than Rose 2.',
		6
	],
	['Sophia', '1,279,250', '1,505,025', 224976, 244474, null, null, 6],
	['Blanche', '1,354,500', '1,580,200', 244474, 263966, null, null, 6],
	['Rose', '1,806,000', '1,956,500', 263966, 276964, null, 'Skip Dorothy 2, same reason as before.', 6],
	['Sophia', '1,881,250', '2,107,025', 276964, 296463, null, null, 6],
	['Blanche', '1,956,500', '2,126,700', 296463, 311163, null, null, 6],
	['Dorothy', '1,956,500', '2,011,975', 311163, 315954, null, 'Dorothy 3 is worth taking, unlike 1 and 2.', 6],
	['Rose', '2,408,000', '2,558,500', 315954, 328953, null, null, 6],
	['Sophia', '2,483,250', '2,709,025', 328953, 348452, null, null, 6],
	['Blanche', '2,558,500', '2,784,200', 348452, 367943, null, null, 6],
	['Rose', '3,010,000', '3,160,500', 367943, 380942, null, 'Skip Dorothy 4, same reason as before.', 6],
	['Sophia', '3,085,250', '3,311,025', 380942, 400440, null, null, 6],
	['Blanche', '3,160,500', '3,405,950', 400440, 421639, null, null, 6],
	['Dorothy', '3,235,750', 'Forever', 421639, null, null, 'End of the tabulated chart.', 6]
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
