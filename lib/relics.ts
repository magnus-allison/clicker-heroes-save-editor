// Relative imports with explicit extensions, like `save-utils`, so `node --test`
// can load this module without the bundler's `@/*` alias.
import { getRelicBonusAncient } from './data/relic-bonuses.ts';
import { relicImages, relicTypes, type RelicImage, type RelicType } from './data/relic-images.ts';
import { toFiniteNumber } from './format.ts';
import type { SaveData } from './save-utils.ts';

/*
 * Relics in a save, as the game reads them. Everything here was checked
 * against the web build (v1.0e12-6144):
 *
 * - `items.items` holds the relics, keyed by uid. Each has `bonusType1`…`4`,
 *   `bonus1Distribution`…`4` (points) and `bonus1Level`…`4`. The game
 *   recalculates the levels from the points on load, and a relic's `level` is
 *   the sum of its points.
 * - `items.slots` maps a slot to a relic uid. Slots 1 to `items.equipmentSlots`
 *   are equipped and the one after is the junk pile. A relic in no slot is
 *   still saved but the game never shows it.
 * - The game names relics itself from their type and bonuses, so a name
 *   written to the save is replaced on load.
 * - An unknown bonus type stops the save loading at all, which is why the
 *   editor only offers the confirmed ones in `relic-bonuses`.
 */

export type RelicRecord = Record<string, unknown>;

export type RelicBonus = {
	/** Which of the relic's four bonus lines this is, 1 to 4. */
	line: number;
	/** The game's numeric bonus type; `0` marks an unused line. */
	type: number;
	/** The ancient the bonus levels, when the type has been confirmed in game. */
	ancient: string | null;
	/** Points spent on the bonus (`bonusNDistribution`). */
	points: number;
	/** The level the game last worked out from the points (`bonusNLevel`). */
	level: unknown;
};

export type RelicEntry = {
	uid: number;
	/** Slot the relic sits in, or `null` when no slot holds it (the game does not show those). */
	slot: number | null;
	/** Slots past the save's `equipmentSlots` are the junk pile, not equipment. */
	isJunk: boolean;
	data: RelicRecord;
	/** The lines in use, in order. */
	bonuses: RelicBonus[];
};

/** A relic carries up to four bonuses, stored as `bonusType1`…`bonusType4`. */
export const RELIC_BONUS_LINES = [1, 2, 3, 4] as const;

/** Saves store `items.equipmentSlots`; the game has always had four. */
export const DEFAULT_EQUIPMENT_SLOTS = 4;

export { relicTypes, type RelicType };

/** The game's art for a relic `imageId`, or `null` for an id the site does not have. */
export const getRelicImage = (imageId: unknown): RelicImage | null => {
	const id = toFiniteNumber(imageId);
	return id === null ? null : (relicImages[id] ?? null);
};

/** Every known look, by id, as `[imageId, image]` pairs. */
export const relicImageEntries = Object.entries(relicImages)
	.map(([id, image]) => [Number(id), image] as const)
	.sort(([left], [right]) => left - right);

/**
 * The look a new relic of `type` gets: the lowest id the game hands to Common
 * relics of that type, so a fresh relic looks like one the game could roll.
 */
export const defaultImageIdForType = (type: RelicType): number => {
	const ofType = relicImageEntries.filter(([, image]) => image.type === type);
	return (ofType.find(([, image]) => image.minRarity <= 1) ?? ofType[0])[0];
};

/**
 * Changes a relic's look. The type comes with it, since every icon belongs to
 * exactly one type; the game rebuilds the name from both on load.
 */
export const setRelicImage = (relic: RelicRecord, imageId: number): RelicRecord => {
	const image = relicImages[imageId];
	return image ? { ...relic, imageId, type: image.type } : relic;
};

const isRecord = (value: unknown): value is RelicRecord =>
	Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const toCount = (value: unknown) => toFiniteNumber(value) ?? 0;

/** Every bonus line of a relic, used or not. */
export const getRelicBonusLines = (relic: RelicRecord): RelicBonus[] =>
	RELIC_BONUS_LINES.map((line) => {
		const type = toCount(relic[`bonusType${line}`]);
		return {
			line,
			type,
			ancient: getRelicBonusAncient(type),
			points: toCount(relic[`bonus${line}Distribution`]),
			level: relic[`bonus${line}Level`]
		};
	});

/** The `items` container, where relics, slots and Forge Cores live. */
export const getRelicContainer = (save: SaveData | null): RelicRecord | null =>
	save && isRecord(save.items) ? save.items : null;

export const getEquipmentSlots = (container: RelicRecord | null) =>
	toFiniteNumber(container?.equipmentSlots) ?? DEFAULT_EQUIPMENT_SLOTS;

/** The junk pile is the slot right after the equipped ones. */
export const getJunkPileSlot = (container: RelicRecord | null) => getEquipmentSlots(container) + 1;

/**
 * `items.slots` maps a slot ("1".."5") to the uid of the relic in it, so it is
 * inverted here to label each relic with its slot.
 */
const toSlotByUid = (value: unknown) => {
	const slotByUid = new Map<number, number>();

	if (!isRecord(value)) {
		return slotByUid;
	}

	for (const [slotKey, uidValue] of Object.entries(value)) {
		const slot = Number(slotKey);
		const uid = toFiniteNumber(uidValue);
		if (Number.isFinite(slot) && uid !== null) {
			slotByUid.set(uid, slot);
		}
	}

	return slotByUid;
};

/**
 * The save keys relics by uid under `items.items`. Arrays are accepted too, as
 * the mercenary viewer does, for converters that emit one. Relics in a slot
 * come first in slot order, then the rest by uid.
 */
export const toRelicEntries = (save: SaveData | null): RelicEntry[] => {
	const container = getRelicContainer(save);
	const items = container?.items;
	const slotByUid = toSlotByUid(container?.slots);
	const equipmentSlots = getEquipmentSlots(container);
	const pairs = isRecord(items)
		? Object.entries(items)
		: Array.isArray(items)
			? items.map((entry, index) => [String(index), entry] as const)
			: [];

	return pairs
		.map(([key, entry]): RelicEntry | null => {
			if (!isRecord(entry)) {
				return null;
			}

			const uid = toFiniteNumber(entry.uid) ?? Number(key);
			const slot = slotByUid.get(uid) ?? null;
			return {
				uid,
				slot,
				isJunk: slot !== null && slot > equipmentSlots,
				data: entry,
				bonuses: getRelicBonusLines(entry).filter((bonus) => bonus.type > 0)
			};
		})
		.filter((entry): entry is RelicEntry => Boolean(entry))
		.sort((left, right) => {
			if (left.slot !== null && right.slot !== null) return left.slot - right.slot;
			if (left.slot !== null) return -1;
			if (right.slot !== null) return 1;
			return left.uid - right.uid;
		});
};

/* ------------------------------------------------------------------ edits */

/** Copies the save down to `items`, applying `edit` to a fresh container. */
const withContainer = (save: SaveData, edit: (container: RelicRecord) => void): SaveData => {
	const current = getRelicContainer(save);
	if (!current) {
		return save;
	}

	const container: RelicRecord = {
		...current,
		items: isRecord(current.items) ? { ...current.items } : {},
		slots: isRecord(current.slots) ? { ...current.slots } : {}
	};
	edit(container);
	return { ...save, items: container };
};

const findRelicKey = (items: RelicRecord, uid: number) =>
	Object.keys(items).find((key) => {
		const entry = items[key];
		return isRecord(entry) && (toFiniteNumber(entry.uid) ?? Number(key)) === uid;
	});

/** Replaces one relic with `edit(relic)`; the relic passed in is already a copy. */
export const updateRelic = (
	save: SaveData,
	uid: number,
	edit: (relic: RelicRecord) => RelicRecord
): SaveData =>
	withContainer(save, (container) => {
		const items = container.items as RelicRecord;
		const key = findRelicKey(items, uid);
		if (key !== undefined) {
			items[key] = edit({ ...(items[key] as RelicRecord) });
		}
	});

/**
 * Sets one bonus line. The level the game shows is worked out from the points
 * on load, so the stored level is only a placeholder until then. Clearing the
 * type clears its points too, and the relic's level is kept as the sum of its
 * points, as the game stores it.
 */
export const setRelicBonus = (
	relic: RelicRecord,
	line: number,
	type: number,
	points: number
): RelicRecord => {
	const cleanPoints = type > 0 ? Math.max(0, Math.floor(points)) : 0;
	const next: RelicRecord = {
		...relic,
		[`bonusType${line}`]: type,
		[`bonus${line}Distribution`]: cleanPoints,
		[`bonus${line}Level`]: String(cleanPoints)
	};
	next.level = getRelicBonusLines(next).reduce((total, bonus) => total + bonus.points, 0);
	return next;
};

export const setRelicRarity = (relic: RelicRecord, rarity: number): RelicRecord => ({ ...relic, rarity });

/**
 * Moves a relic to `slot`, or out of every slot with `null`. A relic already
 * in that slot swaps into the moving relic's old slot; if the moving relic had
 * none, the other one is left without a slot.
 */
export const moveRelicToSlot = (save: SaveData, uid: number, slot: number | null): SaveData =>
	withContainer(save, (container) => {
		const slots = container.slots as RelicRecord;
		const currentSlot = Object.keys(slots).find((key) => toFiniteNumber(slots[key]) === uid);

		if (slot !== null && currentSlot === String(slot)) {
			return;
		}

		const occupant = slot === null ? undefined : slots[String(slot)];

		if (currentSlot !== undefined) {
			if (occupant !== undefined) {
				slots[currentSlot] = occupant;
			} else {
				delete slots[currentSlot];
			}
		}

		if (slot !== null) {
			slots[String(slot)] = uid;
		}
	});

/** The next uid the game would hand out, never one already in use. */
const nextRelicUid = (container: RelicRecord) => {
	const counters = isRecord(container._currentUids) ? container._currentUids : {};
	const used = Object.values(container.items as RelicRecord)
		.map((entry) => (isRecord(entry) ? toFiniteNumber(entry.uid) : null))
		.filter((uid): uid is number => uid !== null);
	return Math.max(toCount(counters.items), used.length > 0 ? Math.max(...used) + 1 : 1);
};

/**
 * Adds a blank Common relic of `type` and puts it in the first free slot,
 * equipment first and then the junk pile. With every slot full it is saved
 * without one. Returns the new uid alongside the save.
 */
export const addRelic = (save: SaveData, type: RelicType): { save: SaveData; uid: number | null } => {
	let uid: number | null = null;

	const next = withContainer(save, (container) => {
		const items = container.items as RelicRecord;
		const slots = container.slots as RelicRecord;
		const imageId = defaultImageIdForType(type);
		uid = nextRelicUid(container);

		const relic: RelicRecord = {
			isNew: false,
			name: 'Relic',
			type,
			uid,
			level: 0,
			rarity: 1,
			imageId,
			upgradeCount: 0
		};
		for (const line of RELIC_BONUS_LINES) {
			relic[`bonusType${line}`] = 0;
			relic[`bonus${line}Distribution`] = 0;
			relic[`bonus${line}Level`] = '0';
		}
		items[String(uid)] = relic;

		const freeSlot = Array.from({ length: getJunkPileSlot(container) }, (_, index) => index + 1).find(
			(slot) => slots[String(slot)] === undefined
		);
		if (freeSlot !== undefined) {
			slots[String(freeSlot)] = uid;
		}

		container._currentUids = {
			...(isRecord(container._currentUids) ? container._currentUids : {}),
			items: uid + 1
		};
	});

	return { save: next, uid };
};

/** Deletes a relic and frees its slot. */
export const removeRelic = (save: SaveData, uid: number): SaveData =>
	withContainer(save, (container) => {
		const items = container.items as RelicRecord;
		const slots = container.slots as RelicRecord;
		const key = findRelicKey(items, uid);

		if (key !== undefined) {
			delete items[key];
		}
		for (const slotKey of Object.keys(slots)) {
			if (toFiniteNumber(slots[slotKey]) === uid) {
				delete slots[slotKey];
			}
		}
	});
