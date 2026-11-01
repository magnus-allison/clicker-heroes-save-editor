'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { SaveChangesSummary } from '@/components/editor/SaveChangesSummary';
import { SaveExportField } from '@/components/editor/SaveExportField';
import { SaveImportField } from '@/components/editor/SaveImportField';
import { useEditorText } from '@/components/editor/useEditorText';
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
	const t = useTranslations('editor.saveDataPanel');
	const { errorMessage } = useEditorText();
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
			showToast(t('loadFirst'));
			return;
		}

		try {
			// `encodeSaveData` stringifies and deflates, both of which can throw on
			// a save the editor has been pushed into a bad shape.
			setEncodeValue(encodeSaveData(saveData));
			markExported();
			showToast(t('encoded'));
		} catch (error) {
			showToast(errorMessage(error, t('encodeFailed')));
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
				actionLabel={t('encodeAction')}
				ariaLabel={t('ariaLabel')}
				belowOutput={<SaveChangesSummary />}
				dataLabel={t('dataLabel')}
				isActiveStep={activeStep === 3}
				onAction={handleEncode}
				onValueChange={setEncodeValue}
				placeholder={t('placeholder')}
				title={t('title')}
				value={encodeValue}
			/>
		</PanelSection>
	);
};
