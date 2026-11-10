import { Fragment, type FC } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import {
	EditorTable,
	EditorTableBody,
	EditorTableCell,
	EditorTableHead,
	EditorTableHeaderCell,
	EditorTableRow
} from '@/components/ui/EditorTable';
import {
	formatChartNumbers,
	formatGoldExponent,
	type GildingPhase,
	gildingPhases,
	gildingRows
} from '@/lib/gilding-chart';

const formatGoldRange = (goldFrom: number, goldTo: number | null, locale: string) =>
	goldTo === null
		? `${formatGoldExponent(goldFrom, locale)}+`
		: `${formatGoldExponent(goldFrom, locale)} – ${formatGoldExponent(goldTo, locale)}`;

/** `e35 to e295`, `e108,838 onwards`: a phase's gold span in the page locale. */
export const useGildingPhaseRange = () => {
	const t = useTranslations('guides.gildingChart');
	const locale = useLocale();

	return ({ rangeFrom, rangeTo }: GildingPhase) =>
		rangeTo === null
			? t('rangeOnwards', { from: formatGoldExponent(rangeFrom, locale) })
			: t('range', { from: formatGoldExponent(rangeFrom, locale), to: formatGoldExponent(rangeTo, locale) });
};

/**
 * The full chart, grouped by phase. Static, so it stays a server component and
 * ships no JavaScript.
 */
export const GildingTable: FC = () => {
	const t = useTranslations('guides.gildingChart');
	// Phase titles and row notes are shared with the client-side lookup.
	const tUi = useTranslations('guidesUi.gildingChart');
	const phaseRange = useGildingPhaseRange();
	const locale = useLocale();

	return (
		<EditorTable label={t('table.label')}>
			<EditorTableHead>
				<tr>
					<EditorTableHeaderCell className='w-10'>{t('table.step')}</EditorTableHeaderCell>
					<EditorTableHeaderCell>{t('table.hero')}</EditorTableHeaderCell>
					<EditorTableHeaderCell className='text-right'>{t('table.fromLevel')}</EditorTableHeaderCell>
					<EditorTableHeaderCell className='text-right'>{t('table.toLevel')}</EditorTableHeaderCell>
					<EditorTableHeaderCell className='whitespace-nowrap'>{t('table.gold')}</EditorTableHeaderCell>
					<EditorTableHeaderCell className='text-right'>
						{t('table.approxAncientSouls')}
					</EditorTableHeaderCell>
					<EditorTableHeaderCell className='min-w-56'>{t('table.notes')}</EditorTableHeaderCell>
				</tr>
			</EditorTableHead>
			<EditorTableBody>
				{gildingPhases.map((phase) => (
					<Fragment key={phase.id}>
						<tr className='border-t border-(--color-line-subtle) first:border-t-0'>
							<th
								className='bg-(--color-surface-muted) px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-(--color-fg-dim) sm:px-4'
								colSpan={7}
								scope='colgroup'
							>
								{t('table.phase', {
									phase: phase.id,
									title: tUi(`phases.${phase.id}`),
									range: phaseRange(phase)
								})}
							</th>
						</tr>
						{gildingRows
							.filter((row) => row.phase === phase.id)
							.map((row) => (
								<EditorTableRow key={row.step}>
									<EditorTableCell className='font-mono text-(--color-fg-dim)'>{row.step}</EditorTableCell>
									<EditorTableCell className='font-medium text-fg-strong'>{row.hero}</EditorTableCell>
									<EditorTableCell className='text-right font-mono whitespace-nowrap'>
										{formatChartNumbers(row.fromLevel, locale)}
									</EditorTableCell>
									<EditorTableCell className='text-right font-mono whitespace-nowrap'>
										{row.toLevel === null ? tUi('forever') : formatChartNumbers(row.toLevel, locale)}
									</EditorTableCell>
									<EditorTableCell className='font-mono whitespace-nowrap text-(--color-gold)'>
										{formatGoldRange(row.goldFrom, row.goldTo, locale)}
									</EditorTableCell>
									<EditorTableCell className='text-right font-mono text-(--color-fg-dim)'>
										{row.approxAncientSouls === null
											? '—'
											: formatChartNumbers(row.approxAncientSouls, locale)}
									</EditorTableCell>
									<EditorTableCell className='text-[12px] text-(--color-fg-muted)'>
										{row.note ? (
											<span className={row.highlight ? 'font-medium text-fg-strong' : undefined}>
												{row.highlight ? '⚑ ' : ''}
												{tUi(`notes.${row.note}`)}
											</span>
										) : (
											<span aria-hidden='true'>—</span>
										)}
									</EditorTableCell>
								</EditorTableRow>
							))}
					</Fragment>
				))}
			</EditorTableBody>
		</EditorTable>
	);
};
