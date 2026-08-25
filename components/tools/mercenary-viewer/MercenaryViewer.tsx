'use client';

import { useMemo, type ReactNode } from 'react';

import { SaveDataPanel } from '@/components/editor/SaveDataPanel';
import { Breadcrumb, homeCrumb } from '@/components/home/Breadcrumb';
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
import { cn } from '@/lib/cn';
import { mercenarySummaryFields } from '@/lib/data/editor-config';
import { mercenaryExamples } from '@/lib/data/example-saves';
import { formatDecimal, formatDurationSeconds, formatNumber, toFiniteNumber } from '@/lib/format';
import { useSaveStore } from '@/lib/save-store';
import { getValueAtPath, type PathSegment } from '@/lib/save-utils';

type MercenaryRecord = Record<string, unknown>;

type MercenaryEntry = {
	/** Slot index the save stores the mercenary under. */
	index: number;
	data: MercenaryRecord;
};

type SummaryField = {
	label: string;
	path: PathSegment[];
};

/** Shown wherever a save has no value for a field, so blanks stay legible. */
const EMPTY_VALUE = '—';

/**
 * Roster-wide counters live at the top level of the save rather than in the
 * `mercenaries` container, so they are listed here and read by path like the
 * quest totals the editor already knows about.
 */
const rosterFields: SummaryField[] = [
	{ label: 'Mercenary Count', path: ['mercenaryCount'] },
	{ label: 'Highest Mercenary Level Ever', path: ['highestMercenaryLevelEver'] }
];

const summaryFields: SummaryField[] = [
	...rosterFields,
	...mercenarySummaryFields.map((field) => ({ label: field.label, path: field.path }))
];

const isRecord = (value: unknown): value is MercenaryRecord =>
	Boolean(value) && typeof value === 'object' && !Array.isArray(value);

/**
 * The save stores the roster as an object keyed by slot ("0".."4"), but older
 * saves and some converters emit a plain array, so both shapes are accepted.
 */
const toMercenaryEntries = (value: unknown): MercenaryEntry[] => {
	if (Array.isArray(value)) {
		return value
			.map((entry, index) => (isRecord(entry) ? { index, data: entry } : null))
			.filter((entry): entry is MercenaryEntry => Boolean(entry));
	}

	if (!isRecord(value)) {
		return [];
	}

	return Object.entries(value)
		.map(([key, entry], fallbackIndex) => {
			if (!isRecord(entry)) {
				return null;
			}

			const numericIndex = Number(key);
			return {
				index: Number.isFinite(numericIndex) ? numericIndex : fallbackIndex,
				data: entry
			};
		})
		.filter((entry): entry is MercenaryEntry => Boolean(entry))
		.sort((left, right) => left.index - right.index);
};

const formatCount = (value: unknown) => (value == null ? EMPTY_VALUE : formatNumber(value));

const formatName = (value: unknown) => {
	const name = typeof value === 'string' ? value.trim() : '';
	return name || EMPTY_VALUE;
};

const formatDuration = (value: unknown) => {
	const seconds = toFiniteNumber(value);
	return seconds === null ? EMPTY_VALUE : formatDurationSeconds(seconds);
};

/** Save fields such as experience and success chance are 0–1 fractions. */
const formatFraction = (value: unknown) => {
	const fraction = toFiniteNumber(value);
	return fraction === null ? EMPTY_VALUE : `${formatDecimal(fraction * 100)}%`;
};

type RosterColumn = {
	/** Doubles as the React key, so it must be unique within the table. */
	label: string;
	widthClassName: string;
	align?: 'left' | 'right';
	cellClassName?: string;
	render: (entry: MercenaryEntry) => ReactNode;
};

const rosterColumns: readonly RosterColumn[] = [
	{
		label: 'Slot',
		widthClassName: 'w-16',
		cellClassName: 'font-mono text-(--color-fg)',
		render: (entry) => entry.index + 1
	},
	{
		label: 'Name',
		widthClassName: 'w-44',
		cellClassName: 'text-(--color-fg)',
		render: (entry) => formatName(entry.data.name)
	},
	{
		label: 'Level',
		widthClassName: 'w-24',
		align: 'right',
		render: (entry) => formatCount(entry.data.level)
	},
	{
		label: 'Experience',
		widthClassName: 'w-28',
		align: 'right',
		render: (entry) => formatFraction(entry.data.experience)
	},
	{
		label: 'Time to Die',
		widthClassName: 'w-32',
		render: (entry) => formatDuration(entry.data.timeToDie)
	},
	{
		label: 'Bonus Lives',
		widthClassName: 'w-28',
		align: 'right',
		render: (entry) => formatCount(entry.data.bonusLives)
	},
	{
		label: 'Last Quest',
		widthClassName: 'w-32',
		render: (entry) => formatDuration(entry.data.lastQuestDuration)
	},
	{
		label: 'Success Chance',
		widthClassName: 'w-32',
		align: 'right',
		render: (entry) => formatFraction(entry.data.lastQuestSuccessChance)
	}
];

export const MercenaryViewer = () => {
	const saveData = useSaveStore((state) => state.saveData);
	const mercenaries = useMemo(
		() => toMercenaryEntries(getValueAtPath(saveData, ['mercenaries', 'mercenaries'])),
		[saveData]
	);

	return (
		<>
			<Breadcrumb items={[homeCrumb, { label: 'Tools' }, { label: 'Mercenary Viewer' }]} />

			<SaveDataPanel examples={mercenaryExamples} />

			<StepTitle step={2} title='Mercenary Roster' />
			<PanelSection>
				<div className='grid gap-4 p-4'>
					<EditorTable
						className='border-(--color-line-subtle)'
						label='Mercenary roster'
						tableClassName='w-full table-fixed'
					>
						<colgroup>
							{rosterColumns.map((column) => (
								<col className={column.widthClassName} key={column.label} />
							))}
						</colgroup>
						<EditorTableHead>
							<tr>
								{rosterColumns.map((column) => (
									<EditorTableHeaderCell
										className={column.align === 'right' ? 'text-right' : undefined}
										key={column.label}
									>
										{column.label}
									</EditorTableHeaderCell>
								))}
							</tr>
						</EditorTableHead>
						<EditorTableBody>
							{mercenaries.length > 0 ? (
								mercenaries.map((entry) => (
									<EditorTableRow key={entry.index}>
										{rosterColumns.map((column) => (
											<EditorTableCell
												className={cn(
													column.align === 'right' && 'text-right tabular-nums',
													column.cellClassName
												)}
												key={column.label}
											>
												{column.render(entry)}
											</EditorTableCell>
										))}
									</EditorTableRow>
								))
							) : (
								<EditorTableRow>
									<EditorTableCell
										className='py-6 text-center text-(--color-fg-muted)'
										colSpan={rosterColumns.length}
									>
										Load a save with mercenaries to see the roster here.
									</EditorTableCell>
								</EditorTableRow>
							)}
						</EditorTableBody>
					</EditorTable>
				</div>
			</PanelSection>

			<StepTitle step={3} title='Mercenary Summary' />
			<PanelSection>
				<div className='grid gap-4 p-4'>
					<EditorTable
						className='border-(--color-line-subtle)'
						label='Mercenary summary'
						tableClassName='w-full table-fixed'
					>
						<colgroup>
							<col className='w-1/2' />
							<col className='w-1/2' />
						</colgroup>
						<EditorTableBody>
							{summaryFields.map((field) => (
								<EditorTableRow key={field.path.join('.')}>
									<EditorTableCell className='text-(--color-fg)'>{field.label}</EditorTableCell>
									<EditorTableCell className='text-right tabular-nums'>
										{formatCount(getValueAtPath(saveData, field.path))}
									</EditorTableCell>
								</EditorTableRow>
							))}
						</EditorTableBody>
					</EditorTable>
				</div>
			</PanelSection>
		</>
	);
};
