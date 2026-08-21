'use client';

import { CopyButton } from '@/components/ui/CopyButton';
import { EditorImage } from '@/components/ui/EditorImage';
import { EditorTableCell, EditorTableRow } from '@/components/ui/EditorTable';
import { formatHeroSouls, toPasteableNumber, type AncientRow } from '@/lib/ancients-calculator';

/**
 * Row shapes specific to the ancients calculator's tables. The generic ones it
 * shares with the other calculators live in `components/ui/CalculatorRows`.
 */

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
