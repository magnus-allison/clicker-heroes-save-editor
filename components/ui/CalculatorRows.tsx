'use client';

import type { ReactNode } from 'react';

import { EditorTableCell, EditorTableRow } from '@/components/ui/EditorTable';
import { HelpToolTip } from '@/components/ui/HelpToolTip';

/**
 * Row and stat shapes shared by the calculator tools: a labelled setting, a
 * headline figure, a read-only `label: value` table row, and the placeholder
 * that stands in for an empty table.
 */

type SettingRowProps = {
	children: ReactNode;
	description: string;
	help?: ReactNode;
	label: string;
};

/** Label, explanation, and the control that changes it. */
export const SettingRow = ({ children, description, help, label }: SettingRowProps) => (
	<div className='grid gap-2 sm:grid-cols-[minmax(0,1fr)_18rem] sm:items-center'>
		<div className='flex min-w-0 items-center gap-3'>
			<div className='min-w-0'>
				<p className='text-[13px] font-semibold text-(--color-fg)'>{label}</p>
				<p className='mt-0.5 text-[12px] text-(--color-fg-muted)'>{description}</p>
			</div>
			{help ? <HelpToolTip title={label}>{help}</HelpToolTip> : null}
		</div>
		<div className='flex justify-start sm:justify-end'>{children}</div>
	</div>
);

type SummaryStatProps = {
	label: string;
	value: string;
};

/** Headline figure above a results table. */
export const SummaryStat = ({ label, value }: SummaryStatProps) => (
	<div className='rounded-(--radius-card) border border-(--color-line-subtle) bg-(--color-surface) p-3 shadow-[var(--shadow-raised)]'>
		<p className='text-[11px] tracking-[0.08em] uppercase text-(--color-fg-dim)'>{label}</p>
		<p className='mt-1 wrap-break-word text-lg leading-tight font-semibold text-(--color-fg-strong)'>
			{value}
		</p>
	</div>
);

/** Two-column `label: value` row for read-only stats. */
export const StatRow = ({ label, value }: SummaryStatProps) => (
	<EditorTableRow>
		<EditorTableCell className='text-[13px] font-semibold text-(--color-fg)'>{label}</EditorTableCell>
		<EditorTableCell className='text-right tabular-nums text-(--color-fg-strong)'>{value}</EditorTableCell>
	</EditorTableRow>
);

type EmptyTableRowProps = {
	children: ReactNode;
	columns: number;
};

export const EmptyTableRow = ({ children, columns }: EmptyTableRowProps) => (
	<tr>
		<td className='px-3 py-6 text-center text-(--color-fg-muted) sm:px-4' colSpan={columns}>
			{children}
		</td>
	</tr>
);
