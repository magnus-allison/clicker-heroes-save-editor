'use client';

import { useEffect } from 'react';

import { subscribeLastSave, writeLastSave } from '@/lib/last-save';
import { useSaveStore } from '@/hooks/useSaveStore';
import type { SaveData } from '@/lib/save-utils';

const WRITE_DELAY_MS = 500;

/**
 * Mirrors the loaded save into storage whenever it changes, debounced, and
 * flushes on `pagehide` so the last edit before closing the tab is not lost.
 */
export const usePersistLastSave = () => {
	useEffect(() => {
		let timer: number | undefined;
		let pending: { original: SaveData; current: SaveData } | null = null;

		const flush = () => {
			window.clearTimeout(timer);
			timer = undefined;
			if (pending) {
				writeLastSave(pending.original, pending.current);
				pending = null;
			}
		};

		const unsubscribe = useSaveStore.subscribe((state, previous) => {
			const { originalSaveData, saveData } = state;
			if (!saveData || !originalSaveData) {
				return;
			}
			if (saveData === previous.saveData && originalSaveData === previous.originalSaveData) {
				return;
			}

			pending = { original: originalSaveData, current: saveData };
			window.clearTimeout(timer);
			timer = window.setTimeout(flush, WRITE_DELAY_MS);
		});

		window.addEventListener('pagehide', flush);

		return () => {
			unsubscribe();
			window.removeEventListener('pagehide', flush);
			flush();
		};
	}, []);
};
