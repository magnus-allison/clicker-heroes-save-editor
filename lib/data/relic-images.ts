/**
 * Relic art by save `imageId` (`items.items[uid].imageId`), with the relic
 * `type` the game pairs it with. Extracted from the web game's own data
 * (build v1.0e12-6144, `6144.data.unityweb`): the `StaticData/itemImages`
 * table gives each id its type, base name, rarity range and sprite frame, and
 * the icons are the matching sprites (`Rings0001`…) cut from the
 * `Sprites/Sheets/items` atlas, saved losslessly at their native size
 * (about 30-48px). Ids 6, 37, 49, 51 and 58 were checked against relics in a
 * real save, and swords and amulets were imported into the web game to confirm
 * they load and show this art.
 *
 * `name` is the base name the game builds relic names from ("Copper Band" +
 * " of Impatience"). New relics only roll ids whose `minRarity`…`maxRarity`
 * range covers their rarity (1-7; the table allows up to 8), but the game
 * loads any id at any rarity (a Rare "Needler", range 5-8, shows fine).
 * Ids 9 and 10 share the same sprite in the game. Id 1 ("Trinket", type
 * `default`) has no sprite in the build and is left out.
 */
export type RelicType = 'sword' | 'gloves' | 'amulet' | 'helm' | 'ring';

export interface RelicImage {
	type: RelicType;
	/** Public path of the icon. */
	file: string;
	name: string;
	minRarity: number;
	maxRarity: number;
}

export const relicTypes: readonly RelicType[] = ['sword', 'gloves', 'amulet', 'helm', 'ring'];

export const relicImages: Readonly<Record<number, RelicImage>> = {
	2: { type: 'sword', file: '/assets/relics/2.webp', name: 'Rusty Sword', minRarity: 1, maxRarity: 3 },
	3: { type: 'gloves', file: '/assets/relics/3.webp', name: 'Ranger Gloves', minRarity: 1, maxRarity: 3 },
	4: { type: 'sword', file: '/assets/relics/4.webp', name: 'Azurewrath', minRarity: 5, maxRarity: 8 },
	5: { type: 'gloves', file: '/assets/relics/5.webp', name: 'Arctic Wraps', minRarity: 3, maxRarity: 6 },
	6: { type: 'gloves', file: '/assets/relics/6.webp', name: 'Handwraps', minRarity: 1, maxRarity: 3 },
	7: { type: 'gloves', file: '/assets/relics/7.webp', name: 'Barkholds', minRarity: 4, maxRarity: 8 },
	8: { type: 'gloves', file: '/assets/relics/8.webp', name: 'Bear Paws', minRarity: 6, maxRarity: 8 },
	9: { type: 'gloves', file: '/assets/relics/9.webp', name: 'Fire Grips', minRarity: 5, maxRarity: 8 },
	10: { type: 'gloves', file: '/assets/relics/10.webp', name: 'Gauntlets', minRarity: 5, maxRarity: 8 },
	11: {
		type: 'gloves',
		file: '/assets/relics/11.webp',
		name: 'Celestial Command',
		minRarity: 7,
		maxRarity: 8
	},
	12: { type: 'sword', file: '/assets/relics/12.webp', name: 'Onslaught', minRarity: 6, maxRarity: 8 },
	13: { type: 'sword', file: '/assets/relics/13.webp', name: 'Crimson Edge', minRarity: 6, maxRarity: 8 },
	14: { type: 'sword', file: '/assets/relics/14.webp', name: 'Scimitar', minRarity: 1, maxRarity: 4 },
	15: { type: 'sword', file: '/assets/relics/15.webp', name: 'Master Blade', minRarity: 3, maxRarity: 6 },
	16: { type: 'sword', file: '/assets/relics/16.webp', name: 'Cloud Edge', minRarity: 4, maxRarity: 8 },
	17: { type: 'sword', file: '/assets/relics/17.webp', name: 'Runeblade', minRarity: 1, maxRarity: 5 },
	18: { type: 'sword', file: '/assets/relics/18.webp', name: 'Needler', minRarity: 5, maxRarity: 8 },
	19: { type: 'sword', file: '/assets/relics/19.webp', name: 'Night Piercer', minRarity: 3, maxRarity: 5 },
	20: { type: 'sword', file: '/assets/relics/20.webp', name: 'Gladius', minRarity: 1, maxRarity: 3 },
	21: { type: 'sword', file: '/assets/relics/21.webp', name: 'Broadsword', minRarity: 1, maxRarity: 3 },
	22: { type: 'sword', file: '/assets/relics/22.webp', name: 'Mantastyle', minRarity: 4, maxRarity: 7 },
	23: { type: 'amulet', file: '/assets/relics/23.webp', name: 'Spirit Beads', minRarity: 1, maxRarity: 3 },
	24: { type: 'amulet', file: '/assets/relics/24.webp', name: 'Ram Spirit', minRarity: 1, maxRarity: 4 },
	25: {
		type: 'amulet',
		file: '/assets/relics/25.webp',
		name: 'Fluorite Necklace',
		minRarity: 2,
		maxRarity: 5
	},
	26: { type: 'amulet', file: '/assets/relics/26.webp', name: 'Jade Pendant', minRarity: 3, maxRarity: 5 },
	27: { type: 'amulet', file: '/assets/relics/27.webp', name: 'Copper Sun', minRarity: 3, maxRarity: 6 },
	28: {
		type: 'amulet',
		file: '/assets/relics/28.webp',
		name: 'Cloudstone Necklace',
		minRarity: 4,
		maxRarity: 7
	},
	29: { type: 'amulet', file: '/assets/relics/29.webp', name: 'Sinhalite', minRarity: 2, maxRarity: 4 },
	30: { type: 'amulet', file: '/assets/relics/30.webp', name: 'Sharktoof', minRarity: 6, maxRarity: 8 },
	31: { type: 'amulet', file: '/assets/relics/31.webp', name: "Giant's End", minRarity: 6, maxRarity: 8 },
	32: { type: 'amulet', file: '/assets/relics/32.webp', name: 'Galaxy Orb', minRarity: 5, maxRarity: 8 },
	33: { type: 'amulet', file: '/assets/relics/33.webp', name: 'Furry Touch', minRarity: 2, maxRarity: 5 },
	34: {
		type: 'amulet',
		file: '/assets/relics/34.webp',
		name: 'Confusing Magnet',
		minRarity: 1,
		maxRarity: 3
	},
	35: { type: 'amulet', file: '/assets/relics/35.webp', name: 'Clay Emblem', minRarity: 1, maxRarity: 3 },
	36: { type: 'helm', file: '/assets/relics/36.webp', name: 'Spartan Guard', minRarity: 1, maxRarity: 3 },
	37: { type: 'helm', file: '/assets/relics/37.webp', name: 'Gladiator Guard', minRarity: 1, maxRarity: 4 },
	38: { type: 'helm', file: '/assets/relics/38.webp', name: "Wanderer's Shade", minRarity: 3, maxRarity: 6 },
	39: { type: 'helm', file: '/assets/relics/39.webp', name: 'Praetor Guard', minRarity: 4, maxRarity: 6 },
	40: { type: 'helm', file: '/assets/relics/40.webp', name: 'Royal Cover', minRarity: 5, maxRarity: 8 },
	41: { type: 'helm', file: '/assets/relics/41.webp', name: 'Onslaught Helm', minRarity: 6, maxRarity: 8 },
	42: { type: 'helm', file: '/assets/relics/42.webp', name: 'Beast Lid', minRarity: 2, maxRarity: 5 },
	43: { type: 'helm', file: '/assets/relics/43.webp', name: 'Crimson Guard', minRarity: 2, maxRarity: 5 },
	44: { type: 'helm', file: '/assets/relics/44.webp', name: 'Arcane Protector', minRarity: 4, maxRarity: 6 },
	45: { type: 'helm', file: '/assets/relics/45.webp', name: 'Red Keeper', minRarity: 6, maxRarity: 8 },
	46: { type: 'helm', file: '/assets/relics/46.webp', name: 'Celestial Gate', minRarity: 6, maxRarity: 8 },
	47: { type: 'helm', file: '/assets/relics/47.webp', name: "Ronin's Shade", minRarity: 1, maxRarity: 3 },
	48: { type: 'helm', file: '/assets/relics/48.webp', name: 'Tundra Topper', minRarity: 2, maxRarity: 5 },
	49: { type: 'ring', file: '/assets/relics/49.webp', name: 'Copper Band', minRarity: 1, maxRarity: 4 },
	50: { type: 'ring', file: '/assets/relics/50.webp', name: 'Garnet Ring', minRarity: 1, maxRarity: 4 },
	51: { type: 'ring', file: '/assets/relics/51.webp', name: 'Jade Band', minRarity: 2, maxRarity: 5 },
	52: { type: 'ring', file: '/assets/relics/52.webp', name: 'Copper Mark', minRarity: 1, maxRarity: 3 },
	53: { type: 'ring', file: '/assets/relics/53.webp', name: 'Frog Faction', minRarity: 2, maxRarity: 4 },
	54: { type: 'ring', file: '/assets/relics/54.webp', name: 'Violet Hoop', minRarity: 3, maxRarity: 6 },
	55: { type: 'ring', file: '/assets/relics/55.webp', name: 'Skull Brim', minRarity: 5, maxRarity: 8 },
	56: { type: 'ring', file: '/assets/relics/56.webp', name: 'Golden Onyx', minRarity: 3, maxRarity: 6 },
	57: { type: 'ring', file: '/assets/relics/57.webp', name: 'Galaxy Loop', minRarity: 6, maxRarity: 8 },
	58: { type: 'ring', file: '/assets/relics/58.webp', name: 'Silver Azurite', minRarity: 1, maxRarity: 4 },
	59: { type: 'ring', file: '/assets/relics/59.webp', name: 'Golden Emerald', minRarity: 3, maxRarity: 5 },
	60: { type: 'ring', file: '/assets/relics/60.webp', name: 'Golden Ruby', minRarity: 2, maxRarity: 4 },
	61: { type: 'ring', file: '/assets/relics/61.webp', name: 'Verdant Surge', minRarity: 3, maxRarity: 6 }
};
