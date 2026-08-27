'use client';

import { useState } from 'react';

import posthog from 'posthog-js';

import { SaveChangesSummary } from '@/components/editor/SaveChangesSummary';
import { SaveExportField } from '@/components/editor/SaveExportField';
import { SaveImportField } from '@/components/editor/SaveImportField';
import { useSaveImport } from '@/components/editor/useSaveImport';
import { PanelSection } from '@/components/ui/PanelSection';
import { useToast } from '@/components/ui/ToastProvider';
import type { ExampleSave } from '@/lib/data/example-saves';
import { encodeSaveData } from '@/lib/save-codec';
import { useSaveFlowStep } from '@/lib/save-flow';
import { useSaveStore } from '@/lib/save-store';

interface Props {
	onLoadSuccess?: () => void;
	examples?: ExampleSave[];
	/** True for the full editor, where step 2 sits between import and export. */
	hasEditStep?: boolean;
}

/**
 * Import/export card shared by the editor tools. Both halves live in one card
 * so the encoded string is always within reach of the field it came from.
 */
export const SaveDataPanel = ({ onLoadSuccess, examples, hasEditStep = false }: Props) => {
	const { showToast } = useToast();
	const saveData = useSaveStore((state) => state.saveData);
	const markExported = useSaveStore((state) => state.markExported);
	const activeStep = useSaveFlowStep({ hasEditStep });
	const [encodeValue, setEncodeValue] = useState('');

	const importSave = useSaveImport({
		onDecoded: (_decoded, request) => {
			// The old export belongs to the save that was just replaced.
			setEncodeValue('');
			if (request.isSubmit) {
				onLoadSuccess?.();
			}
		}
	});

	const handleEncode = () => {
		if (!saveData) {
			showToast('Load a save before encoding.');
			return;
		}

		try {
			// `encodeSaveData` stringifies and deflates, both of which can throw on
			// a save the editor has been pushed into a bad shape.
			setEncodeValue(encodeSaveData(saveData));
			markExported();
			showToast('Save encoded.');
			posthog.capture('save_encoded');
		} catch (error) {
			showToast(error instanceof Error ? error.message : 'Failed to encode save data.');
			posthog.captureException(error);
			posthog.capture('save_encode_failed', {
				error_message: error instanceof Error ? error.message : 'Unknown error'
			});
		}
	};

	return (
		<PanelSection className='grid lg:grid-cols-2 p-0'>
			<SaveImportField
				examples={examples}
				fileInputId='save-file-input'
				isActiveStep={activeStep === 1}
				onLoad={importSave}
			/>
			<SaveExportField
				actionLabel='Encode Save'
				ariaLabel='Encoded save data to export'
				belowOutput={<SaveChangesSummary />}
				dataLabel='edited data'
				isActiveStep={activeStep === 3}
				onAction={handleEncode}
				onValueChange={setEncodeValue}
				placeholder='Your encoded save data will appear here...'
				title='Export Your Save Data'
				value={encodeValue}
			/>
		</PanelSection>
	);
};
