'use client';

import { useEffect, useState } from 'react';

import posthog from 'posthog-js';

import { SaveDataPanel } from '@/components/editor/SaveDataPanel';
import { Button } from '@/components/ui/Button';
import { PanelSection } from '@/components/ui/PanelSection';
import { StepTitle } from '@/components/ui/StepTitle';
import { useToast } from '@/components/ui/ToastProvider';
import { clanFields, raidClassOptions } from '@/lib/data/editor-config';
import { useSaveStore } from '@/lib/save-store';
import { getValueAtPath, setValueAtPath, type PathSegment } from '@/lib/save-utils';

type RemovedClanEntry = {
	label: string;
	value: string;
};

type WipeFieldConfig = {
	label: string;
	path: PathSegment[];
	value: unknown;
	format?: (rawValue: unknown) => string;
};

const wipeFields: WipeFieldConfig[] = [
	{ label: 'Email', path: ['email'], value: '' },
	{ label: 'Password Hash', path: ['passwordHash'], value: '' },
	{ label: 'Previous Login Timestamp', path: ['prevLoginTimestamp'], value: null },
	{ label: 'Account', path: ['account'], value: null },
	{ label: 'Account ID', path: ['accountId'], value: 0 },
	{ label: 'Login Validated', path: ['loginValidated'], value: 'false' },
	{ label: 'Unique ID', path: ['uniqueId'], value: '' },
	{ label: 'Subscribed Email', path: ['subscribedEmail'], value: '' },
	{ label: 'Type', path: ['type'], value: undefined }
];

const wipeClanFields: WipeFieldConfig[] = clanFields.map((field) => ({
	label: field.label,
	path: field.path,
	value: field.path[0] === 'newClanRaidClassId' ? 0 : field.kind === 'select' ? 0 : 0,
	format:
		field.path[0] === 'newClanRaidClassId'
			? (rawValue) => `${getRaidClassLabel(rawValue)} (${String(rawValue ?? 0)})`
			: undefined
}));

const wipeEntries = [...wipeClanFields, ...wipeFields];

const getRaidClassLabel = (value: unknown) => {
	const numericValue = typeof value === 'number' ? value : Number(value ?? 0);
	return raidClassOptions.find((option) => option.value === numericValue)?.label ?? 'Unknown';
};

const formatDisplayValue = (value: unknown) => {
	if (value === undefined) {
		return 'undefined';
	}

	if (value === null) {
		return 'null';
	}

	if (typeof value === 'string') {
		return value.length > 0 ? value : '(empty string)';
	}

	if (typeof value === 'object') {
		return JSON.stringify(value);
	}

	return String(value);
};

export const RemoveClanDataEditor = () => {
	const { showToast } = useToast();
	const saveData = useSaveStore((state) => state.saveData);
	const originalSaveData = useSaveStore((state) => state.originalSaveData);
	const updateSave = useSaveStore((state) => state.updateSave);
	const [removedClanEntries, setRemovedClanEntries] = useState<RemovedClanEntry[] | null>(null);

	useEffect(() => {
		setRemovedClanEntries(null);
	}, [originalSaveData]);

	const handleRemoveClanData = () => {
		if (!saveData) {
			showToast('Load a save before removing clan data.');
			return;
		}

		const nextRemovedFields = wipeEntries.map((field) => {
			const rawValue = getValueAtPath(saveData, field.path);

			return {
				label: field.label,
				value: field.format ? field.format(rawValue) : formatDisplayValue(rawValue)
			};
		});

		updateSave((current) =>
			wipeEntries.reduce(
				(nextSave, field) => setValueAtPath(nextSave, field.path, field.value),
				current
			)
		);

		setRemovedClanEntries(nextRemovedFields);
		showToast('Clan data removed from the save.');
		posthog.capture('clan_data_removed');
	};

	return (
		<div className='flex min-h-screen w-full justify-center overflow-x-hidden p-10'>
			<main className='flex w-full max-w-6xl flex-col gap-3'>
				<header className='mb-4 flex flex-col gap-1.5'>
					<h1 className='text-[1.6rem] font-semibold leading-[1.2] text-(--color-text-strong)'>
						Remove Clan Data
					</h1>
					<p className='max-w-190 text-sm text-(--color-text-muted)'>
						Remove clan-specific information from your save data, review what was removed before
						exporting it again.
					</p>
				</header>

				<SaveDataPanel />

				<div className='ml-2'>
					<StepTitle step={2} title='Remove Clan Data From JSON' />
				</div>
				<PanelSection
					className={!saveData ? 'pointer-events-none opacity-40 select-none' : undefined}
				>
					<div className='grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]'>
						<div className='flex flex-col gap-3'>
							<p className='text-sm leading-6 text-(--color-text-secondary)'>
								This removes clan-related fields and clears the account/login fields from the
								loaded save JSON so the exported result is stripped down for a fresh rebuild.
							</p>
							<div className='rounded-2xl border border-(--color-border) bg-(--color-bg-soft) p-4'>
								<p className='text-[11px] uppercase tracking-[0.08em] text-(--color-text-dim)'>
									What gets removed
								</p>
								<ul className='mt-3 space-y-2 text-sm text-(--color-text-secondary)'>
									{wipeEntries.map((field) =>
										(() => {
											const currentValue = getValueAtPath(saveData, field.path);
											const displayValue = field.format
												? field.format(currentValue)
												: formatDisplayValue(currentValue);

											return (
												<li
													key={field.path.join('.')}
													className='flex items-center justify-between gap-3'
												>
													<span>{field.label}</span>
													<span className='max-w-[60%] truncate text-(--color-text-dim)'>
														{displayValue}
													</span>
												</li>
											);
										})()
									)}
								</ul>
							</div>
							<div className='flex flex-wrap gap-2'>
								<Button className='flex-1' onClick={handleRemoveClanData} variant='primary'>
									Remove Clan Data
								</Button>
							</div>
						</div>

						<div className='overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-bg-alt)'>
							<div className='border-b border-(--color-border-soft) bg-(--color-table-header) px-4 py-3'>
								<h3 className='text-[13px] font-semibold text-(--color-text-strong)'>
									Removed Clan Data
								</h3>
							</div>
							<div className='p-4'>
								{removedClanEntries ? (
									<div className='space-y-3'>
										{removedClanEntries.map((entry) => (
											<div
												className='rounded-xl border border-(--color-border-soft) bg-(--color-bg) px-3 py-2.5'
												key={entry.label}
											>
												<p className='text-[11px] uppercase tracking-[0.08em] text-(--color-text-dim)'>
													{entry.label}
												</p>
												<p className='mt-1 wrap-break-word text-[13px] text-(--color-text)'>
													{entry.value}
												</p>
											</div>
										))}
									</div>
								) : (
									<p className='text-sm leading-6 text-(--color-text-secondary)'>
										Remove clan data from a loaded save to see the stripped values here.
									</p>
								)}
							</div>
						</div>
					</div>
				</PanelSection>
			</main>
		</div>
	);
};
