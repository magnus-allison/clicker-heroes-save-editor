'use client';

import type { ReactNode } from 'react';

import { CopyButton } from '@/components/ui/CopyButton';
import { EditorImage } from '@/components/ui/EditorImage';
import { EditorTableCell, EditorTableRow } from '@/components/ui/EditorTable';
import { HelpToolTip } from '@/components/ui/HelpToolTip';
import { formatHeroSouls, toPasteableNumber, type AncientRow } from '@/lib/ancients-calculator';

/**
 * Row and stat shapes the ancients calculator's tables are built from. They
 * live here so `AncientsCalculator` stays readable.
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

/** Hero soul totals above the goal table. */
export const SummaryStat = ({ label, value }: SummaryStatProps) => (
	<div className='rounded-(--radius-card) border border-(--color-line-subtle) bg-(--color-surface) p-3 shadow-[var(--shadow-raised)]'>
		<p className='text-[11px] tracking-[0.08em] uppercase text-(--color-fg-dim)'>{label}</p>
		<p className='mt-1 wrap-break-word text-lg leading-tight font-semibold text-(--color-fg-strong)'>
			{value}
		</p>
	</div>
);

/** Two-column `label: value` row for the read-only save stats. */
export const StatRow = ({ label, value }: SummaryStatProps) => (
	<EditorTableRow>
		<EditorTableCell className='text-[13px] font-semibold text-(--color-fg)'>{label}</EditorTableCell>
		<EditorTableCell className='text-right tabular-nums text-(--color-fg-strong)'>{value}</EditorTableCell>
	</EditorTableRow>
);

type PlannerRowProps = {
	change: string;
	gain: string;
	required: string;
};

/** One step of the ancient soul planner. */
export const PlannerRow = ({ change, gain, required }: PlannerRowProps) => (
	<EditorTableRow>
		<EditorTableCell className='font-semibold text-(--color-fg-strong)'>{gain}</EditorTableCell>
		<EditorTableCell className='text-right tabular-nums'>{required}</EditorTableCell>
		<EditorTableCell className='text-right tabular-nums text-(--color-fg-muted)'>{change}</EditorTableCell>
	</EditorTableRow>
);

type AncientGoalRowProps = {
	row: AncientRow;
};

/**
 * One ancient's current level, goal, and what getting there costs. The change
 * copies as plain digits, ready for the game's bulk level-up field.
 */
export const AncientGoalRow = ({ row }: AncientGoalRowProps) => {
	const isIncrease = row.change.greaterThan(0);

	return (
		<EditorTableRow>
			<EditorTableCell>
				<p className='text-[13px] font-semibold text-(--color-fg-strong)'>{row.name}</p>
				<p className='mt-0.5 text-[12px] text-(--color-fg-muted)'>{row.effect}</p>
			</EditorTableCell>
			<EditorTableCell className='text-right tabular-nums'>
				{formatHeroSouls(row.currentLevel)}
			</EditorTableCell>
			<EditorTableCell className='text-right tabular-nums'>
				<span className='text-(--color-fg-strong)'>{formatHeroSouls(row.optimalLevel)}</span>
				{row.capped ? (
					<span
						className='ml-2 inline-flex h-5 items-center rounded-full border border-(--color-line-soft) bg-(--color-surface-muted) px-2 text-[10px] font-semibold text-(--color-fg-muted)'
						title='Levelled to the point where this ancient stops paying off'
					>
						cap
					</span>
				) : null}
			</EditorTableCell>
			<EditorTableCell className='text-right'>
				<div className='flex items-center justify-end gap-1'>
					<span
						className={
							isIncrease
								? 'text-[13px] font-semibold tabular-nums text-(--color-primary-text)'
								: 'text-[13px] tabular-nums text-(--color-fg-muted)'
						}
					>
						{isIncrease ? '+' : ''}
						{formatHeroSouls(row.change)}
					</span>
					<CopyButton
						idleLabel={`Copy ${row.name} level change`}
						successLabel={`Copied ${row.name} level change`}
						text={toPasteableNumber(row.change)}
					/>
				</div>
			</EditorTableCell>
			<EditorTableCell className='text-right tabular-nums'>{formatHeroSouls(row.cost)}</EditorTableCell>
		</EditorTableRow>
	);
};

type OutsiderLevelRowProps = {
	description: string;
	imageSrc: string;
	level: string;
	name: string;
};

export const OutsiderLevelRow = ({ description, imageSrc, level, name }: OutsiderLevelRowProps) => (
	<EditorTableRow>
		<EditorTableCell>
			<EditorImage alt={name} className='h-11 w-11 object-contain' size={44} src={imageSrc} />
		</EditorTableCell>
		<EditorTableCell>
			<p className='text-[13px] font-semibold text-(--color-fg-strong)'>{name}</p>
			<p className='mt-0.5 text-[12px] text-(--color-fg-muted)'>{description}</p>
		</EditorTableCell>
		<EditorTableCell className='text-right tabular-nums'>{level}</EditorTableCell>
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
