'use client';

import { useMemo } from 'react';

import { diffSaveData } from '@/lib/save-diff';
import { useSaveStore } from '@/lib/save-store';

/** `null` once the user has been all the way through — nothing left to nudge. */
export type SaveFlowStep = 1 | 2 | 3 | null;

type Options = {
	/**
	 * Whether this tool has an editing step between import and export. The
	 * viewers share the import/export card but have nothing to edit, so they go
	 * straight from 1 to 3.
	 */
	hasEditStep?: boolean;
};

/**
 * Which numbered step the user still has to do, used to shine exactly one step
 * pill at a time: import a save, then edit it, then export it. Editing is
 * detected from the diff against the imported save rather than a flag, so
 * undoing every change puts the user back on step 2.
 */
export const useSaveFlowStep = ({ hasEditStep = false }: Options = {}): SaveFlowStep => {
	const saveData = useSaveStore((state) => state.saveData);
	const originalSaveData = useSaveStore((state) => state.originalSaveData);
	const hasExported = useSaveStore((state) => state.hasExported);

	const hasEdits = useMemo(
		() => diffSaveData(originalSaveData, saveData).changes.length > 0,
		[originalSaveData, saveData]
	);

	if (!saveData) {
		return 1;
	}

	if (hasEditStep && !hasEdits) {
		return 2;
	}

	return hasExported ? null : 3;
};
