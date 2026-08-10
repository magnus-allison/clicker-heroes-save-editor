'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';

import { SectionHeading } from '@/components/home/SectionHeading';
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
import { SaveDataPanel } from '@/components/editor/SaveDataPanel';
import { cn } from '@/lib/cn';
import {
	formatDurationMinutes,
	formatDurationSeconds,
	formatLargeNumber,
	formatNumber,
	log10OfSaveValue
} from '@/lib/format';
import { useSaveStore } from '@/lib/save-store';
import { getValueAtPath } from '@/lib/save-utils';
import { transcensionExamples } from '@/lib/data/example-saves';

type SaveRecord = Record<string, unknown>;

type HistoryEntry = {
	index: number;
	data: SaveRecord;
};

type FieldMatch = {
	key: string;
	value: unknown;
};

const fieldAliases = {
	duration: ['duration', 'time', 'timePlayed', 'seconds', 'elapsedSeconds', 'durationSeconds'],
	highestZone: ['highestZone', 'highestZoneEver', 'highestZoneThisTranscension', 'hze', 'zone'],
	heroSouls: ['heroSouls', 'heroSoulsSacrificed', 'heroSoulsGained', 'hs', 'souls'],
	ancientSouls: [
		'ancientSouls',
		'ancientSoulsGained',
		'ancientSoulsTotal',
		'ancientSoulsEarned',
		'ancientSoulsAfterTranscension',
		'totalAncientSouls',
		'as'
	],
	ascensionCount: ['numAscensions', 'ascensionCount'],
	ascensionHistory: ['ascensions', 'ascensionLog', 'ascensionHistory']
} as const;

const normalizeKey = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

const getFirstMatch = (entry: SaveRecord, aliases: readonly string[]): FieldMatch | undefined => {
	const normalizedAliases = aliases.map(normalizeKey);
	const entries = Object.entries(entry);
	const exactMatch = normalizedAliases
		.map((alias) => entries.find(([key, value]) => value !== undefined && normalizeKey(key) === alias))
		.find((match) => match !== undefined);

	if (exactMatch) {
		return { key: exactMatch[0], value: exactMatch[1] };
	}

	return entries
		.filter(([, value]) => value !== undefined)
		.map(([key, value]) => ({ key, normalizedKey: normalizeKey(key), value }))
		.find(({ normalizedKey }) =>
			normalizedAliases.some(
				(alias) => alias.length > 2 && (normalizedKey.includes(alias) || alias.includes(normalizedKey))
			)
		);
};

const getFirstValue = (entry: SaveRecord, aliases: readonly string[]) => getFirstMatch(entry, aliases)?.value;

const getHistoryValue = (entry: SaveRecord, aliases: readonly string[]) => {
	const normalizedAliases = aliases.map(normalizeKey);

	return normalizedAliases
		.map((alias) =>
			Object.entries(entry).find(
				([key, value]) =>
					value !== undefined && (Array.isArray(value) || isRecord(value)) && normalizeKey(key) === alias
			)
		)
		.find((match) => match !== undefined)?.[1];
};

const isRecord = (value: unknown): value is SaveRecord =>
	Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const toHistoryEntries = (value: unknown): HistoryEntry[] => {
	if (Array.isArray(value)) {
		return value
			.map((entry, index) => (isRecord(entry) ? { index, data: entry } : null))
			.filter((entry): entry is HistoryEntry => Boolean(entry));
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
		.filter((entry): entry is HistoryEntry => Boolean(entry))
		.sort((left, right) => left.index - right.index);
};

/**
 * Saves are inconsistent about the unit a duration field is in, so the matched
 * key decides whether we read seconds or minutes. The formatting itself is
 * shared.
 */
const formatDuration = (match: FieldMatch | undefined) => {
	const value = match?.value;

	// A non-numeric string is shown verbatim rather than as `0m`.
	if (typeof value === 'string' && value.trim() && !Number.isFinite(Number(value))) {
		return value;
	}

	const numericValue = typeof value === 'number' ? value : Number(value ?? 0);

	return normalizeKey(match?.key ?? '').includes('second')
		? formatDurationSeconds(numericValue)
		: formatDurationMinutes(numericValue);
};

const getDurationLabel = (entry: SaveRecord) => {
	const startTime = Number(entry.startTime);
	const endTime = Number(entry.endTime);

	if (Number.isFinite(startTime) && Number.isFinite(endTime)) {
		return formatDurationMinutes((endTime - startTime) / 60000);
	}

	return formatDuration(getFirstMatch(entry, fieldAliases.duration));
};

/** Every save field here is optional, and a missing field reads as zero. */
const formatSaveNumber = (value: unknown) => formatLargeNumber(value ?? 0);

const getAncientSoulsLabel = (entry: SaveRecord) => {
	const heroSoulsGained = getFirstValue(entry, fieldAliases.heroSouls);
	const log10HeroSouls = log10OfSaveValue(heroSoulsGained);

	if (log10HeroSouls == null) {
		return formatSaveNumber(getFirstValue(entry, fieldAliases.ancientSouls));
	}

	return formatNumber(Math.floor(log10HeroSouls * 5));
};

const getAscensions = (transcension: SaveRecord) =>
	toHistoryEntries(getHistoryValue(transcension, fieldAliases.ascensionHistory));

const getAscensionCount = (transcension: SaveRecord) => {
	const ascensionValue = getFirstValue(transcension, fieldAliases.ascensionCount);
	if (typeof ascensionValue === 'number' || typeof ascensionValue === 'string') {
		return formatSaveNumber(ascensionValue);
	}

	return formatNumber(getAscensions(transcension).length);
};

const getEntryNumberLabel = (entry: HistoryEntry) => {
	const id = entry.data.id;
	return typeof id === 'number' || typeof id === 'string' ? String(id) : String(entry.index);
};

type HistoryColumn = {
	/** Doubles as the React key, so it must be unique within a table. */
	label: string;
	widthClassName: string;
	align?: 'left' | 'right';
	cellClassName?: string;
	render: (entry: HistoryEntry) => ReactNode;
};

type HistorySelection = {
	selectedIndex: number | undefined;
	onSelect: (index: number) => void;
	/** Accessible name for the per-row select button. */
	getSelectLabel: (entry: HistoryEntry) => string;
};

type HistoryTableProps = {
	columns: readonly HistoryColumn[];
	emptyMessage: string;
	entries: readonly HistoryEntry[];
	label: string;
	/** Omit to render a read-only table. */
	selection?: HistorySelection;
};

/**
 * The transcension and ascension tables are the same table with different
 * columns; the only structural difference is that one of them is selectable.
 */
const HistoryTable = ({ columns, emptyMessage, entries, label, selection }: HistoryTableProps) => (
	<div className='grid gap-4 p-4'>
		<EditorTable className='border-(--color-line-subtle)' label={label} tableClassName='w-full table-fixed'>
			<colgroup>
				{columns.map((column) => (
					<col className={column.widthClassName} key={column.label} />
				))}
			</colgroup>
			<EditorTableHead>
				<tr>
					{columns.map((column) => (
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
				{entries.length > 0 ? (
					entries.map((entry) => {
						const isSelected = entry.index === selection?.selectedIndex;

						return (
							<EditorTableRow
								className={cn(
									selection && 'cursor-pointer',
									isSelected && 'bg-(--color-primary-soft) text-(--color-fg)'
								)}
								key={entry.index}
								onClick={selection ? () => selection.onSelect(entry.index) : undefined}
							>
								{columns.map((column, columnIndex) => (
									<EditorTableCell
										className={cn(
											column.align === 'right' && 'text-right tabular-nums',
											column.cellClassName
										)}
										key={column.label}
									>
										{/* The first cell carries the keyboard-reachable
										    control that selects the row. */}
										{selection && columnIndex === 0 ? (
											<button
												aria-label={selection.getSelectLabel(entry)}
												aria-pressed={isSelected}
												className='rounded-(--radius-control) underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)'
												onClick={() => selection.onSelect(entry.index)}
												type='button'
											>
												{column.render(entry)}
											</button>
										) : (
											column.render(entry)
										)}
									</EditorTableCell>
								))}
							</EditorTableRow>
						);
					})
				) : (
					<EditorTableRow>
						<EditorTableCell className='py-6 text-center text-(--color-fg-muted)' colSpan={columns.length}>
							{emptyMessage}
						</EditorTableCell>
					</EditorTableRow>
				)}
			</EditorTableBody>
		</EditorTable>
	</div>
);

const numberColumn = (label: string, widthClassName: string, aliases: readonly string[]): HistoryColumn => ({
	label,
	widthClassName,
	align: 'right',
	render: (entry) => formatSaveNumber(getFirstValue(entry.data, aliases))
});

const entryNumberColumn: HistoryColumn = {
	label: 'No.',
	widthClassName: 'w-16',
	cellClassName: 'font-mono text-(--color-fg)',
	render: getEntryNumberLabel
};

const durationColumn: HistoryColumn = {
	label: 'Duration',
	widthClassName: 'w-32',
	render: (entry) => getDurationLabel(entry.data)
};

const transcensionColumns: readonly HistoryColumn[] = [
	entryNumberColumn,
	durationColumn,
	{
		label: 'Ascensions',
		widthClassName: 'w-28',
		align: 'right',
		render: (entry) => getAscensionCount(entry.data)
	},
	numberColumn('HZE', 'w-24', fieldAliases.highestZone),
	numberColumn('HS', 'w-32', fieldAliases.heroSouls),
	{
		label: 'AS',
		widthClassName: 'w-24',
		align: 'right',
		render: (entry) => getAncientSoulsLabel(entry.data)
	}
];

const ascensionColumns: readonly HistoryColumn[] = [
	entryNumberColumn,
	durationColumn,
	numberColumn('HZE', 'w-24', fieldAliases.highestZone),
	numberColumn('HS', 'w-32', fieldAliases.heroSouls)
];

export const TranscensionViewer = () => {
	const saveData = useSaveStore((state) => state.saveData);
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
	const transcensions = useMemo(
		() => toHistoryEntries(getValueAtPath(saveData, ['stats', 'transcensions'])),
		[saveData]
	);
	const selectedTranscension =
		transcensions.find((transcension) => transcension.index === selectedIndex) ?? transcensions[0];
	const selectedAscensions = selectedTranscension ? getAscensions(selectedTranscension.data) : [];

	return (
		<>
			<SectionHeading
				back='/'
				description=''
				icon={<ArrowLeft aria-hidden='true' className='h-5 w-5' />}
				title='Tools · Clicker Heroes Transcension Viewer'
			/>

			<SaveDataPanel examples={transcensionExamples} />

			<StepTitle step={2} title='Transcensions' />
			<PanelSection>
				<HistoryTable
					columns={transcensionColumns}
					emptyMessage='Load a save with transcension history to see it here.'
					entries={transcensions}
					label='Transcensions'
					selection={{
						selectedIndex: selectedTranscension?.index,
						onSelect: setSelectedIndex,
						getSelectLabel: (entry) => `Show ascensions in transcension #${getEntryNumberLabel(entry)}`
					}}
				/>
			</PanelSection>

			<StepTitle
				step={3}
				title={
					selectedTranscension
						? `Ascensions in Transcension #${getEntryNumberLabel(selectedTranscension)}`
						: 'Ascensions in Transcension'
				}
			/>
			<PanelSection>
				<HistoryTable
					columns={ascensionColumns}
					emptyMessage='Select a transcension with ascension history to see its ascensions here.'
					entries={selectedAscensions}
					label='Ascensions in the selected transcension'
				/>
			</PanelSection>
		</>
	);
};
