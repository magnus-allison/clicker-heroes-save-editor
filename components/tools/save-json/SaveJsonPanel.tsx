'use client';

import { useState } from 'react';

import posthog from 'posthog-js';

import { SaveExportField } from '@/components/editor/SaveExportField';
import { SaveImportField } from '@/components/editor/SaveImportField';
import { useSaveImport } from '@/components/editor/useSaveImport';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { PanelSection } from '@/components/ui/PanelSection';
import { StepTitle } from '@/components/ui/StepTitle';
import { TextInput } from '@/components/ui/TextInput';
import { useToast } from '@/components/ui/ToastProvider';
import { encodeSaveData } from '@/lib/save-codec';
import type { SaveData } from '@/lib/save-utils';

/**
 * Parses the JSON textarea into something `encodeSaveData` will accept. The
 * codec only ever gets a plain object, so arrays and primitives are rejected
 * here rather than deeper in the pipeline where the error would be cryptic.
 */
const parseSaveJson = (value: string): SaveData => {
	const parsed: unknown = JSON.parse(value);

	if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
		throw new Error('JSON must parse to an object.');
	}

	return parsed as SaveData;
};

export const SaveJsonPanel = () => {
	const { showToast } = useToast();
	const [jsonValue, setJsonValue] = useState('');
	const [encodeValue, setEncodeValue] = useState('');
	const isJsonEmpty = jsonValue.trim().length === 0;

	const importSave = useSaveImport({
		onDecoded: (decoded) => {
			// Decoding already produced the object, so fill the editable JSON
			// straight away instead of making the user click a second button.
			setJsonValue(JSON.stringify(decoded.data, null, 2));
			// The old export belongs to the save that was just replaced.
			setEncodeValue('');
			posthog.capture('save_json_decoded');
		},
		onFailed: () => {
			setJsonValue('');
			setEncodeValue('');
		}
	});

	// Encoding stringifies and deflates the whole save, so it only ever runs
	// from this click — never from an effect watching the textarea.
	const handleEncode = () => {
		if (isJsonEmpty) {
			showToast('Paste some JSON before converting.');
			return;
		}

		try {
			setEncodeValue(encodeSaveData(parseSaveJson(jsonValue)));
			showToast('JSON converted to save data.');
			posthog.capture('save_json_encoded');
		} catch (error) {
			showToast(error instanceof Error ? error.message : 'Failed to convert JSON to save data.');
			posthog.captureException(error);
			posthog.capture('save_json_encode_failed', {
				error_message: error instanceof Error ? error.message : 'Unknown error'
			});
		}
	};

	const handleFormat = () => {
		try {
			setJsonValue(JSON.stringify(parseSaveJson(jsonValue), null, 2));
			showToast('JSON formatted.');
		} catch (error) {
			showToast(error instanceof Error ? error.message : 'That JSON could not be parsed.');
		}
	};

	return (
		<>
			<PanelSection className='grid lg:grid-cols-2 p-0'>
				<SaveImportField fileInputId='save-json-file-input' isActiveStep={isJsonEmpty} onLoad={importSave} />
				<SaveExportField
					actionLabel='Convert JSON to Save'
					ariaLabel='Encoded save data to export'
					dataLabel='edited data'
					isActiveStep={!isJsonEmpty && encodeValue.length === 0}
					onAction={handleEncode}
					onValueChange={setEncodeValue}
					placeholder='Your encoded save data will appear here...'
					title='Export Your Save Data'
					value={encodeValue}
				/>
			</PanelSection>

			<StepTitle step={2} title='Edit The Raw Save JSON' />
			<PanelSection>
				<div className='flex flex-col gap-3 p-3 sm:p-4'>
					<p className='text-[13px] leading-6 text-(--color-fg-secondary)'>
						Importing a save decodes it into the JSON below. Edit any field by hand, then convert it back into
						an encoded save string. Pasting JSON straight in works too — no save import needed.
					</p>
					<div className='flex min-w-0 items-start gap-2'>
						<TextInput
							ariaLabel='Raw save JSON'
							className='min-h-96'
							multiline
							onValueChange={setJsonValue}
							placeholder='Paste save JSON here, or import a save above...'
							resizable
							rows={24}
							value={jsonValue}
						/>
						<CopyButton
							className='min-w-10 px-0'
							idleLabel='Copy'
							onCopied={() => showToast('JSON copied.')}
							onCopyFailed={() => showToast('Copying is not available in this browser.')}
							text={jsonValue}
						/>
					</div>
					<div className='flex flex-wrap gap-2'>
						<Button disabled={isJsonEmpty} onClick={handleFormat} variant='subtle'>
							Format JSON
						</Button>
					</div>
				</div>
			</PanelSection>
		</>
	);
};
