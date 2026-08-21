'use client';

import { CopyButton } from '@/components/ui/CopyButton';
import { EditorImage } from '@/components/ui/EditorImage';
import { EditorTableCell, EditorTableRow } from '@/components/ui/EditorTable';
import { formatNumber } from '@/lib/format';
import type { OutsiderRecommendation, TranscensionRow } from '@/lib/outsiders-calculator';

/**
 * Row shapes specific to the outsiders calculator. The generic ones it shares
 * with the other calculators live in `components/ui/CalculatorRows`.
 */

type OutsiderGoalRowProps = {
	imageSrc?: string;
	row: OutsiderRecommendation;
	/** Level in the loaded save, or `null` before one is imported. */
	currentLevel: number | null;
};

/**
 * One outsider's current level, what the plan wants, and what that costs. The
 * recommended level copies as plain digits, ready for the game's level field.
 */
export const OutsiderGoalRow = ({ currentLevel, imageSrc, row }: OutsiderGoalRowProps) => {
	const change = currentLevel === null ? null : row.level - currentLevel;

	return (
		<EditorTableRow>
			<EditorTableCell>
				{imageSrc ? (
					<EditorImage alt={row.name} className='h-11 w-11 object-contain' size={44} src={imageSrc} />
				) : null}
			</EditorTableCell>
			<EditorTableCell>
				<p className='text-[13px] font-semibold text-(--color-fg-strong)'>{row.name}</p>
			</EditorTableCell>
			<EditorTableCell className='text-right tabular-nums text-(--color-fg-muted)'>
				{currentLevel === null ? '-' : formatNumber(currentLevel)}
			</EditorTableCell>
			<EditorTableCell className='text-right'>
				<div className='flex items-center justify-end gap-1'>
					<span className='text-[13px] font-semibold tabular-nums text-(--color-fg-strong)'>
						{formatNumber(row.level)}
					</span>
					<CopyButton
						idleLabel={`Copy ${row.name} level`}
						successLabel={`Copied ${row.name} level`}
						text={String(row.level)}
					/>
				</div>
			</EditorTableCell>
			<EditorTableCell className='text-right tabular-nums'>
				{change === null || change === 0 ? (
					<span className='text-(--color-fg-muted)'>-</span>
				) : (
					<span className={change > 0 ? 'font-semibold text-(--color-primary-text)' : undefined}>
						{change > 0 ? '+' : ''}
						{formatNumber(change)}
					</span>
				)}
			</EditorTableCell>
			<EditorTableCell className='text-right tabular-nums'>{formatNumber(row.cost)}</EditorTableCell>
		</EditorTableRow>
	);
};

type TranscensionTableRowProps = {
	row: TranscensionRow;
};

/** One projected transcension in the simulator. */
export const TranscensionTableRow = ({ row }: TranscensionTableRowProps) => (
	<EditorTableRow>
		<EditorTableCell className='tabular-nums text-(--color-fg-strong)'>
			{formatNumber(row.ancientSouls)}
		</EditorTableCell>
		<EditorTableCell className='text-right tabular-nums'>{formatNumber(row.borbLevel)}</EditorTableCell>
		<EditorTableCell className='text-right tabular-nums'>{formatNumber(row.highestZone)}</EditorTableCell>
		<EditorTableCell className='text-right tabular-nums'>
			{row.monstersPerZone.toFixed(2)}
			{row.monstersPerZone < 2 ? (
				<span className='ml-1 text-(--color-fg-muted)' title='The game never drops below two'>
					(2)
				</span>
			) : null}
		</EditorTableCell>
		<EditorTableCell className='text-right tabular-nums text-(--color-fg-muted)'>
			{row.durationLabel}
		</EditorTableCell>
	</EditorTableRow>
);
