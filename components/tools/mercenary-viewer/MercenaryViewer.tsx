'use client';

import { useMemo, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import { SaveDataPanel } from '@/components/editor/SaveDataPanel';
import { Breadcrumb } from '@/components/home/Breadcrumb';
import { useDurationUnits } from '@/components/tools/use-duration-units';
import { useNumberFormat } from '@/components/ui/useNumberFormat';
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
import { cn } from 'cn';
import { mercenarySummaryFields } from '@/lib/data/editor-config';
import { mercenaryExamples } from '@/lib/data/example-saves';
import {
	formatDecimal,
	formatDurationSeconds,
	formatNumber,
	toFiniteNumber,
	type DurationUnits
} from '@/lib/format';
import { useSaveStore } from '@/lib/save-store';
import { getValueAtPath, type PathSegment } from '@/lib/save-utils';

type MercenaryRecord = Record<string, unknown>;

type MercenaryEntry = {
	/** Slot index the save stores the mercenary under. */
	index: number;
	data: MercenaryRecord;
};

/** Summary counters, each translated under `tools.mercenary.summary`. */
const summaryKeys = [
	'mercenaryCount',
	'highestMercenaryLevelEver',
	'totalMercenariesRevived',
	'totalMercenariesBuried',
	'total5MinuteQuests',
	'heroSoulQuestsCompleted',
	'goldQuestsCompleted',
	'rubyQuestsCompleted',
	'relicQuestsCompleted',
	'skillQuestsCompleted'
] as const;

type SummaryKey = (typeof summaryKeys)[number];

const isSummaryKey = (value: unknown): value is SummaryKey =>
	typeof value === 'string' && (summaryKeys as readonly string[]).includes(value);

type SummaryField = {
	/** Message key; `label` is the English fallback for a field without one. */
	key: SummaryKey | null;
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
	{ key: 'mercenaryCount', label: 'Mercenary Count', path: ['mercenaryCount'] },
	{
		key: 'highestMercenaryLevelEver',
		label: 'Highest Mercenary Level Ever',
		path: ['highestMercenaryLevelEver']
	}
];

const summaryFields: SummaryField[] = [
	...rosterFields,
	...mercenarySummaryFields.map((field) => {
		const lastSegment = field.path.at(-1);
		return { key: isSummaryKey(lastSegment) ? lastSegment : null, label: field.label, path: field.path };
	})
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

const formatCount = (value: unknown, locale: string) =>
	value == null ? EMPTY_VALUE : formatNumber(value, locale);

const formatName = (value: unknown) => {
	const name = typeof value === 'string' ? value.trim() : '';
	return name || EMPTY_VALUE;
};

const formatDuration = (value: unknown, units: DurationUnits) => {
	const seconds = toFiniteNumber(value);
	return seconds === null ? EMPTY_VALUE : formatDurationSeconds(seconds, units);
};

/** Save fields such as experience and success chance are 0–1 fractions. */
const formatFraction = (value: unknown, locale: string) => {
	const fraction = toFiniteNumber(value);
	return fraction === null ? EMPTY_VALUE : `${formatDecimal(fraction * 100, locale)}%`;
};

type RosterColumnKey =
	'slot' | 'name' | 'level' | 'experience' | 'timeToDie' | 'bonusLives' | 'lastQuest' | 'successChance';

type RosterColumn = {
	/** React key, and the column's heading under `tools.mercenary.columns`. */
	key: RosterColumnKey;
	widthClassName: string;
	align?: 'left' | 'right';
	cellClassName?: string;
	render: (entry: MercenaryEntry) => ReactNode;
};

const buildRosterColumns = (units: DurationUnits, locale: string): readonly RosterColumn[] => [
	{
		key: 'slot',
		widthClassName: 'w-16',
		cellClassName: 'font-mono text-(--color-fg)',
		render: (entry) => entry.index + 1
	},
	{
		key: 'name',
		widthClassName: 'w-44',
		cellClassName: 'text-(--color-fg)',
		render: (entry) => formatName(entry.data.name)
	},
	{
		key: 'level',
		widthClassName: 'w-24',
		align: 'right',
		render: (entry) => formatCount(entry.data.level, locale)
	},
	{
		key: 'experience',
		widthClassName: 'w-28',
		align: 'right',
		render: (entry) => formatFraction(entry.data.experience, locale)
	},
	{
		key: 'timeToDie',
		widthClassName: 'w-32',
		render: (entry) => formatDuration(entry.data.timeToDie, units)
	},
	{
		key: 'bonusLives',
		widthClassName: 'w-28',
		align: 'right',
		render: (entry) => formatCount(entry.data.bonusLives, locale)
	},
	{
		key: 'lastQuest',
		widthClassName: 'w-32',
		render: (entry) => formatDuration(entry.data.lastQuestDuration, units)
	},
	{
		key: 'successChance',
		widthClassName: 'w-32',
		align: 'right',
		render: (entry) => formatFraction(entry.data.lastQuestSuccessChance, locale)
	}
];

export const MercenaryViewer = () => {
	const t = useTranslations('tools.mercenary');
	const { locale } = useNumberFormat();
	const rosterColumns = buildRosterColumns(useDurationUnits(), locale);
	const saveData = useSaveStore((state) => state.saveData);
	const mercenaries = useMemo(
		() => toMercenaryEntries(getValueAtPath(saveData, ['mercenaries', 'mercenaries'])),
		[saveData]
	);

	return (
		<>
			<Breadcrumb page='mercenaryViewer' title='tools' />

			<SaveDataPanel examples={mercenaryExamples} />

			<StepTitle step={2} title={t('steps.roster')} />
			<PanelSection>
				<div className='grid gap-4 p-4'>
					<EditorTable
						className='border-(--color-line-subtle)'
						label={t('rosterLabel')}
						tableClassName='w-full table-fixed'
					>
						<colgroup>
							{rosterColumns.map((column) => (
								<col className={column.widthClassName} key={column.key} />
							))}
						</colgroup>
						<EditorTableHead>
							<tr>
								{rosterColumns.map((column) => (
									<EditorTableHeaderCell
										className={column.align === 'right' ? 'text-right' : undefined}
										key={column.key}
									>
										{t(`columns.${column.key}`)}
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
												key={column.key}
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
										{t('rosterEmpty')}
									</EditorTableCell>
								</EditorTableRow>
							)}
						</EditorTableBody>
					</EditorTable>
				</div>
			</PanelSection>

			<StepTitle step={3} title={t('steps.summary')} />
			<PanelSection>
				<div className='grid gap-4 p-4'>
					<EditorTable
						className='border-(--color-line-subtle)'
						label={t('summaryLabel')}
						tableClassName='w-full table-fixed'
					>
						<colgroup>
							<col className='w-1/2' />
							<col className='w-1/2' />
						</colgroup>
						<EditorTableBody>
							{summaryFields.map((field) => (
								<EditorTableRow key={field.path.join('.')}>
									<EditorTableCell className='text-(--color-fg)'>
										{field.key ? t(`summary.${field.key}`) : field.label}
									</EditorTableCell>
									<EditorTableCell className='text-right tabular-nums'>
										{formatCount(getValueAtPath(saveData, field.path), locale)}
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
