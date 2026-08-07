'use client';

import { useMemo, useState } from 'react';
import { Coins, Search } from 'lucide-react';

import { TextInput } from '@/components/ui/TextInput';
import {
	firstGildingExponent,
	gildingPhaseById,
	gildingRowForExponent,
	nextGildingRow,
	parseGoldExponent
} from '@/lib/gilding-chart';

const exponentFormatter = new Intl.NumberFormat('en-US');

const formatExponent = (value: number) => `e${exponentFormatter.format(value)}`;

const Stat = ({ label, value }: { label: string; value: string }) => (
	<div className='min-w-0'>
		<p className='text-[11px] uppercase tracking-[0.08em] text-(--color-fg-dim)'>{label}</p>
		<p className='mt-0.5 truncate font-mono text-[15px] text-fg-strong'>{value}</p>
	</div>
);

/**
 * Gold-to-hero lookup that sits above the chart. Kept separate from the table
 * so the 59 static rows stay in the server bundle.
 */
export const GildingLookup = () => {
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
					Your gold
				</label>
				<div className='max-w-xs'>
					<TextInput
						ariaLabel='Your current gold'
						className='font-mono'
						id='gilding-gold'
						onValueChange={setGold}
						placeholder='1.4e442'
						value={gold}
					/>
				</div>
				<p className='text-[12px] text-(--color-fg-muted)'>
					Paste the whole figure or just the exponent. Only the order of magnitude matters.
				</p>
			</div>

			{gold.trim() !== '' && exponent === null ? (
				<p className='mt-4 text-[13px] text-(--color-fg-muted)'>
					That does not look like a gold amount. Try something like <span className='font-mono'>1.4e442</span>{' '}
					or <span className='font-mono'>442</span>.
				</p>
			) : null}

			{exponent !== null && row === null ? (
				<div className='mt-4 rounded-(--radius-card) border border-(--color-line-subtle) bg-(--color-surface) p-4'>
					<p className='text-[13px] leading-6 text-(--color-fg-secondary)'>
						<span className='font-mono text-fg-strong'>{formatExponent(exponent)}</span> is below the first
						chart entry at{' '}
						<span className='font-mono text-fg-strong'>{formatExponent(firstGildingExponent)}</span>. The
						chart starts after your first transcension. Until then, put whatever gilds you have on one of the
						Power 5 and level that hero.
					</p>
				</div>
			) : null}

			{row ? (
				<div className='mt-4 rounded-(--radius-card) border border-(--color-gilded-line) bg-(--color-gilded-surface) p-4'>
					<p className='text-[11px] uppercase tracking-[0.08em] text-(--color-fg-dim)'>
						Phase {row.phase} · {gildingPhaseById(row.phase).title}
					</p>
					<p className='mt-1 flex items-center gap-2 text-[1.15rem] font-semibold leading-tight text-fg-strong'>
						<Search aria-hidden='true' className='h-4 w-4 shrink-0 text-(--color-gold)' />
						{row.hero}
					</p>

					<div className='mt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4'>
						<Stat label='From level' value={row.fromLevel} />
						<Stat label='To level' value={row.toLevel} />
						<Stat
							label='Gold range'
							value={
								row.goldTo === null
									? `${formatExponent(row.goldFrom)}+`
									: `${formatExponent(row.goldFrom)} – ${formatExponent(row.goldTo)}`
							}
						/>
						<Stat label='Approx. AS' value={row.approxAncientSouls ?? '—'} />
					</div>

					<p className='mt-4 border-t border-(--color-line-subtle) pt-3 text-[13px] leading-6 text-(--color-fg-secondary)'>
						{row.note ??
							`Move every gild you own onto ${row.hero} and level from ${row.fromLevel} to ${row.toLevel}.`}
					</p>

					<p className='mt-2 text-[12px] text-(--color-fg-muted)'>
						{upcoming ? (
							<>
								Next up: <span className='font-medium text-fg-strong'>{upcoming.hero}</span> at{' '}
								<span className='font-mono text-fg-strong'>{formatExponent(upcoming.goldFrom)}</span>,{' '}
								{exponentFormatter.format(upcoming.goldFrom - exponent!)} orders of magnitude away.
							</>
						) : (
							'This is the last row of the chart. Nothing further is tabulated.'
						)}
					</p>
				</div>
			) : null}
		</div>
	);
};
