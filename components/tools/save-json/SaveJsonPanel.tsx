'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

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

/** Thrown when the JSON is valid but is not the object a save has to be. */
class NotAnObjectError extends Error {
	constructor() {
		super('JSON must parse to an object.');
		this.name = 'NotAnObjectError';
	}
}

/**
 * Parses the JSON textarea into something `encodeSaveData` will accept. The
 * codec only ever gets a plain object, so arrays and primitives are rejected
 * here rather than deeper in the pipeline where the error would be cryptic.
 */
const parseSaveJson = (value: string): SaveData => {
	const parsed: unknown = JSON.parse(value);

	if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
		throw new NotAnObjectError();
	}

	return parsed as SaveData;
};

export const SaveJsonPanel = () => {
	const t = useTranslations('tools.saveJson');
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
			showToast(t('toasts.empty'));
			return;
		}

		try {
			setEncodeValue(encodeSaveData(parseSaveJson(jsonValue)));
			showToast(t('toasts.converted'));
		} catch (error) {
			if (error instanceof NotAnObjectError) {
				showToast(t('toasts.notAnObject'));
			} else {
				// Parser and codec errors are technical detail, so they are
				// passed through as the reason rather than translated.
				showToast(
					error instanceof Error
						? t('toasts.convertFailedWithReason', { reason: error.message })
						: t('toasts.convertFailed')
				);
			}
		}
	};

	const handleFormat = () => {
		try {
			setJsonValue(JSON.stringify(parseSaveJson(jsonValue), null, 2));
			showToast(t('toasts.formatted'));
		} catch (error) {
			if (error instanceof NotAnObjectError) {
				showToast(t('toasts.notAnObject'));
			} else {
				showToast(
					error instanceof Error
						? t('toasts.parseFailedWithReason', { reason: error.message })
						: t('toasts.parseFailed')
				);
			}
		}
	};

	return (
		<>
			<PanelSection className='grid lg:grid-cols-2 p-0'>
				<SaveImportField fileInputId='save-json-file-input' isActiveStep={isJsonEmpty} onLoad={importSave} />
				<SaveExportField
					actionLabel={t('export.action')}
					ariaLabel={t('export.ariaLabel')}
					dataLabel={t('export.dataLabel')}
					isActiveStep={!isJsonEmpty && encodeValue.length === 0}
					onAction={handleEncode}
					onValueChange={setEncodeValue}
					placeholder={t('export.placeholder')}
					title={t('export.title')}
					value={encodeValue}
				/>
			</PanelSection>

			<StepTitle step={2} title={t('step')} />
			<PanelSection>
				<div className='flex flex-col gap-3 p-3 sm:p-4'>
					<p className='text-[13px] leading-6 text-(--color-fg-secondary)'>{t('intro')}</p>
					<div className='flex min-w-0 items-start gap-2'>
						<TextInput
							ariaLabel={t('jsonAriaLabel')}
							className='min-h-96'
							multiline
							onValueChange={setJsonValue}
							placeholder={t('jsonPlaceholder')}
							resizable
							rows={24}
							value={jsonValue}
						/>
						<CopyButton
							className='min-w-10 px-0'
							onCopied={() => showToast(t('toasts.copied'))}
							onCopyFailed={() => showToast(t('toasts.copyFailed'))}
							text={jsonValue}
						/>
					</div>
					<div className='flex flex-wrap gap-2'>
						<Button disabled={isJsonEmpty} onClick={handleFormat} variant='subtle'>
							{t('format')}
						</Button>
					</div>
				</div>
			</PanelSection>
		</>
	);
};
