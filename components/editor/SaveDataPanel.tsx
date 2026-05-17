'use client';

import { startTransition, useRef, useState } from 'react';

import posthog from 'posthog-js';

import { ExampleSaveButtons } from '@/components/editor/ExampleSaveButtons';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { EditorImage } from '@/components/ui/EditorImage';
import { HelpToolTip } from '@/components/ui/HelpToolTip';
import { TextInput } from '@/components/ui/TextInput';
import { useToast } from '@/components/ui/ToastProvider';
import { decodeSaveString, encodeSaveData } from '@/lib/save-codec';
import { saveHelpContent } from '@/lib/data/editor-config';
import { useSaveStore } from '@/lib/save-store';
import { StepTitle } from '../ui/StepTitle';
import { ExampleSave } from '@/lib/data/example-saves';

const iconAltLabels: Record<string, string> = {
	'/assets/icons/apple.svg': 'Apple',
	'/assets/icons/folder-open.svg': 'Open folder',
	'/assets/icons/steam.svg': 'Steam',
	'/assets/icons/windows.svg': 'Windows'
};

const getIconAlt = (iconPath: string) => `${iconAltLabels[iconPath] ?? 'Platform'} icon`;

interface Props {
	onLoadSuccess?: () => void;
	examples?: ExampleSave[];
}

export const SaveDataPanel = ({ onLoadSuccess, examples }: Props) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const { showToast } = useToast();
	const loadSave = useSaveStore((state) => state.loadSave);
	const saveData = useSaveStore((state) => state.saveData);
	const [selectedFileName, setSelectedFileName] = useState('No file selected');
	const [decodeValue, setDecodeValue] = useState('');
	const [encodeValue, setEncodeValue] = useState('');

	const handleDecode = (
		nextValue = decodeValue,
		source: 'paste' | 'file' | 'example' = 'paste',
		shouldScroll = false
	) => {
		try {
			const decoded = decodeSaveString(nextValue);
			setEncodeValue('');
			startTransition(() => {
				loadSave(decoded.data);
			});
			showToast('Save data loaded.');
			if (shouldScroll && onLoadSuccess) {
				onLoadSuccess();
			}
			posthog.capture('save_decoded', { source });
		} catch (error) {
			showToast(error instanceof Error ? error.message : 'Failed to decode save data.');
			posthog.captureException(error, { properties: { source } });
			posthog.capture('save_decode_failed', {
				source,
				error_message: error instanceof Error ? error.message : 'Unknown error'
			});
		}
	};

	return (
		<div className='grid w-full overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-bg) shadow-[0_2px_8px_var(--color-shadow)] lg:grid-cols-2 px-1 py-2'>
			<section className='min-w-0'>
				<StepTitle
					step={1}
					title='Import Your Save Data'
					trailing={
						<HelpToolTip
							title='Where is my save file?'
							contentClassName='w-[min(620px,calc(100vw-2rem))] gap-2 rounded-xl border border-(--color-border) bg-(--color-bg-alt) p-3 shadow-[0_2px_8px_var(--color-shadow)] pointer-events-auto'
							triggerClassName='h-7 min-h-7 w-7 min-w-7 self-auto rounded-full'
							titleClassName='border-b-0 pb-0'
						>
							{saveHelpContent.map((entry) => (
								<div
									className='border-t border-(--color-border-soft) py-2.5 first:border-t-0'
									key={entry.title}
								>
									<p className='flex items-center gap-1.5 text-[12px] uppercase tracking-[0.08em] text-(--color-text-strong)'>
										{entry.iconPaths.map((iconPath) => (
											<EditorImage
												alt={getIconAlt(iconPath)}
												className='h-3.5 w-3.5 object-contain opacity-80'
												key={iconPath}
												size={14}
												src={iconPath}
												style={{ filter: 'var(--color-icon-filter)' }}
											/>
										))}
										<span>{entry.title}</span>
									</p>
									<p className='mt-1 rounded-(--input-radius) border border-(--color-border-soft) bg-(--color-bg) px-2 py-1 font-mono text-[11px] text-(--color-text-muted) break-all'>
										{entry.path}
									</p>
									{entry.note ? (
										<p className='mt-1 text-[11px] leading-5 text-(--color-text-secondary)'>
											{entry.note}
										</p>
									) : null}
								</div>
							))}
						</HelpToolTip>
					}
				/>
				<div className='flex flex-col gap-2.5 p-3 sm:p-4'>
					<input
						aria-label='Choose save file'
						className='hidden'
						id='save-file-input'
						name='saveFile'
						onChange={async (event) => {
							const file = event.target.files?.[0];
							if (!file) {
								return;
							}

							const text = await file.text();
							setSelectedFileName(file.name);
							setDecodeValue(text);
							posthog.capture('save_file_uploaded', { file_name: file.name });
							handleDecode(text, 'file');
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
						<p className='max-w-full truncate text-[12px] text-(--color-text-muted)'>
							{selectedFileName}
						</p>
					</div>
					<p className='text-left text-[11px] uppercase tracking-wider text-(--color-text-dim) ml-2 py-2'>
						-- or paste below --
					</p>
					<div className='flex min-w-0 items-start gap-2'>
						<textarea
							className='min-h-32 w-full resize-y rounded-xl border border-(--color-border) bg-(--color-bg) p-3 text-sm font-mono text-(--color-text) focus-visible:outline-none sm:p-4'
							placeholder='Paste your encoded save data here...'
							value={decodeValue}
							onChange={(e) => setDecodeValue(e.target.value)}
							onPaste={(e) => {
								const pastedData = e.clipboardData.getData('text');
								if (pastedData) {
									handleDecode(pastedData, 'paste');
								}
							}}
						/>
						<CopyButton
							className='min-w-10 px-0'
							idleLabel='Copy'
							onCopied={() => showToast('Text copied.')}
							text={decodeValue}
						/>
					</div>
					<div className='flex flex-wrap gap-2'>
						<Button
							className='flex-1'
							onClick={() => handleDecode(decodeValue, 'paste', true)}
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
							handleDecode(save, 'example');
						}}
					/>
				</div>
			</section>
			<section className='flex min-w-0 flex-col border-t border-(--color-border-soft) lg:border-l lg:border-t-0 px-1'>
				<StepTitle title='Export Your Save Data' step={3} />
				<div className='flex flex-1 flex-col gap-2.5 p-3 sm:p-4'>
					<div className='flex min-w-0 items-start gap-2'>
						<textarea
							className='min-h-32 w-full resize-y rounded-xl border border-(--color-border) bg-(--color-bg) p-3 text-sm font-mono text-(--color-text) focus-visible:outline-none sm:p-4'
							placeholder='Your encoded save data will appear here...'
							value={encodeValue}
							onChange={(e) => setEncodeValue(e.target.value)}
						/>
						<CopyButton
							className='min-w-10 px-0'
							idleLabel='Copy'
							onCopied={() => showToast('Text copied.')}
							text={encodeValue}
						/>
					</div>
					<div className='flex flex-wrap gap-2'>
						<Button
							className='flex-1'
							onClick={() => {
								if (!saveData) {
									showToast('Load a save before encoding.');
									return;
								}

								const nextValue = encodeSaveData(saveData);
								setEncodeValue(nextValue);
								showToast('Save encoded.');
								posthog.capture('save_encoded');
							}}
							variant='primary'
						>
							Encode Save
						</Button>
					</div>
					<p className='mt-auto pt-2 pb-1 text-sm leading-6 text-[11px] tracking-wider text-(--color-text-dim)'>
						Always keep a backup of your original save before importing edited data back into the
						game.
					</p>
				</div>
			</section>
		</div>
	);
};
