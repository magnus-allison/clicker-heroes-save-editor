'use client';

import { startTransition } from 'react';

import posthog from 'posthog-js';

import type { SaveImportRequest } from '@/components/editor/SaveImportField';
import { useToast } from '@/components/ui/ToastProvider';
import { decodeSaveString, type DecodeResult } from '@/lib/save-codec';
import { useSaveStore } from '@/lib/save-store';

type Options = {
	/** Runs after the save is in the store, before the analytics event. */
	onDecoded?: (decoded: DecodeResult, request: SaveImportRequest) => void;
	/** Runs when the string could not be decoded, before the error toast. */
	onFailed?: (request: SaveImportRequest) => void;
};

/**
 * Turns a `SaveImportField` request into a loaded save: decode, put it in the
 * store, toast, report. Every tool reports the same events, so the analytics
 * live here rather than in each panel.
 */
export const useSaveImport = ({ onDecoded, onFailed }: Options = {}) => {
	const { showToast } = useToast();
	const loadSave = useSaveStore((state) => state.loadSave);

	return (request: SaveImportRequest) => {
		const { source, value } = request;

		try {
			const decoded = decodeSaveString(value);
			startTransition(() => {
				loadSave(decoded.data);
			});
			onDecoded?.(decoded, request);
			showToast('Save data loaded.');
			posthog.capture('save_decoded', { source });
		} catch (error) {
			onFailed?.(request);
			showToast(error instanceof Error ? error.message : 'Failed to decode save data.');
			posthog.captureException(error, { properties: { source } });
			posthog.capture('save_decode_failed', {
				source,
				error_message: error instanceof Error ? error.message : 'Unknown error'
			});
		}
	};
};
