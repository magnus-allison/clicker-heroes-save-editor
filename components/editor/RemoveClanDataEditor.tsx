'use client';

import { useState } from 'react';

import posthog from 'posthog-js';
import { ArrowLeft } from 'lucide-react';

import { SaveDataPanel } from '@/components/editor/SaveDataPanel';
import { SectionHeading } from '@/components/home/SectionHeading';
import { Button } from '@/components/ui/Button';
import {
	EditorTable,
	EditorTableBody,
	EditorTableCell,
	EditorTableHead,
	EditorTableHeaderCell,
	EditorTableRow
} from '@/components/ui/EditorTable';
import { PanelSection } from '@/components/ui/PanelSection';
import { StepTitle } from '@/components/ui/StepTitle';
import { useToast } from '@/components/ui/ToastProvider';
import { clanFields, raidClassOptions } from '@/lib/data/editor-config';
import { useSaveStore } from '@/lib/save-store';
import { getValueAtPath, setValueAtPath, type PathSegment, type SaveData } from '@/lib/save-utils';

type RemovedClanEntry = {
	label: string;
	value: string;
};

/** The removed values, tied to the save they were taken from. */
type RemovedClanData = {
	source: SaveData | null;
	entries: RemovedClanEntry[];
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
	// Every clan field is wiped to 0, the raid class included (0 = None).
	value: 0,
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
	const [removedClanData, setRemovedClanData] = useState<RemovedClanData | null>(null);

	// Derived rather than reset in an effect: importing a save replaces
	// `originalSaveData`, which retires whatever the previous save gave up.
	const removedClanEntries =
		removedClanData && removedClanData.source === originalSaveData ? removedClanData.entries : null;

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
			wipeEntries.reduce((nextSave, field) => setValueAtPath(nextSave, field.path, field.value), current)
		);

		setRemovedClanData({ source: originalSaveData, entries: nextRemovedFields });
		showToast('Clan data removed from the save.');
		posthog.capture('clan_data_removed');
	};

	return (
		<>
			<SectionHeading
				back='/'
				description=''
				icon={<ArrowLeft aria-hidden='true' className='h-5 w-5' />}
				title='Tools · Remove Clan Data'
			/>

			<SaveDataPanel hasEditStep />

			<StepTitle step={2} title='Remove Clan Data From JSON' />
			<div
				className={!saveData ? 'pointer-events-none opacity-40 select-none' : undefined}
				// `inert` keeps the controls out of the tab order while the panel
				// only looks disabled.
				inert={!saveData}
			>
				<PanelSection>
					<div className='grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]'>
						<div className='flex flex-col gap-3'>
							<p className='text-[13px] leading-6 text-(--color-fg-secondary)'>
								This removes clan-related fields and clears the account/login fields from the loaded save JSON
								so the exported result is stripped down for a fresh rebuild.
							</p>
							<div className='flex flex-col gap-2'>
								<p className='text-[11px] uppercase tracking-[0.08em] text-(--color-fg-dim)'>
									What gets removed
								</p>
								<EditorTable label='Fields that get removed'>
									<EditorTableHead>
										<tr>
											<EditorTableHeaderCell>Field</EditorTableHeaderCell>
											<EditorTableHeaderCell>Current value</EditorTableHeaderCell>
										</tr>
									</EditorTableHead>
									<EditorTableBody>
										{wipeEntries.map((field) => {
											const currentValue = getValueAtPath(saveData, field.path);
											const displayValue = field.format
												? field.format(currentValue)
												: formatDisplayValue(currentValue);

											return (
												<EditorTableRow key={field.path.join('.')}>
													<EditorTableCell className='text-(--color-fg)'>{field.label}</EditorTableCell>
													<EditorTableCell className='wrap-break-word text-(--color-fg-dim)'>
														{displayValue}
													</EditorTableCell>
												</EditorTableRow>
											);
										})}
									</EditorTableBody>
								</EditorTable>
							</div>
							<div className='flex flex-wrap gap-2'>
								<Button className='flex-1' onClick={handleRemoveClanData} variant='primary'>
									Remove Clan Data
								</Button>
							</div>
						</div>

						<div className='flex flex-col gap-2'>
							<h3 className='text-[11px] uppercase tracking-[0.08em] text-(--color-fg-dim)'>
								Removed Clan Data
							</h3>
							{removedClanEntries ? (
								<EditorTable label='Removed clan data'>
									<EditorTableHead>
										<tr>
											<EditorTableHeaderCell>Field</EditorTableHeaderCell>
											<EditorTableHeaderCell>Removed value</EditorTableHeaderCell>
										</tr>
									</EditorTableHead>
									<EditorTableBody>
										{removedClanEntries.map((entry) => (
											<EditorTableRow key={entry.label}>
												<EditorTableCell className='text-(--color-fg)'>{entry.label}</EditorTableCell>
												<EditorTableCell className='wrap-break-word text-(--color-fg-dim)'>
													{entry.value}
												</EditorTableCell>
											</EditorTableRow>
										))}
									</EditorTableBody>
								</EditorTable>
							) : (
								<p className='text-[13px] leading-6 text-(--color-fg-secondary)'>
									Remove clan data from a loaded save to see the stripped values here.
								</p>
							)}
						</div>
					</div>
				</PanelSection>
			</div>
		</>
	);
};
