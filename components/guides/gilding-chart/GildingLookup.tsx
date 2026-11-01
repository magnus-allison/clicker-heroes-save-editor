'use client';

import { type ReactNode, useMemo, useState } from 'react';
import { Coins, Search } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { TextInput } from '@/components/ui/TextInput';
import {
	firstGildingExponent,
	formatChartNumbers,
	formatGoldExponent,
	gildingRowForExponent,
	nextGildingRow,
	parseGoldExponent
} from '@/lib/gilding-chart';
import { formatNumber } from '@/lib/format';

const Stat = ({ label, value }: { label: string; value: string }) => (
	<div className='min-w-0'>
		<p className='text-[11px] uppercase tracking-[0.08em] text-(--color-fg-dim)'>{label}</p>
		<p className='mt-0.5 truncate font-mono text-[15px] text-fg-strong'>{value}</p>
	</div>
);

const mono = (chunks: ReactNode) => <span className='font-mono'>{chunks}</span>;
const monoStrong = (chunks: ReactNode) => <span className='font-mono text-fg-strong'>{chunks}</span>;

/**
 * Gold-to-hero lookup that sits above the chart. Kept separate from the table
 * so the 59 static rows stay in the server bundle.
 */
export const GildingLookup = () => {
	const t = useTranslations('guidesUi.gildingChart');
	const locale = useLocale();
	const [gold, setGold] = useState('');

	const exponent = useMemo(() => parseGoldExponent(gold), [gold]);
	const row = useMemo(() => (exponent === null ? null : gildingRowForExponent(exponent)), [exponent]);

	const upcoming = row ? nextGildingRow(row) : null;

	return (
		<div className='rounded-(--radius-card) border border-(--color-line) bg-(--color-surface-muted) p-4 sm:p-5'>
			<div className='flex flex-col gap-1.5'>
				<label
					className='flex items-center gap-2 text-[12px] font-semibold text-fg-strong'
					htmlFor='gilding-gold'
				>
					<Coins aria-hidden='true' className='h-3.5 w-3.5 text-(--color-gold)' />
					{t('lookup.label')}
				</label>
				<div className='max-w-xs'>
					<TextInput
						ariaLabel={t('lookup.inputLabel')}
						className='font-mono'
						id='gilding-gold'
						onValueChange={setGold}
						placeholder='1.4e442'
						value={gold}
					/>
				</div>
				<p className='text-[12px] text-(--color-fg-muted)'>{t('lookup.hint')}</p>
			</div>

			{gold.trim() !== '' && exponent === null ? (
				<p className='mt-4 text-[13px] text-(--color-fg-muted)'>{t.rich('lookup.invalid', { mono })}</p>
			) : null}

			{exponent !== null && row === null ? (
				<div className='mt-4 rounded-(--radius-card) border border-(--color-line-subtle) bg-(--color-surface) p-4'>
					<p className='text-[13px] leading-6 text-(--color-fg-secondary)'>
						{t.rich('lookup.belowChart', {
							mono: monoStrong,
							gold: formatGoldExponent(exponent, locale),
							first: formatGoldExponent(firstGildingExponent, locale)
						})}
					</p>
				</div>
			) : null}

			{row ? (
				<div className='mt-4 rounded-(--radius-card) border border-(--color-gilded-line) bg-(--color-gilded-surface) p-4'>
					<p className='text-[11px] uppercase tracking-[0.08em] text-(--color-fg-dim)'>
						{t('lookup.phase', { phase: row.phase, title: t(`phases.${row.phase}`) })}
					</p>
					<p className='mt-1 flex items-center gap-2 text-[1.15rem] font-semibold leading-tight text-fg-strong'>
						<Search aria-hidden='true' className='h-4 w-4 shrink-0 text-(--color-gold)' />
						{row.hero}
					</p>

					<div className='mt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4'>
						<Stat label={t('lookup.fromLevel')} value={formatChartNumbers(row.fromLevel, locale)} />
						<Stat
							label={t('lookup.toLevel')}
							value={row.toLevel === null ? t('forever') : formatChartNumbers(row.toLevel, locale)}
						/>
						<Stat
							label={t('lookup.goldRange')}
							value={
								row.goldTo === null
									? `${formatGoldExponent(row.goldFrom, locale)}+`
									: `${formatGoldExponent(row.goldFrom, locale)} – ${formatGoldExponent(row.goldTo, locale)}`
							}
						/>
						<Stat
							label={t('lookup.approxAncientSouls')}
							value={
								row.approxAncientSouls === null ? '—' : formatChartNumbers(row.approxAncientSouls, locale)
							}
						/>
					</div>

					<p className='mt-4 border-t border-(--color-line-subtle) pt-3 text-[13px] leading-6 text-(--color-fg-secondary)'>
						{row.note
							? t(`notes.${row.note}`)
							: t('lookup.defaultNote', {
									hero: row.hero,
									from: formatChartNumbers(row.fromLevel, locale),
									to: row.toLevel === null ? t('forever') : formatChartNumbers(row.toLevel, locale)
								})}
					</p>

					<p className='mt-2 text-[12px] text-(--color-fg-muted)'>
						{upcoming
							? t.rich('lookup.nextUp', {
									hero: upcoming.hero,
									gold: formatGoldExponent(upcoming.goldFrom, locale),
									count: upcoming.goldFrom - exponent!,
									distance: formatNumber(upcoming.goldFrom - exponent!, locale),
									strong: (chunks) => <span className='font-medium text-fg-strong'>{chunks}</span>,
									mono: monoStrong
								})
							: t('lookup.lastRow')}
					</p>
				</div>
			) : null}
		</div>
	);
};
