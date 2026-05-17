'use client';

import { startTransition, useCallback, useEffect, useRef, useState } from 'react';

import posthog from 'posthog-js';

import { ExampleSaveButtons } from '@/components/editor/ExampleSaveButtons';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Dropdown } from '@/components/ui/Dropdown';
import { EditorImage } from '@/components/ui/EditorImage';
import { HelpToolTip } from '@/components/ui/HelpToolTip';
import { PanelSection } from '@/components/ui/PanelSection';
import { StepTitle } from '@/components/ui/StepTitle';
import { useToast } from '@/components/ui/ToastProvider';
import { saveHelpContent } from '@/lib/data/editor-config';
import { saveConverterExamples } from '@/lib/data/example-saves';
import {
	decodeSaveString,
	encodeSaveData,
	getSaveDeviceFromFormat,
	type DecodeResult,
	type SaveDevice
} from '@/lib/save-codec';
import { useSaveStore } from '@/lib/save-store';
import type { SaveData, SelectOption } from '@/lib/save-utils';

type LoadedSave = {
	data: SaveData;
	device: SaveDevice | null;
	patchNumber: string;
};

const iconAltLabels: Record<string, string> = {
	'/assets/icons/apple.svg': 'Apple',
	'/assets/icons/folder-open.svg': 'Open folder',
	'/assets/icons/steam.svg': 'Steam',
	'/assets/icons/windows.svg': 'Windows'
};

const outputDeviceOptions: readonly SelectOption[] = [
	{ label: 'PC', value: 'pc' },
	{ label: 'Mobile', value: 'mobile' }
];

const getIconAlt = (iconPath: string) => `${iconAltLabels[iconPath] ?? 'Platform'} icon`;

const formatDevice = (device: SaveDevice | null) => {
	if (device === 'pc') {
		return 'PC';
	}

	if (device === 'mobile') {
		return 'Mobile';
	}

	return 'unknown';
};

const getPatchNumber = (data: SaveData) => {
	const patchNumber = data.readPatchNumber;

	if (patchNumber === undefined || patchNumber === null || patchNumber === '') {
		return 'n/a';
	}

	return String(patchNumber);
};

const prepareForDevice = (source: SaveData, device: SaveDevice) => {
	const clone = structuredClone(source);
	clone.saveOrigin = device;
	return clone;
};

export const SaveConverterPanel = () => {
	const inputRef = useRef<HTMLInputElement>(null);
	const { showToast } = useToast();
	const loadSave = useSaveStore((state) => state.loadSave);
	const saveData = useSaveStore((state) => state.saveData);
	const [loadedSave, setLoadedSave] = useState<LoadedSave | null>(null);
	const [outputDevice, setOutputDevice] = useState<SaveDevice>('pc');
	const [selectedFileName, setSelectedFileName] = useState('No file selected');
	const [decodeValue, setDecodeValue] = useState('');
	const [encodeValue, setEncodeValue] = useState('');

	const encodeConvertedSave = useCallback(
		(nextSaveData: SaveData, device: SaveDevice) =>
			encodeSaveData(prepareForDevice(nextSaveData, device), device),
		[]
	);

	const handleDecodeSuccess = (decoded: DecodeResult) => {
		const detectedDevice = getSaveDeviceFromFormat(decoded.format);
		const nextOutputDevice = detectedDevice === 'pc' ? 'mobile' : 'pc';

		setLoadedSave({
			data: decoded.data,
			device: detectedDevice,
			patchNumber: getPatchNumber(decoded.data)
		});
		setOutputDevice(nextOutputDevice);
		posthog.capture('save_converter_decoded', {
			detected_device: detectedDevice ?? 'unknown'
		});
	};

	useEffect(() => {
		setEncodeValue('');
		if (!saveData || !loadedSave) {
			return;
		}

		setEncodeValue(encodeConvertedSave(saveData, outputDevice));
	}, [encodeConvertedSave, loadedSave, outputDevice, saveData]);

	const handleDecode = (nextValue = decodeValue, source: 'paste' | 'file' | 'example' = 'paste') => {
		try {
			const decoded = decodeSaveString(nextValue);
			setEncodeValue('');
			startTransition(() => {
				loadSave(decoded.data);
			});
			handleDecodeSuccess(decoded);
			showToast('Save data loaded.');
			posthog.capture('save_decoded', { source });
		} catch (error) {
			setLoadedSave(null);
			showToast(error instanceof Error ? error.message : 'Failed to decode save data.');
			posthog.captureException(error, { properties: { source } });
			posthog.capture('save_decode_failed', {
				source,
				error_message: error instanceof Error ? error.message : 'Unknown error'
			});
		}
	};

	const handleEncode = () => {
		if (!saveData || !loadedSave) {
			showToast('Load a save before converting.');
			return;
		}

		const nextValue = encodeConvertedSave(saveData, outputDevice);
		setEncodeValue(nextValue);
		showToast(`Save converted for ${formatDevice(outputDevice)}.`);
		posthog.capture('save_converted');
	};

	return (
		<>
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
							id='save-converter-file-input'
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
								onChange={(event) => setDecodeValue(event.target.value)}
								onPaste={(event) => {
									const pastedData = event.clipboardData.getData('text');
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
								onClick={() => handleDecode(decodeValue, 'paste')}
								variant='primary'
							>
								Load Save Data
							</Button>
						</div>
						<ExampleSaveButtons
							customExamples={saveConverterExamples}
							onSelect={(save) => {
								setSelectedFileName('Example save');
								setDecodeValue(save);
								handleDecode(save, 'example');
							}}
						/>
					</div>
				</section>
				<section className='flex min-w-0 flex-col border-t border-(--color-border-soft) lg:border-l lg:border-t-0 px-1'>
					<StepTitle step={3} title='Export Converted Save' />
					<div className='flex flex-1 flex-col gap-2.5 p-3 sm:p-4'>
						<div className='flex min-w-0 items-start gap-2'>
							<textarea
								className='min-h-32 w-full resize-y rounded-xl border border-(--color-border) bg-(--color-bg) p-3 text-sm font-mono text-(--color-text) focus-visible:outline-none sm:p-4'
								placeholder='Your converted save data will appear here...'
								value={encodeValue}
								onChange={(event) => setEncodeValue(event.target.value)}
							/>
							<CopyButton
								className='min-w-10 px-0'
								idleLabel='Copy'
								onCopied={() => showToast('Text copied.')}
								text={encodeValue}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<Button className='flex-1' onClick={handleEncode} variant='primary'>
								Convert Save
							</Button>
						</div>
						<p className='mt-auto pt-2 pb-1 text-sm leading-6 text-[11px] tracking-wider text-(--color-text-dim)'>
							Always keep a backup of your original save before importing converted data back
							into the game.
						</p>
					</div>
				</section>
			</div>

			<div className='ml-2'>
				<StepTitle step={2} title='Converter Options' />
			</div>
			<PanelSection className={!loadedSave ? 'pointer-events-none opacity-40 select-none' : undefined}>
				<div className='grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_minmax(220px,0.7fr)] md:items-end'>
					<div className='grid gap-3 sm:grid-cols-2'>
						<div className='rounded-xl border border-(--color-border-soft) bg-(--color-bg) px-3 py-2.5'>
							<p className='text-[11px] uppercase tracking-[0.08em] text-(--color-text-dim)'>
								Detected origin
							</p>
							<p className='mt-1 text-sm font-semibold text-(--color-text-strong)'>
								{formatDevice(loadedSave?.device ?? null)}
							</p>
						</div>
						<div className='rounded-xl border border-(--color-border-soft) bg-(--color-bg) px-3 py-2.5'>
							<p className='text-[11px] uppercase tracking-[0.08em] text-(--color-text-dim)'>
								Patch number
							</p>
							<p className='mt-1 text-sm font-semibold text-(--color-text-strong)'>
								{loadedSave?.patchNumber ?? 'n/a'}
							</p>
						</div>
					</div>
					<label className='grid gap-1.5'>
						<span className='text-[11px] uppercase tracking-[0.08em] text-(--color-text-dim)'>
							Output device
						</span>
						<Dropdown
							onChange={(event) => {
								const nextDevice = event.target.value as SaveDevice;
								setOutputDevice(nextDevice);
							}}
							options={outputDeviceOptions}
							value={outputDevice}
						/>
					</label>
				</div>
			</PanelSection>
		</>
	);
};
