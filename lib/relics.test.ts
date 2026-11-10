import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
	addRelic,
	getRelicBonusLines,
	moveRelicToSlot,
	defaultImageIdForType,
	getRelicImage,
	relicTypes,
	removeRelic,
	setRelicBonus,
	setRelicImage,
	setRelicRarity,
	toRelicEntries,
	updateRelic
} from './relics.ts';
import type { SaveData } from './save-utils.ts';

const relic = (uid: number, bonuses: [number, number][] = []) => {
	const record: Record<string, unknown> = { uid, name: `Relic ${uid}`, type: 'ring', rarity: 1, imageId: 49 };
	for (let line = 1; line <= 4; line++) {
		const [type, points] = bonuses[line - 1] ?? [0, 0];
		record[`bonusType${line}`] = type;
		record[`bonus${line}Distribution`] = points;
		record[`bonus${line}Level`] = String(points);
	}
	record.level = bonuses.reduce((total, [, points]) => total + points, 0);
	return record;
};

/** Two equipped relics, one in the junk pile and one in no slot. */
const sampleSave = (): SaveData => ({
	items: {
		equipmentSlots: 4,
		salvagePoints: 100,
		items: {
			'2': relic(2, [[9, 50]]),
			'7': relic(7, [
				[28, 3],
				[5, 4]
			]),
			'8': relic(8),
			'12': relic(12, [[1, 10]])
		},
		slots: { '1': 12, '2': 2, '5': 7 },
		_currentUids: { items: 13 }
	}
});

const slotsOf = (save: SaveData) => (save.items as { slots: Record<string, number> }).slots;
const itemsOf = (save: SaveData) => (save.items as { items: Record<string, Record<string, unknown>> }).items;

describe('toRelicEntries', () => {
	test('orders slotted relics by slot, then the rest by uid, and marks the junk pile', () => {
		const entries = toRelicEntries(sampleSave());
		assert.deepEqual(
			entries.map((entry) => [entry.uid, entry.slot, entry.isJunk]),
			[
				[12, 1, false],
				[2, 2, false],
				[7, 5, true],
				[8, null, false]
			]
		);
	});

	test('lists only the bonus lines in use, with confirmed ancients named', () => {
		const [, , junk] = toRelicEntries(sampleSave());
		assert.deepEqual(
			junk.bonuses.map((bonus) => [bonus.line, bonus.type, bonus.ancient, bonus.points]),
			[
				[1, 28, 'Vaagur', 3],
				[2, 5, 'Revolc', 4]
			]
		);
	});

	test('returns nothing for a save without relics', () => {
		assert.deepEqual(toRelicEntries(null), []);
		assert.deepEqual(toRelicEntries({}), []);
	});
});

describe('setRelicBonus', () => {
	test('stores points as the distribution and recomputes the relic level', () => {
		const next = setRelicBonus(relic(2, [[9, 50]]), 2, 22, 30);
		assert.equal(next.bonusType2, 22);
		assert.equal(next.bonus2Distribution, 30);
		assert.equal(next.bonus2Level, '30');
		assert.equal(next.level, 80);
	});

	test('clearing a type clears its points', () => {
		const next = setRelicBonus(
			relic(2, [
				[9, 50],
				[22, 30]
			]),
			2,
			0,
			30
		);
		assert.equal(next.bonus2Distribution, 0);
		assert.equal(next.level, 50);
	});

	test('rounds points down and never goes below zero', () => {
		assert.equal(setRelicBonus(relic(2), 1, 9, 12.9).bonus1Distribution, 12);
		assert.equal(setRelicBonus(relic(2), 1, 9, -5).bonus1Distribution, 0);
	});

	test('leaves the original relic untouched', () => {
		const original = relic(2, [[9, 50]]);
		setRelicBonus(original, 1, 1, 1);
		assert.equal(original.bonusType1, 9);
	});
});

describe('updateRelic', () => {
	test('edits one relic without changing the original save', () => {
		const save = sampleSave();
		const next = updateRelic(save, 7, (entry) => setRelicRarity(entry, 5));
		assert.equal(itemsOf(next)['7'].rarity, 5);
		assert.equal(itemsOf(save)['7'].rarity, 1);
		assert.equal(itemsOf(next)['2'], itemsOf(save)['2']);
	});

	test('reads bonus lines back after an edit', () => {
		const next = updateRelic(sampleSave(), 8, (entry) => setRelicBonus(entry, 3, 17, 40));
		assert.deepEqual(
			getRelicBonusLines(itemsOf(next)['8']).map((bonus) => bonus.type),
			[0, 0, 17, 0]
		);
	});
});

describe('moveRelicToSlot', () => {
	test('moves into a free slot', () => {
		const next = moveRelicToSlot(sampleSave(), 2, 3);
		assert.deepEqual(slotsOf(next), { '1': 12, '3': 2, '5': 7 });
	});

	test('swaps with the relic already in the target slot', () => {
		const next = moveRelicToSlot(sampleSave(), 12, 5);
		assert.deepEqual(slotsOf(next), { '1': 7, '2': 2, '5': 12 });
	});

	test('a relic with no slot pushes the occupant out of its slot', () => {
		const next = moveRelicToSlot(sampleSave(), 8, 1);
		assert.deepEqual(slotsOf(next), { '1': 8, '2': 2, '5': 7 });
	});

	test('null takes a relic out of every slot', () => {
		const next = moveRelicToSlot(sampleSave(), 7, null);
		assert.deepEqual(slotsOf(next), { '1': 12, '2': 2 });
	});

	test('does not change the original save', () => {
		const save = sampleSave();
		moveRelicToSlot(save, 12, 5);
		assert.deepEqual(slotsOf(save), { '1': 12, '2': 2, '5': 7 });
	});
});

describe('addRelic', () => {
	test('adds a blank Common relic in the first free slot and bumps the uid counter', () => {
		const { save, uid } = addRelic(sampleSave(), 'gloves');
		assert.equal(uid, 13);
		const added = itemsOf(save)['13'];
		assert.equal(added.type, 'gloves');
		// Ranger Gloves, the lowest gloves id the game gives Common relics.
		assert.equal(added.imageId, 3);
		assert.equal(added.rarity, 1);
		assert.equal(added.level, 0);
		assert.equal(slotsOf(save)['3'], 13);
		assert.deepEqual((save.items as { _currentUids: unknown })._currentUids, { items: 14 });
	});

	test('never reuses a uid, even when the counter is behind', () => {
		const behind = sampleSave();
		(behind.items as { _currentUids: { items: number } })._currentUids.items = 3;
		assert.equal(addRelic(behind, 'ring').uid, 13);
	});

	test('leaves the relic without a slot when every slot is full', () => {
		let save = sampleSave();
		save = addRelic(save, 'ring').save;
		save = addRelic(save, 'ring').save;
		const { save: full, uid } = addRelic(save, 'helm');
		assert.ok(uid !== null && itemsOf(full)[String(uid)]);
		assert.ok(!Object.values(slotsOf(full)).includes(uid as number));
	});
});

describe('removeRelic', () => {
	test('deletes the relic and frees its slot', () => {
		const next = removeRelic(sampleSave(), 7);
		assert.equal(itemsOf(next)['7'], undefined);
		assert.deepEqual(slotsOf(next), { '1': 12, '2': 2 });
	});
});

describe('relic looks', () => {
	test('every type has a default look the game gives Common relics', () => {
		for (const type of relicTypes) {
			const image = getRelicImage(defaultImageIdForType(type));
			assert.equal(image?.type, type);
			assert.equal(image?.minRarity, 1);
		}
	});

	test('changing the look changes the type with it', () => {
		const next = setRelicImage(relic(2), 18);
		assert.equal(next.imageId, 18);
		assert.equal(next.type, 'sword');
	});

	test('an unknown look leaves the relic alone', () => {
		const original = relic(2);
		assert.equal(setRelicImage(original, 999), original);
		assert.equal(getRelicImage(999), null);
		assert.equal(getRelicImage('49')?.name, 'Copper Band');
	});
});
