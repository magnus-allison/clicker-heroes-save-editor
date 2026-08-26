'use client';

import { useState } from 'react';

import posthog from 'posthog-js';

import { SaveExportField } from '@/components/editor/SaveExportField';
import { SaveImportField } from '@/components/editor/SaveImportField';
import { useSaveImport } from '@/components/editor/useSaveImport';
import { Dropdown } from '@/components/ui/Dropdown';
import { PanelSection } from '@/components/ui/PanelSection';
import { StepTitle } from '@/components/ui/StepTitle';
import { useToast } from '@/components/ui/ToastProvider';
import { saveConverterExamples } from '@/lib/data/example-saves';
import {
	encodeSaveData,
	getSaveDeviceFromFormat,
	type DecodeResult,
	type SaveDevice
} from '@/lib/save-codec';
import { useSaveStore } from '@/lib/save-store';
import type { SaveData, SelectOption } from '@/lib/save-utils';

/** What the import step detected about the save that is currently loaded. */
type LoadedSave = {
	device: SaveDevice | null;
	patchNumber: string;
};

const outputDeviceOptions = [
	{ label: 'PC', value: 'pc' },
	{ label: 'Mobile', value: 'mobile' }
] as const satisfies readonly SelectOption[];

/** The `<select>` hands back a plain string, so narrow it instead of asserting. */
const isSaveDevice = (value: string): value is SaveDevice =>
	outputDeviceOptions.some((option) => option.value === value);

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

const encodeConvertedSave = (source: SaveData, device: SaveDevice) => {
	const clone = structuredClone(source);
	clone.saveOrigin = device;
	return encodeSaveData(clone, device);
};

export const SaveConverterPanel = () => {
	const { showToast } = useToast();
	const saveData = useSaveStore((state) => state.saveData);
	const [loadedSave, setLoadedSave] = useState<LoadedSave | null>(null);
	const [outputDevice, setOutputDevice] = useState<SaveDevice>('pc');
	const [encodeValue, setEncodeValue] = useState('');

	const handleDecoded = (decoded: DecodeResult) => {
		const detectedDevice = getSaveDeviceFromFormat(decoded.format);

		// The point of the tool is the other device, so preselect it.
		setOutputDevice(detectedDevice === 'pc' ? 'mobile' : 'pc');
		setLoadedSave({
			device: detectedDevice,
			patchNumber: getPatchNumber(decoded.data)
		});
		// The old export belongs to the save that was just replaced.
		setEncodeValue('');
		posthog.capture('save_converter_decoded', {
			detected_device: detectedDevice ?? 'unknown'
		});
	};

	const importSave = useSaveImport({
		onDecoded: handleDecoded,
		onFailed: () => {
			setLoadedSave(null);
		}
	});

	// Converting deflates the whole save, so it only ever runs from this click —
	// never from an effect watching `saveData`.
	const handleEncode = () => {
		if (!saveData || !loadedSave) {
			showToast('Load a save before converting.');
			return;
		}

		try {
			setEncodeValue(encodeConvertedSave(saveData, outputDevice));
			showToast(`Save converted for ${formatDevice(outputDevice)}.`);
			posthog.capture('save_converted');
		} catch (error) {
			showToast(error instanceof Error ? error.message : 'Failed to convert save data.');
			posthog.captureException(error);
			posthog.capture('save_convert_failed', {
				error_message: error instanceof Error ? error.message : 'Unknown error'
			});
		}
	};

	return (
		<>
			<PanelSection className='grid lg:grid-cols-2'>
				<SaveImportField
					examples={saveConverterExamples}
					fileInputId='save-converter-file-input'
					isActiveStep={!loadedSave}
					onLoad={importSave}
				/>
				<SaveExportField
					actionLabel='Convert Save'
					ariaLabel='Converted save data to export'
					dataLabel='converted data'
					isActiveStep={Boolean(loadedSave) && encodeValue.length === 0}
					onAction={handleEncode}
					onValueChange={setEncodeValue}
					placeholder='Your converted save data will appear here...'
					title='Export Converted Save'
					value={encodeValue}
				/>
			</PanelSection>

			<StepTitle step={2} title='Converter Options' />
			<div
				className={!loadedSave ? 'pointer-events-none opacity-40 select-none' : undefined}
				// `inert` keeps the controls out of the tab order while the panel
				// only looks disabled.
				inert={!loadedSave}
			>
				<PanelSection>
					<div className='grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_minmax(220px,0.7fr)] md:items-end'>
						<div className='grid gap-3 sm:grid-cols-2'>
							<div className='rounded-(--radius-card) border border-(--color-line-soft) bg-(--color-surface) px-3 py-2.5 shadow-[var(--shadow-raised)]'>
								<p className='text-[11px] uppercase tracking-[0.08em] text-(--color-fg-dim)'>
									Detected origin
								</p>
								<p className='mt-1 text-[13px] font-semibold text-(--color-fg-strong)'>
									{formatDevice(loadedSave?.device ?? null)}
								</p>
							</div>
							<div className='rounded-(--radius-card) border border-(--color-line-soft) bg-(--color-surface) px-3 py-2.5 shadow-[var(--shadow-raised)]'>
								<p className='text-[11px] uppercase tracking-[0.08em] text-(--color-fg-dim)'>Patch number</p>
								<p className='mt-1 text-[13px] font-semibold text-(--color-fg-strong)'>
									{loadedSave?.patchNumber ?? 'n/a'}
								</p>
							</div>
						</div>
						<label className='grid gap-1.5'>
							<span className='text-[11px] uppercase tracking-[0.08em] text-(--color-fg-dim)'>
								Output device
							</span>
							<Dropdown
								onChange={(event) => {
									const nextDevice = event.target.value;
									if (!isSaveDevice(nextDevice)) {
										return;
									}

									setOutputDevice(nextDevice);
									// The exported string belongs to the previous device.
									setEncodeValue('');
								}}
								options={outputDeviceOptions}
								value={outputDevice}
							/>
						</label>
					</div>
				</PanelSection>
			</div>
		</>
	);
};
