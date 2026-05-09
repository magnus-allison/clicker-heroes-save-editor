'use client';

import { startTransition, useRef, useState } from 'react';

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

export const SaveDataPanel = () => {
	const inputRef = useRef<HTMLInputElement>(null);
	const { showToast } = useToast();
	const loadSave = useSaveStore((state) => state.loadSave);
	const saveData = useSaveStore((state) => state.saveData);
	const [selectedFileName, setSelectedFileName] = useState('Choose a save file...');
	const [decodeValue, setDecodeValue] = useState('');
	const [encodeValue, setEncodeValue] = useState('');

	const handleDecode = (nextValue = decodeValue) => {
		try {
			const decoded = decodeSaveString(nextValue);
			setEncodeValue('');
			startTransition(() => {
				loadSave(decoded.data);
			});
			showToast('Save data loaded.');
		} catch (error) {
			showToast(error instanceof Error ? error.message : 'Failed to decode save data.');
		}
	};

	return (
		<div className='grid w-full rounded-xl border border-(--color-border) bg-(--color-bg) shadow-[0_2px_8px_var(--color-shadow)] lg:grid-cols-2'>
			<section className='min-w-0'>
				<h2 className='border-b border-(--color-border-soft) bg-(--color-bg-elevated) px-3 py-2.5 text-[12px] uppercase tracking-[0.16em] text-(--color-text-strong) sm:px-4'>
					Import Save Data
				</h2>
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
							handleDecode(text);
						}}
						ref={inputRef}
						type='file'
					/>
					<div className='flex items-center gap-2'>
						<Button
							className='flex-1 justify-start bg-(--color-bg)'
							onClick={() => inputRef.current?.click()}
							variant='secondary'
						>
							<EditorImage
								alt=''
								className='h-4 w-4 shrink-0 object-contain opacity-80'
								size={16}
								src='/assets/icons/folder-open.svg'
								style={{ filter: 'var(--color-icon-filter)' }}
							/>
							<span className='truncate'>{selectedFileName}</span>
						</Button>
						<HelpToolTip title='Where is my save file?'>
							{saveHelpContent.map((entry) => (
								<div key={entry.title}>
									<p className='flex items-center gap-1.5 text-(--color-text)'>
										{entry.iconPaths.map((iconPath) => (
											<EditorImage
												alt=''
												className='h-3.5 w-3.5 object-contain opacity-70'
												key={iconPath}
												size={14}
												src={iconPath}
												style={{ filter: 'var(--color-icon-filter)' }}
											/>
										))}
										<strong>{entry.title}</strong>
									</p>
									<p className='mt-1 border border-(--color-border-soft) bg-(--color-bg) px-2 py-1 font-mono text-[11px] text-(--color-text-muted) break-all'>
										{entry.path}
									</p>
									{entry.note ? <p>{entry.note}</p> : null}
								</div>
							))}
						</HelpToolTip>
					</div>
					<p className='text-center text-[11px] uppercase tracking-[0.08em] text-(--color-text-dim)'>
						or paste below
					</p>
					<div className='flex min-w-0 items-start gap-2'>
						<TextInput
							className='h-[38px] min-h-[38px] min-w-0 flex-1'
							onValueChange={setDecodeValue}
							placeholder='Paste save data...'
							value={decodeValue}
						/>
						<CopyButton
							className='h-[38px] w-[38px] min-w-[38px] px-0'
							idleLabel='Copy'
							onCopied={() => showToast('Text copied.')}
							text={decodeValue}
						/>
					</div>
					<div className='flex flex-wrap gap-2'>
						<Button className='flex-1' onClick={() => handleDecode()} variant='primary'>
							Read Save Data
						</Button>
					</div>
					<ExampleSaveButtons
						onSelect={(save) => {
							setSelectedFileName('Example save');
							setDecodeValue(save);
							handleDecode(save);
						}}
					/>
				</div>
			</section>
			<section className='min-w-0 border-t border-(--color-border-soft) lg:border-l lg:border-t-0'>
				<h2 className='border-b border-(--color-border-soft) bg-(--color-bg-elevated) px-3 py-2.5 text-[12px] uppercase tracking-[0.16em] text-(--color-text-strong) sm:px-4'>
					Export Save Data
				</h2>
				<div className='flex flex-col gap-2.5 p-3 sm:p-4'>
					<div className='flex min-w-0 items-start gap-2'>
						<TextInput
							className='h-[38px] min-h-[38px] min-w-0 flex-1'
							placeholder='Encoded save...'
							readOnly
							selectOnFocus
							value={encodeValue}
						/>
						<CopyButton
							className='h-[38px] w-[38px] min-w-[38px] px-0'
							idleLabel='Copy'
							onCopied={() => showToast('Encoded save copied.')}
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
							}}
							variant='primary'
						>
							Encode Save
						</Button>
					</div>
					<p className='text-[12px] leading-6 text-(--color-text-secondary)'>
						Always keep a backup of your original save before importing edited data back into the
						game.
					</p>
				</div>
			</section>
		</div>
	);
};
