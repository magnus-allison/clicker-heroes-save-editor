import { diffSaveData } from '@/lib/save-diff';
import type { SaveData } from '@/lib/save-utils';

/*
 * Keeps the last loaded save (and any edits to it) in `localStorage`, so a
 * visitor who closes or reloads the page can pick up where they left off.
 *
 * The save itself can be large, so it lives under its own key and is only
 * parsed when the visitor asks for it. A second, tiny key holds what the
 * restore banner shows (when, how many edits) and doubles as the
 * `useSyncExternalStore` snapshot: a short string compares by value, so it is
 * stable between renders without caching.
 *
 * Everything here is best-effort. Storage can be missing (privacy modes), full
 * (a huge save), or cleared at any time, and none of that should ever break
 * the editor.
 */

const PAYLOAD_KEY = 'last-save';
const META_KEY = 'last-save-meta';

type StoredPayload = {
	version: 1;
	original: SaveData;
	/** Omitted while the save is unedited, to halve what is stored. */
	current?: SaveData;
};

export type LastSaveMeta = {
	savedAt: number;
	edits: number;
};

export type LastSave = {
	original: SaveData;
	current: SaveData;
};

const listeners = new Set<() => void>();

const notify = () => {
	listeners.forEach((listener) => listener());
};

const isSaveData = (value: unknown): value is SaveData =>
	typeof value === 'object' && value !== null && !Array.isArray(value);

/** Subscribes to changes from this tab and, via `storage` events, other tabs. */
export const subscribeLastSave = (listener: () => void) => {
	const onStorage = (event: StorageEvent) => {
		if (event.key === null || event.key === META_KEY) {
			listener();
		}
	};

	listeners.add(listener);
	window.addEventListener('storage', onStorage);

	return () => {
		listeners.delete(listener);
		window.removeEventListener('storage', onStorage);
	};
};

/** The raw meta string — the `useSyncExternalStore` snapshot. */
export const readLastSaveMetaRaw = (): string | null => {
	try {
		return localStorage.getItem(META_KEY);
	} catch {
		return null;
	}
};

export const parseLastSaveMeta = (raw: string | null): LastSaveMeta | null => {
	if (!raw) {
		return null;
	}

	try {
		const meta: unknown = JSON.parse(raw);
		if (
			typeof meta === 'object' &&
			meta !== null &&
			'savedAt' in meta &&
			'edits' in meta &&
			typeof meta.savedAt === 'number' &&
			typeof meta.edits === 'number'
		) {
			return { savedAt: meta.savedAt, edits: meta.edits };
		}
	} catch {
		// Fall through: unreadable meta means nothing to offer.
	}

	return null;
};

export const readLastSave = (): LastSave | null => {
	try {
		const raw = localStorage.getItem(PAYLOAD_KEY);
		if (!raw) {
			return null;
		}

		const payload = JSON.parse(raw) as Partial<StoredPayload>;
		if (payload.version !== 1 || !isSaveData(payload.original)) {
			return null;
		}

		const current = isSaveData(payload.current) ? payload.current : payload.original;
		return { original: payload.original, current };
	} catch {
		return null;
	}
};

export const clearLastSave = () => {
	try {
		localStorage.removeItem(PAYLOAD_KEY);
		localStorage.removeItem(META_KEY);
	} catch {
		// Nothing to clear if storage is unavailable.
	}

	notify();
};

export const writeLastSave = (original: SaveData, current: SaveData) => {
	const payload: StoredPayload = {
		version: 1,
		original,
		current: current === original ? undefined : current
	};
	const meta: LastSaveMeta = {
		savedAt: Date.now(),
		edits: current === original ? 0 : diffSaveData(original, current).changes.length
	};

	try {
		localStorage.setItem(PAYLOAD_KEY, JSON.stringify(payload));
		localStorage.setItem(META_KEY, JSON.stringify(meta));
		notify();
	} catch {
		// Most likely over quota. A stale save would be worse than none, so drop
		// whatever was there before.
		clearLastSave();
	}
};
