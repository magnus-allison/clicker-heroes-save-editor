'use client';

import { useMemo, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import { SaveDataPanel } from '@/components/editor/SaveDataPanel';
import { Breadcrumb } from '@/components/home/Breadcrumb';
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
import { RarityLabel, RelicIcon, relicNameClassName } from '@/components/tools/relic-viewer/RelicRarity';
import { cn } from 'cn';
import { relicExamples } from '@/lib/data/example-saves';
import { getRelicRarity, type RelicRarity } from '@/lib/data/relic-bonuses';
import { formatFixed, formatNumber, toFiniteNumber } from '@/lib/format';
import { useSaveStore } from '@/lib/save-store';
import { relicTypes, toRelicEntries, type RelicEntry, type RelicType } from '@/lib/relics';
import { getValueAtPath, type PathSegment } from '@/lib/save-utils';

/** Shown wherever a save has no value for a field, so blanks stay legible. */
const EMPTY_VALUE = '—';

const formatCount = (value: unknown, locale: string) =>
	value == null ? EMPTY_VALUE : formatNumber(value, locale);

const formatText = (value: unknown) => {
	const text = typeof value === 'string' ? value.trim() : '';
	return text || EMPTY_VALUE;
};

/**
 * Bonus levels are strings: whole numbers for most, long decimals for a few.
 * The game cuts decimals off at two places rather than rounding, so this does too.
 */
const formatBonusLevel = (value: unknown, locale: string) => {
	const level = toFiniteNumber(value);

	if (level === null) {
		return EMPTY_VALUE;
	}

	return Number.isInteger(level)
		? formatNumber(level, locale)
		: formatFixed(Math.trunc(level * 100) / 100, 2, locale);
};

type RelicColumnKey = 'slot' | 'name' | 'type' | 'rarity' | 'level' | 'upgrades' | 'bonuses';

type RelicColumn = {
	/** React key, and the column's heading under `tools.relic.columns`. */
	key: RelicColumnKey;
	widthClassName: string;
	align?: 'left' | 'right';
	cellClassName?: string;
	render: (entry: RelicEntry) => ReactNode;
};

type ColumnLabels = {
	junkPile: string;
	/** A confirmed rarity's translated name. */
	rarity: (rarity: RelicRarity) => string;
	/** A known relic type's translated name. */
	type: (type: RelicType) => string;
};

const buildRelicColumns = (locale: string, labels: ColumnLabels): readonly RelicColumn[] => [
	{
		key: 'slot',
		widthClassName: 'w-24',
		cellClassName: 'font-mono text-(--color-fg)',
		render: (entry) => (entry.isJunk ? labels.junkPile : (entry.slot ?? EMPTY_VALUE))
	},
	{
		key: 'name',
		widthClassName: 'w-64',
		cellClassName: 'text-(--color-fg)',
		// The game tints a relic's name by rarity, leaving Common plain.
		render: (entry) => {
			const rarity = getRelicRarity(toFiniteNumber(entry.data.rarity));
			return (
				<span className='flex items-center gap-2.5'>
					<RelicIcon imageId={entry.data.imageId} rarity={rarity} size='sm' />
					<span className={relicNameClassName(rarity)}>{formatText(entry.data.name)}</span>
				</span>
			);
		}
	},
	{
		key: 'type',
		widthClassName: 'w-24',
		render: (entry) => {
			const type = relicTypes.find((known) => known === entry.data.type);
			return type ? labels.type(type) : formatText(entry.data.type);
		}
	},
	{
		key: 'rarity',
		widthClassName: 'w-28',
		render: (entry) => {
			const rarity = getRelicRarity(toFiniteNumber(entry.data.rarity));

			if (!rarity) {
				return formatCount(entry.data.rarity, locale);
			}

			return <RarityLabel label={labels.rarity(rarity)} rarity={rarity} />;
		}
	},
	{
		key: 'level',
		widthClassName: 'w-24',
		align: 'right',
		render: (entry) => formatCount(entry.data.level, locale)
	},
	{
		key: 'upgrades',
		widthClassName: 'w-24',
		align: 'right',
		render: (entry) => formatCount(entry.data.upgradeCount, locale)
	},
	{
		key: 'bonuses',
		widthClassName: 'w-56',
		render: (entry) =>
			entry.bonuses.length > 0 ? (
				<ul className='grid gap-0.5'>
					{entry.bonuses.map((bonus, index) => (
						<li className='tabular-nums' key={index}>
							{bonus.ancient ? (
								<span className='text-(--color-fg)' title={`#${bonus.type}`}>
									{bonus.ancient}
								</span>
							) : (
								<span className='font-mono text-(--color-fg)'>#{bonus.type}</span>
							)}
							<span className='text-(--color-fg-muted)'> · </span>
							{formatBonusLevel(bonus.level, locale)}
						</li>
					))}
				</ul>
			) : (
				EMPTY_VALUE
			)
	}
];

type SummaryKey =
	| 'relicCount'
	| 'equippedCount'
	| 'forgeCores'
	| 'totalRelicsReceived'
	| 'relicsReceivedThisTranscension'
	| 'relicQuestsCompleted';

/** Counters read straight from the save, each translated under `tools.relic.summary`. */
const savedSummaryFields: { key: SummaryKey; path: PathSegment[] }[] = [
	{ key: 'forgeCores', path: ['items', 'salvagePoints'] },
	{ key: 'totalRelicsReceived', path: ['totalRelicsReceived'] },
	{ key: 'relicsReceivedThisTranscension', path: ['relicsReceivedThisTranscension'] },
	{ key: 'relicQuestsCompleted', path: ['relicQuestsCompleted'] }
];

export const RelicViewer = () => {
	const t = useTranslations('tools.relic');
	const { locale } = useNumberFormat();
	const relicColumns = buildRelicColumns(locale, {
		junkPile: t('junkPile'),
		rarity: (rarity) => t(`rarities.${rarity}`),
		type: (type) => t(`types.${type}`)
	});
	const saveData = useSaveStore((state) => state.saveData);
	const relics = useMemo(() => toRelicEntries(saveData), [saveData]);

	const summaryRows: { key: SummaryKey; value: unknown }[] = [
		{ key: 'relicCount', value: saveData ? relics.length : null },
		{
			key: 'equippedCount',
			value: saveData ? relics.filter((relic) => relic.slot !== null && !relic.isJunk).length : null
		},
		...savedSummaryFields.map((field) => ({ key: field.key, value: getValueAtPath(saveData, field.path) }))
	];

	return (
		<>
			<Breadcrumb page='relicViewer' title='tools' />

			<SaveDataPanel examples={relicExamples} />

			<StepTitle step={2} title={t('steps.relics')} />
			<PanelSection>
				<div className='grid gap-4 p-4'>
					<p className='text-sm text-(--color-fg-muted)'>{t('bonusNote')}</p>
					<EditorTable label={t('relicsLabel')} tableClassName='w-full table-fixed'>
						<colgroup>
							{relicColumns.map((column) => (
								<col className={column.widthClassName} key={column.key} />
							))}
						</colgroup>
						<EditorTableHead>
							<tr>
								{relicColumns.map((column) => (
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
							{relics.length > 0 ? (
								relics.map((entry) => (
									<EditorTableRow key={entry.uid}>
										{relicColumns.map((column) => (
											<EditorTableCell
												className={cn(
													'align-top',
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
										colSpan={relicColumns.length}
									>
										{t('relicsEmpty')}
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
					<EditorTable label={t('summaryLabel')} tableClassName='w-full table-fixed'>
						<colgroup>
							<col className='w-1/2' />
							<col className='w-1/2' />
						</colgroup>
						<EditorTableBody>
							{summaryRows.map((row) => (
								<EditorTableRow key={row.key}>
									<EditorTableCell className='text-(--color-fg)'>{t(`summary.${row.key}`)}</EditorTableCell>
									<EditorTableCell className='text-right tabular-nums'>
										{formatCount(row.value, locale)}
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
