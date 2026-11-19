'use client';

import type { LucideIcon } from 'lucide-react';
import { StarIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { CollapsiblePanel } from '@/components/ui/CollapsiblePanel';
import { EditorImage } from '@/components/ui/EditorImage';
import {
	EditorTable,
	EditorTableBody,
	EditorTableCell,
	EditorTableHead,
	EditorTableHeaderCell,
	EditorTableImageHeaderCell,
	EditorTableRow,
	MobileCellLabel
} from '@/components/ui/EditorTable';
import { NumberInput } from '@/components/ui/NumberInput';
import { Tooltip } from '@/components/ui/Tooltip';
import { useNumberFormat } from '@/components/ui/useNumberFormat';
import { orderedHeroes } from '@/lib/data/heroes';
import { useSaveStore } from '@/lib/save-store';
import { getValueAtPath } from '@/lib/save-utils';
import { cn } from 'cn';

type Props = {
	/** Hash id that links straight to this section (see `CollapsiblePanel`). */
	anchor?: string;
	defaultOpen?: boolean;
	icon?: LucideIcon;
	title?: string;
};

export const HeroesSection = ({ anchor, defaultOpen, icon, title: titleProp }: Props) => {
	const t = useTranslations('editor.heroes');
	const tTable = useTranslations('editor.table');
	const title = titleProp ?? t('title');
	const format = useNumberFormat();
	const saveData = useSaveStore((state) => state.saveData);
	const updateValue = useSaveStore((state) => state.updateValue);
	const heroCollection =
		getValueAtPath<Record<string, { level?: number; epicLevel?: number }>>(saveData, [
			'heroCollection',
			'heroes'
		]) ?? {};

	return (
		<CollapsiblePanel anchor={anchor} defaultOpen={defaultOpen} icon={icon} title={title}>
			<EditorTable label={title} tableClassName='w-full sm:table-fixed'>
				{/* The image column is the same fixed `w-15` as every other image table,
				    so the names line up across sections. The name column takes whatever
				    the two input columns leave. Phones lay rows out as cards, so the
				    widths only apply from `sm` up. */}
				<colgroup className='max-sm:hidden'>
					<col className='w-15' />
					<col />
					<col className='w-48 lg:w-80' />
					<col className='w-48 lg:w-80' />
				</colgroup>
				{/* Phones get labels inside each row instead (see below). */}
				<EditorTableHead className='max-sm:hidden'>
					<tr>
						<EditorTableImageHeaderCell>{tTable('image')}</EditorTableImageHeaderCell>
						<EditorTableHeaderCell>{tTable('hero')}</EditorTableHeaderCell>
						<EditorTableHeaderCell className='text-right'>{tTable('level')}</EditorTableHeaderCell>
						<EditorTableHeaderCell className='text-right'>{tTable('gildedLevel')}</EditorTableHeaderCell>
					</tr>
				</EditorTableHead>
				<EditorTableBody>
					{orderedHeroes.map((hero) => {
						const heroState = heroCollection[hero.heroId] ?? {};
						const level = heroState.level ?? 0;
						const epicLevel = heroState.epicLevel ?? 0;
						const isGilded = epicLevel >= 1;
						const imageSrc = isGilded && hero.gildedImage ? hero.gildedImage : hero.image;

						return (
							<EditorTableRow
								// On phones each row becomes a small card on a four-track grid: image
								// and name across the top, the two inputs side by side below, so
								// nothing scrolls sideways.
								className='max-sm:grid max-sm:grid-cols-4'
								key={hero.heroId}
							>
								<EditorTableCell className='max-sm:pb-0'>
									<EditorImage alt='' className='h-11 w-11 object-contain' size={44} src={imageSrc} />
								</EditorTableCell>
								<EditorTableCell className='max-sm:col-span-3 max-sm:pb-0'>
									<div className='flex min-w-0 items-center gap-1.5'>
										<span className={cn('font-aeonik font-medium text-[14px]', isGilded ? 'text-(--color-gold)' : 'text-(--color-fg)')}>
											{hero.name}
										</span>
										{isGilded ? (
											<Tooltip
												contentClassName='w-max min-w-44 border-(--color-line) bg-(--color-surface-menu)'
												placement='top'
												title={hero.name}
												trigger={
													// A button so keyboard users can focus it and get the same tooltip.
													<button
														aria-label={t('gilded', { count: epicLevel, percent: epicLevel * 50 })}
														className='flex h-5 w-5 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-1 focus-visible:outline-(--color-focus-ring)'
														type='button'
													>
														<StarIcon
															aria-hidden='true'
															className='h-3.5 w-3.5 fill-current text-(--color-gold)'
														/>
													</button>
												}
											>
												<dl className='grid grid-cols-[1fr_auto] gap-x-4'>
													<dt>{tTable('gildedLevel')}</dt>
													<dd className='text-right tabular-nums text-(--color-fg-strong)'>
														{format.number(epicLevel)}
													</dd>
													<dt>{t('damageBonus')}</dt>
													<dd className='text-right tabular-nums text-(--color-gold)'>
														+{format.number(epicLevel * 50)}%
													</dd>
												</dl>
											</Tooltip>
										) : null}
									</div>
								</EditorTableCell>
								<EditorTableCell className='max-sm:col-span-2'>
									<MobileCellLabel>{tTable('level')}</MobileCellLabel>
									<NumberInput
										ariaLabel={t('levelAria', { name: hero.name })}
										compact
										disabled={!saveData}
										wrapperClassName='sm:w-full'
										onCommit={(value) =>
											updateValue(['heroCollection', 'heroes', hero.heroId, 'level'], value)
										}
										selectOnFocus
										value={level}
									/>
								</EditorTableCell>
								<EditorTableCell className='max-sm:col-span-2'>
									<MobileCellLabel>{tTable('gildedLevel')}</MobileCellLabel>
									<NumberInput
										ariaLabel={t('gildedLevelAria', { name: hero.name })}
										compact
										disabled={!saveData}
										wrapperClassName='sm:w-full'
										onCommit={(value) =>
											updateValue(['heroCollection', 'heroes', hero.heroId, 'epicLevel'], value)
										}
										selectOnFocus
										value={epicLevel}
									/>
								</EditorTableCell>
							</EditorTableRow>
						);
					})}
				</EditorTableBody>
			</EditorTable>
		</CollapsiblePanel>
	);
};
