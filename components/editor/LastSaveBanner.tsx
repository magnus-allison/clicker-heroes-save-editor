'use client';

import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { useFormatter, useNow, useTranslations } from 'next-intl';
import { ArrowRight, X } from 'lucide-react';

import { useToast } from '@/components/ui/ToastProvider';
import {
	clearLastSave,
	parseLastSaveMeta,
	readLastSave,
	readLastSaveMetaRaw,
	subscribeLastSave,
	writeLastSave
} from '@/lib/last-save';
import { useSaveStore } from '@/lib/save-store';
import type { SaveData } from '@/lib/save-utils';

/** Edits arrive per keystroke; writing a large save that often is wasteful. */
const WRITE_DELAY_MS = 500;

/**
 * Mirrors the loaded save into storage whenever it changes, debounced, and
 * flushes on `pagehide` so the last edit before closing the tab is not lost.
 */
const usePersistLastSave = () => {
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

type Props = {
	/** Runs after the stored save is back in the store, like a fresh import. */
	onRestore?: () => void;
};

/**
 * A thin prompt above the import card offering to reload the save from the
 * visitor's last session. Only shown while nothing is loaded, so it never
 * competes with a save already in the editor. It also owns writing that save,
 * since every tool that can load or edit one renders it.
 */
export const LastSaveBanner = ({ onRestore }: Props) => {
	usePersistLastSave();

	const t = useTranslations('editor.lastSave');
	const format = useFormatter();
	const now = useNow({ updateInterval: 60_000 });
	const { showToast } = useToast();
	const hasSave = useSaveStore((state) => state.saveData !== null);
	const restoreSave = useSaveStore((state) => state.restoreSave);

	// `null` on the server and during hydration, so the banner only ever
	// appears on the client and cannot cause a hydration mismatch.
	const metaRaw = useSyncExternalStore(subscribeLastSave, readLastSaveMetaRaw, () => null);
	const meta = useMemo(() => parseLastSaveMeta(metaRaw), [metaRaw]);

	if (hasSave || !meta) {
		return null;
	}

	const restore = () => {
		const stored = readLastSave();
		if (!stored) {
			clearLastSave();
			showToast(t('failed'));
			return;
		}

		restoreSave(stored.original, stored.current);
		showToast(t('restored'));
		onRestore?.();
	};

	return (
		// Same shape as `SeasonalItemsBanner`, in the site banner purple rather than gold.
		<div
			className='flex flex-wrap items-center gap-x-3 gap-y-2 rounded-(--radius-card) border border-(--color-banner-pill-edge) bg-(--color-banner-pill) px-4 py-2.5'
			role='status'
		>
			<span className='inline-flex h-5 shrink-0 items-center rounded-full border border-(--color-banner-pill-edge) px-2 text-[10px] font-bold tracking-wide text-(--color-banner-accent)'>
				{t('badge')}
			</span>
			<span className='min-w-0 text-xs text-fg-secondary'>
				{t('message')}{' '}
				<span className='text-(--color-fg-dim)'>
					{t('detail', {
						time: format.relativeTime(meta.savedAt, now),
						edits: meta.edits
					})}
				</span>
			</span>
			<span className='ml-auto inline-flex shrink-0 items-center gap-3'>
				<button
					className='group inline-flex items-center gap-1.5 rounded-sm text-[11px] font-semibold text-(--color-banner-accent) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)'
					onClick={restore}
					type='button'
				>
					{t('restore')}
					<ArrowRight
						aria-hidden='true'
						className='h-3 w-3 transition-transform group-hover:translate-x-0.5'
					/>
				</button>
				<button
					aria-label={t('dismissLabel')}
					className='inline-flex h-5 w-5 items-center justify-center rounded-sm text-(--color-fg-dim) transition-colors hover:text-(--color-fg) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)'
					onClick={clearLastSave}
					title={t('dismissLabel')}
					type='button'
				>
					<X aria-hidden='true' className='h-3.5 w-3.5' />
				</button>
			</span>
		</div>
	);
};
