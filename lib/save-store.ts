'use client';

import { create } from 'zustand';

import {
	removeValueAtPath,
	setValueAtPath,
	setValuesAtPaths,
	type PathSegment,
	type SaveData,
	type ValueUpdate
} from '@/lib/save-utils';

type SaveStore = {
	saveData: SaveData | null;
	originalSaveData: SaveData | null;
	/**
	 * Whether the save in its *current* shape has been encoded. Any later edit
	 * invalidates the exported string, so this flips back to `false` — it drives
	 * the "step 3" highlight, which should come back when there is new work to
	 * export.
	 */
	hasExported: boolean;
	loadSave: (data: SaveData) => void;
	markExported: () => void;
	updateValue: (path: PathSegment[], value: unknown) => void;
	updateValues: (updates: ValueUpdate[]) => void;
	updateSave: (updater: (current: SaveData) => SaveData) => void;
};

/**
 * Unticking an achievement has to *remove* the key, not set it to `false`:
 * Clicker Heroes treats `achievements` as a set of unlocked ids, and any key
 * that is present counts as unlocked whatever its value. Writing `false` would
 * leave the achievement unlocked in game.
 */
function isAchievementUnset(path: PathSegment[], value: unknown) {
	return value === false && path[0] === 'achievements';
}

function applyUpdate(save: SaveData, { path, value }: ValueUpdate) {
	return isAchievementUnset(path, value) ? removeValueAtPath(save, path) : setValueAtPath(save, path, value);
}

export const useSaveStore = create<SaveStore>((set) => ({
	saveData: null,
	originalSaveData: null,
	hasExported: false,
	loadSave: (data) => {
		// One clone is enough. Nothing mutates `saveData` in place — every edit
		// goes through the copy-on-write helpers in `lib/save-utils` — so
		// `originalSaveData` can share the object instead of paying for a second
		// deep copy. It is only read as a "which save is loaded" identity signal
		// (see `RemoveClanDataEditor`), never as a mutable snapshot.
		const nextSave = structuredClone(data);
		set({ saveData: nextSave, originalSaveData: nextSave, hasExported: false });
	},
	markExported: () => {
		set({ hasExported: true });
	},
	updateValue: (path, value) => {
		set((state) =>
			state.saveData
				? { saveData: applyUpdate(state.saveData, { path, value }), hasExported: false }
				: state
		);
	},
	updateValues: (updates) => {
		set((state) => {
			if (!state.saveData || updates.length === 0) {
				return state;
			}

			// Plain writes go through in a single copy pass; the rare achievement
			// removals are folded in afterwards.
			const removals = updates.filter((update) => isAchievementUnset(update.path, update.value));
			const writes = updates.filter((update) => !isAchievementUnset(update.path, update.value));

			return {
				saveData: removals.reduce(
					(save, { path }) => removeValueAtPath(save, path),
					setValuesAtPaths(state.saveData, writes)
				),
				hasExported: false
			};
		});
	},
	updateSave: (updater) => {
		set((state) => (state.saveData ? { saveData: updater(state.saveData), hasExported: false } : state));
	}
}));
