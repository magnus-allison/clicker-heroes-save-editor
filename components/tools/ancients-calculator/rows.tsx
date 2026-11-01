'use client';

import { useTranslations } from 'next-intl';

import { CopyButton } from '@/components/ui/CopyButton';
import { EditorImage } from '@/components/ui/EditorImage';
import { EditorTableCell, EditorTableRow } from '@/components/ui/EditorTable';
import { useNumberFormat } from '@/components/ui/useNumberFormat';
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

/** Ancient keys whose effect line is translated under `tools.ancients.effects`. */
const ancientEffectKeys = [
	'solomon',
	'libertas',
	'siyalatas',
	'mammon',
	'mimzee',
	'pluto',
	'dogcog',
	'fortuna',
	'atman',
	'dora',
	'bhaal',
	'morgulis',
	'chronos',
	'bubos',
	'fragsworth',
	'vaagur',
	'kumawakamaru',
	'chawedo',
	'hecatoncheir',
	'berserker',
	'sniperino',
	'kleptos',
	'energon',
	'argaiv',
	'juggernaut',
	'revolc',
	'nogardnit'
] as const;

type AncientEffectKey = (typeof ancientEffectKeys)[number];

const isAncientEffectKey = (key: string): key is AncientEffectKey =>
	(ancientEffectKeys as readonly string[]).includes(key);

type AncientGoalRowProps = {
	row: AncientRow;
};

/**
 * One ancient's current level, goal, and what getting there costs. The change
 * copies as plain digits, ready for the game's bulk level-up field.
 */
export const AncientGoalRow = ({ row }: AncientGoalRowProps) => {
	const t = useTranslations('tools.ancients');
	const { locale } = useNumberFormat();
	const isIncrease = row.change.greaterThan(0);

	return (
		<EditorTableRow>
			<EditorTableCell>
				<p className='text-[13px] font-semibold text-(--color-fg-strong)'>{row.name}</p>
				<p className='mt-0.5 text-[12px] text-(--color-fg-muted)'>
					{isAncientEffectKey(row.key) ? t(`effects.${row.key}`) : row.effect}
				</p>
			</EditorTableCell>
			<EditorTableCell className='text-right tabular-nums'>
				{formatHeroSouls(row.currentLevel, locale)}
			</EditorTableCell>
			<EditorTableCell className='text-right tabular-nums'>
				<span className='text-(--color-fg-strong)'>{formatHeroSouls(row.optimalLevel, locale)}</span>
				{row.capped ? (
					<span
						className='ml-2 inline-flex h-5 items-center rounded-full border border-(--color-line-soft) bg-(--color-surface-muted) px-2 text-[10px] font-semibold text-(--color-fg-muted)'
						title={t('goalsTable.capTitle')}
					>
						{t('goalsTable.cap')}
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
						{formatHeroSouls(row.change, locale)}
					</span>
					<CopyButton
						idleLabel={t('goalsTable.copyChange', { name: row.name })}
						successLabel={t('goalsTable.copiedChange', { name: row.name })}
						text={toPasteableNumber(row.change)}
					/>
				</div>
			</EditorTableCell>
			<EditorTableCell className='text-right tabular-nums'>
				{formatHeroSouls(row.cost, locale)}
			</EditorTableCell>
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
