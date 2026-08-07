import { Fragment, type FC } from 'react';

import {
	EditorTable,
	EditorTableBody,
	EditorTableCell,
	EditorTableHead,
	EditorTableHeaderCell,
	EditorTableRow
} from '@/components/ui/EditorTable';
import { gildingPhases, gildingRows } from '@/lib/gilding-chart';

const exponentFormatter = new Intl.NumberFormat('en-US');

const formatGoldRange = (goldFrom: number, goldTo: number | null) =>
	goldTo === null
		? `e${exponentFormatter.format(goldFrom)}+`
		: `e${exponentFormatter.format(goldFrom)} – e${exponentFormatter.format(goldTo)}`;

/**
 * The full chart, grouped by phase. Static, so it stays a server component and
 * ships no JavaScript.
 */
export const GildingTable: FC = () => (
	<EditorTable className='border-(--color-line-subtle)' label='Clicker Heroes gilding chart'>
		<EditorTableHead>
			<tr>
				<EditorTableHeaderCell className='w-10'>#</EditorTableHeaderCell>
				<EditorTableHeaderCell>Optimal hero</EditorTableHeaderCell>
				<EditorTableHeaderCell className='text-right'>From lvl</EditorTableHeaderCell>
				<EditorTableHeaderCell className='text-right'>To lvl</EditorTableHeaderCell>
				<EditorTableHeaderCell className='whitespace-nowrap'>Gold (log10)</EditorTableHeaderCell>
				<EditorTableHeaderCell className='text-right'>~AS</EditorTableHeaderCell>
				<EditorTableHeaderCell className='min-w-56'>Notes</EditorTableHeaderCell>
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
							Phase {phase.id} · {phase.title} · {phase.range}
						</th>
					</tr>
					{gildingRows
						.filter((row) => row.phase === phase.id)
						.map((row) => (
							<EditorTableRow key={row.step}>
								<EditorTableCell className='font-mono text-(--color-fg-dim)'>{row.step}</EditorTableCell>
								<EditorTableCell className='font-medium text-fg-strong'>{row.hero}</EditorTableCell>
								<EditorTableCell className='text-right font-mono whitespace-nowrap'>
									{row.fromLevel}
								</EditorTableCell>
								<EditorTableCell className='text-right font-mono whitespace-nowrap'>
									{row.toLevel}
								</EditorTableCell>
								<EditorTableCell className='font-mono whitespace-nowrap text-(--color-gold)'>
									{formatGoldRange(row.goldFrom, row.goldTo)}
								</EditorTableCell>
								<EditorTableCell className='text-right font-mono text-(--color-fg-dim)'>
									{row.approxAncientSouls ?? '—'}
								</EditorTableCell>
								<EditorTableCell className='text-[12px] text-(--color-fg-muted)'>
									{row.note ? (
										<span className={row.highlight ? 'font-medium text-fg-strong' : undefined}>
											{row.highlight ? '⚑ ' : ''}
											{row.note}
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
