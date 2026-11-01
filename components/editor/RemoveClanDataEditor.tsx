'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { SaveDataPanel } from '@/components/editor/SaveDataPanel';
import { useEditorText } from '@/components/editor/useEditorText';
import { Breadcrumb } from '@/components/home/Breadcrumb';
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
	field: WipeFieldConfig;
	value: string;
};

/** The removed values, tied to the save they were taken from. */
type RemovedClanData = {
	source: SaveData | null;
	entries: RemovedClanEntry[];
};

/** Display text the formatters need, resolved in the current locale. */
type FormatText = {
	emptyString: string;
	raidClassLabel: (value: number) => string;
};

type WipeFieldConfig = {
	label: string;
	path: PathSegment[];
	value: unknown;
	/** Key under `editor.removeClanData.fields`; clan fields use `editor.fields` instead. */
	messageKey?: string;
	format?: (rawValue: unknown, text: FormatText) => string;
};

const wipeFields: WipeFieldConfig[] = [
	{ label: 'Email', messageKey: 'email', path: ['email'], value: '' },
	{ label: 'Password Hash', messageKey: 'passwordHash', path: ['passwordHash'], value: '' },
	{
		label: 'Previous Login Timestamp',
		messageKey: 'prevLoginTimestamp',
		path: ['prevLoginTimestamp'],
		value: null
	},
	{ label: 'Account', messageKey: 'account', path: ['account'], value: null },
	{ label: 'Account ID', messageKey: 'accountId', path: ['accountId'], value: 0 },
	{ label: 'Login Validated', messageKey: 'loginValidated', path: ['loginValidated'], value: 'false' },
	{ label: 'Unique ID', messageKey: 'uniqueId', path: ['uniqueId'], value: '' },
	{ label: 'Subscribed Email', messageKey: 'subscribedEmail', path: ['subscribedEmail'], value: '' },
	{ label: 'Type', messageKey: 'type', path: ['type'], value: undefined }
];

const wipeClanFields: WipeFieldConfig[] = clanFields.map((field) => ({
	label: field.label,
	path: field.path,
	// Every clan field is wiped to 0, the raid class included (0 = None).
	value: 0,
	format:
		field.path[0] === 'newClanRaidClassId'
			? (rawValue, text) => `${getRaidClassLabel(rawValue, text)} (${String(rawValue ?? 0)})`
			: undefined
}));

const wipeEntries = [...wipeClanFields, ...wipeFields];

const getRaidClassLabel = (value: unknown, text: FormatText) =>
	text.raidClassLabel(typeof value === 'number' ? value : Number(value ?? 0));

const formatDisplayValue = (value: unknown, text: FormatText) => {
	if (value === undefined) {
		return 'undefined';
	}

	if (value === null) {
		return 'null';
	}

	if (typeof value === 'string') {
		return value.length > 0 ? value : text.emptyString;
	}

	if (typeof value === 'object') {
		return JSON.stringify(value);
	}

	return String(value);
};

export const RemoveClanDataEditor = () => {
	const { showToast } = useToast();
	const t = useTranslations('editor.removeClanData');
	const tTable = useTranslations('editor.table');
	const { fieldLabel, fieldOptions } = useEditorText();
	const saveData = useSaveStore((state) => state.saveData);
	const originalSaveData = useSaveStore((state) => state.originalSaveData);
	const updateSave = useSaveStore((state) => state.updateSave);
	const [removedClanData, setRemovedClanData] = useState<RemovedClanData | null>(null);

	// Derived rather than reset in an effect: importing a save replaces
	// `originalSaveData`, which retires whatever the previous save gave up.
	const removedClanEntries =
		removedClanData && removedClanData.source === originalSaveData ? removedClanData.entries : null;

	const raidClassLabels = fieldOptions({ path: ['newClanRaidClassId'], options: raidClassOptions }) ?? [];
	const formatText: FormatText = {
		emptyString: t('emptyString'),
		raidClassLabel: (value) => raidClassLabels.find((option) => option.value === value)?.label ?? t('unknown')
	};
	const getFieldLabel = (field: WipeFieldConfig) =>
		field.messageKey
			? (t as unknown as (key: string) => string)(`fields.${field.messageKey}`)
			: fieldLabel(field);
	const formatField = (field: WipeFieldConfig, rawValue: unknown) =>
		field.format ? field.format(rawValue, formatText) : formatDisplayValue(rawValue, formatText);

	const handleRemoveClanData = () => {
		if (!saveData) {
			showToast(t('loadFirst'));
			return;
		}

		const nextRemovedFields = wipeEntries.map((field) => {
			const rawValue = getValueAtPath(saveData, field.path);

			return {
				field,
				value: formatField(field, rawValue)
			};
		});

		updateSave((current) =>
			wipeEntries.reduce((nextSave, field) => setValueAtPath(nextSave, field.path, field.value), current)
		);

		setRemovedClanData({ source: originalSaveData, entries: nextRemovedFields });
		showToast(t('removed'));
	};

	return (
		<>
			<Breadcrumb page='removeClanData' title='tools' />

			<SaveDataPanel hasEditStep />

			<StepTitle step={2} title={t('stepTitle')} />
			<div
				className={!saveData ? 'pointer-events-none opacity-40 select-none' : undefined}
				// `inert` keeps the controls out of the tab order while the panel
				// only looks disabled.
				inert={!saveData}
			>
				<PanelSection>
					<div className='grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]'>
						<div className='flex flex-col gap-3'>
							<p className='text-[13px] leading-6 text-(--color-fg-secondary)'>{t('intro')}</p>
							<div className='flex flex-col gap-2'>
								<p className='text-[11px] uppercase tracking-[0.08em] text-(--color-fg-dim)'>
									{t('whatGetsRemoved')}
								</p>
								<EditorTable label={t('tableLabel')}>
									<EditorTableHead>
										<tr>
											<EditorTableHeaderCell>{tTable('field')}</EditorTableHeaderCell>
											<EditorTableHeaderCell>{tTable('currentValue')}</EditorTableHeaderCell>
										</tr>
									</EditorTableHead>
									<EditorTableBody>
										{wipeEntries.map((field) => {
											const currentValue = getValueAtPath(saveData, field.path);
											const displayValue = formatField(field, currentValue);

											return (
												<EditorTableRow key={field.path.join('.')}>
													<EditorTableCell className='text-(--color-fg)'>
														{getFieldLabel(field)}
													</EditorTableCell>
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
									{t('action')}
								</Button>
							</div>
						</div>

						<div className='flex flex-col gap-2'>
							<h3 className='text-[11px] uppercase tracking-[0.08em] text-(--color-fg-dim)'>
								{t('removedTitle')}
							</h3>
							{removedClanEntries ? (
								<EditorTable label={t('removedTableLabel')}>
									<EditorTableHead>
										<tr>
											<EditorTableHeaderCell>{tTable('field')}</EditorTableHeaderCell>
											<EditorTableHeaderCell>{tTable('removedValue')}</EditorTableHeaderCell>
										</tr>
									</EditorTableHead>
									<EditorTableBody>
										{removedClanEntries.map((entry) => (
											<EditorTableRow key={entry.field.path.join('.')}>
												<EditorTableCell className='text-(--color-fg)'>
													{getFieldLabel(entry.field)}
												</EditorTableCell>
												<EditorTableCell className='wrap-break-word text-(--color-fg-dim)'>
													{entry.value}
												</EditorTableCell>
											</EditorTableRow>
										))}
									</EditorTableBody>
								</EditorTable>
							) : (
								<p className='text-[13px] leading-6 text-(--color-fg-secondary)'>{t('emptyState')}</p>
							)}
						</div>
					</div>
				</PanelSection>
			</div>
		</>
	);
};
