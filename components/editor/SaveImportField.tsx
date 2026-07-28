'use client';

import type { ChangeEvent } from 'react';
import { useRef, useState } from 'react';

import posthog from 'posthog-js';

import { ExampleSaveButtons } from '@/components/editor/ExampleSaveButtons';
import { SaveHelpToolTip } from '@/components/editor/SaveHelpToolTip';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { EditorImage } from '@/components/ui/EditorImage';
import { StepTitle } from '@/components/ui/StepTitle';
import { TextInput } from '@/components/ui/TextInput';
import { useToast } from '@/components/ui/ToastProvider';
import type { ExampleSave } from '@/lib/data/example-saves';

export type SaveImportSource = 'paste' | 'file' | 'example';

export type SaveImportRequest = {
	value: string;
	source: SaveImportSource;
	/**
	 * True only for an explicit "Load Save Data" click — the one path a caller is
	 * allowed to treat as a deliberate submit (for example by scrolling on).
	 */
	isSubmit: boolean;
};

type Props = {
	step: number;
	/** Unique per page, because the hidden file input is a real form control. */
	fileInputId: string;
	examples?: ExampleSave[];
	onLoad: (request: SaveImportRequest) => void;
};

/**
 * A whole encoded save is a few hundred kilobytes of base64 at most. Anything
 * far past that is a wrong file, and reading it would pull the entire thing
 * into memory before the synchronous inflate even starts.
 */
const MAX_SAVE_FILE_BYTES = 4 * 1024 * 1024;

/**
 * Step 1 of every save tool: pick a file, paste a string, or load an example.
 * Owns the picked-file name and the pasted text; the caller only decides what
 * "load this" means.
 */
export const SaveImportField = ({ examples, fileInputId, onLoad, step }: Props) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const { showToast } = useToast();
	const [selectedFileName, setSelectedFileName] = useState('No file selected');
	const [decodeValue, setDecodeValue] = useState('');

	const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
		const input = event.target;
		const file = input.files?.[0];

		if (!file) {
			return;
		}

		// Clearing the input lets the same file be picked again after a failure.
		input.value = '';

		if (file.size > MAX_SAVE_FILE_BYTES) {
			showToast('That file is too large to be a Clicker Heroes save.');
			return;
		}

		let text: string;

		try {
			text = await file.text();
		} catch {
			showToast('That file could not be read. Try choosing it again.');
			return;
		}

		setSelectedFileName(file.name);
		setDecodeValue(text);
		posthog.capture('save_file_uploaded', { file_name: file.name });
		onLoad({ value: text, source: 'file', isSubmit: false });
	};

	return (
		<section className='min-w-0'>
			<StepTitle step={step} title='Import Your Save Data' trailing={<SaveHelpToolTip />} />
			<div className='flex flex-col gap-2.5 p-3 sm:p-4'>
				<input
					aria-label='Choose save file'
					className='hidden'
					id={fileInputId}
					name='saveFile'
					onChange={(event) => {
						void handleFileChange(event);
					}}
					ref={inputRef}
					type='file'
				/>
				<div className='flex flex-wrap items-center gap-2'>
					<Button
						className='justify-center whitespace-nowrap'
						onClick={() => inputRef.current?.click()}
						variant='subtle'
					>
						<EditorImage
							alt='Upload save file'
							className='h-4 w-4 shrink-0 object-contain opacity-80'
							size={16}
							src='/assets/icons/folder-open.svg'
							style={{ filter: 'var(--color-icon-filter)' }}
						/>
						<span>Upload file</span>
					</Button>
					<p className='max-w-full truncate text-[12px] text-fg-muted'>{selectedFileName}</p>
				</div>
				<p className='ml-2 py-2 text-left text-[11px] uppercase tracking-[0.08em] text-(--color-fg-dim)'>
					-- or paste below --
				</p>
				<div
					className='flex min-w-0 items-start gap-2'
					// `TextInput` does not expose `onPaste`, but paste events bubble,
					// so pasting a save still loads it immediately.
					onPaste={(event) => {
						const pastedData = event.clipboardData.getData('text');
						if (pastedData) {
							onLoad({ value: pastedData, source: 'paste', isSubmit: false });
						}
					}}
				>
					<TextInput
						ariaLabel='Encoded save data to import'
						className='min-h-32'
						multiline
						onValueChange={setDecodeValue}
						placeholder='Paste your encoded save data here...'
						resizable
						value={decodeValue}
					/>
					<CopyButton
						className='min-w-10 px-0'
						idleLabel='Copy'
						onCopied={() => showToast('Text copied.')}
						onCopyFailed={() => showToast('Copying is not available in this browser.')}
						text={decodeValue}
					/>
				</div>
				<div className='flex flex-wrap gap-2'>
					<Button
						className='flex-1'
						onClick={() => onLoad({ value: decodeValue, source: 'paste', isSubmit: true })}
						variant='primary'
					>
						Load Save Data
					</Button>
				</div>
				<ExampleSaveButtons
					customExamples={examples}
					onSelect={(save) => {
						setSelectedFileName('Example save');
						setDecodeValue(save);
						onLoad({ value: save, source: 'example', isSubmit: false });
					}}
				/>
			</div>
		</section>
	);
};
