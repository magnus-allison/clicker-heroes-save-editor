"use client";

import { create } from "zustand";

import {
	removeValueAtPath,
	setValueAtPath,
	type PathSegment,
	type SaveData,
} from "@/lib/save-utils";

type SaveStore = {
	saveData: SaveData | null;
	originalSaveData: SaveData | null;
	loadSave: (data: SaveData) => void;
	updateValue: (path: PathSegment[], value: unknown) => void;
	updateSave: (updater: (current: SaveData) => SaveData) => void;
};

export const useSaveStore = create<SaveStore>((set) => ({
	saveData: null,
	originalSaveData: null,
	loadSave: (data) => {
		const nextSave = structuredClone(data);
		set({
			saveData: nextSave,
			originalSaveData: structuredClone(nextSave),
		});
	},
	updateValue: (path, value) => {
		set((state) => {
			if (!state.saveData) {
				return state;
			}

			const saveData =
				typeof value === "boolean" && value === false && path[0] === "achievements"
					? removeValueAtPath(state.saveData, path)
					: setValueAtPath(state.saveData, path, value);

			return { saveData };
		});
	},
	updateSave: (updater) => {
		set((state) => (state.saveData ? { saveData: updater(state.saveData) } : state));
	},
}));
