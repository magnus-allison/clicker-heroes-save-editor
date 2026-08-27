'use client';

import type { ChangeEvent } from 'react';
import { useRef, useState } from 'react';

import posthog from 'posthog-js';

import { ExampleSaveButtons } from '@/components/editor/ExampleSaveButtons';
import { CopyButton } from '@/components/ui/CopyButton';
import { EditorImage } from '@/components/ui/EditorImage';
import { FieldDivider } from '@/components/ui/FieldDivider';
import { TextInput } from '@/components/ui/TextInput';
import { useToast } from '@/components/ui/ToastProvider';
import type { ExampleSave } from '@/lib/data/example-saves';
import { FileUpIcon, MonitorUpIcon } from 'lucide-react';
import { Pill } from '../ui/Pill';
import { CardTitle } from '../ui/LinkCard';
import { SaveDataButton } from './SaveDataButton';

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
	fileInputId: string;
	examples?: ExampleSave[];
	isActiveStep?: boolean;
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
export const SaveImportField = ({ examples, fileInputId, isActiveStep = false, onLoad }: Props) => {
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
		<section className='min-w-0 p-5'>
			<span className='flex items-center gap-2'>
				<span className='flex items-center justify-center transition-[background-color] duration-200'>
					<FileUpIcon aria-hidden='true' className='h-4.5 w-4.5' />
				</span>
				<Pill className='ml-auto' isShining={isActiveStep}>
					Step 1
				</Pill>
			</span>
			<CardTitle title='Import save data' />

			<div className='flex flex-col gap-2.5'>
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
					<button
						className='gap-1.5 whitespace-nowrap rounded-full
						shadow-card px-2.5 py-1.5 font-medium text-fg-dim transition-[background-color] duration-200 hover:bg-(--color-bg-subtle-hover) dark:border-(--color-border-dark) dark:bg-(--color-bg-subtle-dark) dark:text-(--color-fg-dim-dark) dark:hover:bg-(--color-bg-subtle-hover-dark) flex items-center'
						onClick={() => inputRef.current?.click()}
					>
						<MonitorUpIcon className='w-3.5 h-3.5 mt-0.5' />
						<span className='font-aeonik text-sm'>Upload File</span>
					</button>
					<p className='max-w-full truncate text-[11px] text-(--color-fg-dim)'>{selectedFileName}</p>
				</div>
				<FieldDivider label='or paste below' />
				<div
					className='flex min-w-0 items-start gap-2'
					onPaste={(event) => {
						const pastedData = event.clipboardData.getData('text');
						if (pastedData) {
							onLoad({ value: pastedData, source: 'paste', isSubmit: false });
						}
					}}
				>
					<TextInput
						ariaLabel='Encoded save data to import'
						className='min-h-33'
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
				<ExampleSaveButtons
					customExamples={examples}
					onSelect={(save) => {
						setSelectedFileName('Example save');
						setDecodeValue(save);
						onLoad({ value: save, source: 'example', isSubmit: false });
					}}
				/>
				<SaveDataButton
					title='Load Save Data'
					onClick={() => onLoad({ value: decodeValue, source: 'paste', isSubmit: true })}
				/>
			</div>
		</section>
	);
};
