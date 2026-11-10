/**
 * Relic bonus types (`bonusType1`…`bonusType4` in a save) mapped to the
 * ancient each one adds levels to. Saves store only the number, so every entry
 * here was read from the game's own relic tooltips (web build v1.0e12-6144),
 * after matching the ids listed on the ClickerHeroes wiki's Relics page.
 *
 * Gaps are deliberate: the wiki lists no id for Pluto (Wealth), and at least
 * one of 6, 20, 23 and 25 is not a bonus at all (the game fails to load a save
 * that uses it), so those stay unnamed and the relic viewer shows the number.
 * Ancient names are proper nouns, so they are not translated.
 */
export const relicBonusAncients: Readonly<Record<number, string>> = {
	1: 'Siyalatas',
	2: 'Fragsworth',
	3: 'Chronos',
	4: 'Chawedo',
	5: 'Revolc',
	7: 'Argaiv',
	8: 'Energon',
	9: 'Kleptos',
	10: 'Sniperino',
	11: 'Berserker',
	12: 'Hecatoncheir',
	13: 'Bubos',
	14: 'Morgulis',
	15: 'Bhaal',
	16: 'Dora',
	17: 'Atman',
	18: 'Fortuna',
	19: 'Dogcog',
	21: 'Mimzee',
	22: 'Mammon',
	24: 'Libertas',
	26: 'Juggernaut',
	27: 'Kumawakamaru',
	28: 'Vaagur'
};

/** The ancient a relic bonus type levels, or `null` for a type not confirmed yet. */
export const getRelicBonusAncient = (bonusType: number): string | null =>
	relicBonusAncients[bonusType] ?? null;

/**
 * Relic `rarity` values in game order, each translated under
 * `tools.relic.rarities`. All seven were confirmed in game; the wiki lists an
 * eighth (Transcendent) that has not been, so it shows as a number.
 */
export const relicRarities = [
	'common',
	'uncommon',
	'rare',
	'epic',
	'fabled',
	'mythical',
	'legendary'
] as const;

export type RelicRarity = (typeof relicRarities)[number];

/**
 * The game's rarity tiles, the gradient behind each relic icon on the relics
 * tab, sampled from the web build: `from` at the top, `to` at the bottom. They
 * are artwork, so they stay the same in both themes; text uses the
 * contrast-adjusted `--color-rarity-*` tokens instead.
 */
export const relicRarityTiles: Readonly<Record<RelicRarity, { from: string; to: string }>> = {
	common: { from: '#322d2c', to: '#646361' },
	uncommon: { from: '#142f09', to: '#35641a' },
	rare: { from: '#062641', to: '#1c509c' },
	epic: { from: '#380853', to: '#771cca' },
	fabled: { from: '#2e5110', to: '#5cbd37' },
	mythical: { from: '#342f66', to: '#7567e5' },
	legendary: { from: '#5d5a22', to: '#d4d345' }
};

/** The rarity for a save's 1-based `rarity` value, or `null` when unconfirmed. */
export const getRelicRarity = (rarity: number | null): RelicRarity | null =>
	rarity === null ? null : (relicRarities[rarity - 1] ?? null);
