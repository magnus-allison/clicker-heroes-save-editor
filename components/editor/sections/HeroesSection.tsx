'use client';

import type { LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { CollapsiblePanel } from '@/components/ui/CollapsiblePanel';
import { EditorImage } from '@/components/ui/EditorImage';
import {
	EditorTable,
	EditorTableBody,
	EditorTableCell,
	EditorTableHead,
	EditorTableHeaderCell,
	EditorTableRow,
	MobileCellLabel
} from '@/components/ui/EditorTable';
import { NumberInput } from '@/components/ui/NumberInput';
import { orderedHeroes } from '@/lib/data/heroes';
import { useSaveStore } from '@/lib/save-store';
import { getValueAtPath } from '@/lib/save-utils';
import { cn } from 'cn';

const gildIncrements = [1, 10, 100] as const;

type Props = {
	defaultOpen?: boolean;
	icon?: LucideIcon;
	title?: string;
};

export const HeroesSection = ({ defaultOpen, icon, title: titleProp }: Props) => {
	const t = useTranslations('editor.heroes');
	const tTable = useTranslations('editor.table');
	const title = titleProp ?? t('title');
	const getGildedLabel = (epicLevel: number) =>
		epicLevel <= 0 ? '' : t('gilded', { count: epicLevel, percent: epicLevel * 50 });
	const saveData = useSaveStore((state) => state.saveData);
	const updateValue = useSaveStore((state) => state.updateValue);
	const heroCollection =
		getValueAtPath<Record<string, { level?: number; epicLevel?: number }>>(saveData, [
			'heroCollection',
			'heroes'
		]) ?? {};

	return (
		<CollapsiblePanel defaultOpen={defaultOpen} icon={icon} title={title}>
			<EditorTable label={title}>
				{/* Phones get labels inside each row instead (see below). */}
				<EditorTableHead className='max-sm:hidden'>
					<tr>
						<EditorTableHeaderCell>{tTable('hero')}</EditorTableHeaderCell>
						<EditorTableHeaderCell>{tTable('level')}</EditorTableHeaderCell>
						<EditorTableHeaderCell>{tTable('gildedLevel')}</EditorTableHeaderCell>
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
								// On phones each row becomes a small card: the hero across the top, the
								// two inputs side by side below, so nothing scrolls sideways.
								className={cn('max-sm:grid max-sm:grid-cols-2', isGilded && 'bg-(--color-gilded-surface)')}
								key={hero.heroId}
							>
								{/* Portrait and name share a cell, so the name column takes
								    whatever the two inputs leave. */}
								<EditorTableCell className='py-2 max-sm:col-span-2 max-sm:pb-0'>
									<div className='flex items-center gap-3 sm:min-w-44'>
										<EditorImage
											alt=''
											className='h-10 w-10 shrink-0 object-contain'
											size={40}
											src={imageSrc}
										/>
										<div className='flex min-w-0 flex-col items-start gap-1'>
											<span className={isGilded ? 'text-(--color-gold)' : 'text-(--color-fg)'}>
												{hero.name}
											</span>
											{isGilded ? (
												<span className='inline-flex h-5 items-center rounded-full border border-(--color-gilded-line) px-2 text-[10px] font-bold tracking-wide text-(--color-gold)'>
													{getGildedLabel(epicLevel)}
												</span>
											) : null}
										</div>
									</div>
								</EditorTableCell>
								{/* `sm:w-px` shrinks the input columns to their content, so
								    each header sits directly above its input. */}
								<EditorTableCell className='py-2 sm:w-px sm:min-w-45'>
									<MobileCellLabel>{tTable('level')}</MobileCellLabel>
									<NumberInput
										ariaLabel={t('levelAria', { name: hero.name })}
										compact
										disabled={!saveData}
										onCommit={(value) =>
											updateValue(['heroCollection', 'heroes', hero.heroId, 'level'], value)
										}
										selectOnFocus
										value={level}
									/>
								</EditorTableCell>
								<EditorTableCell className='py-2 sm:w-px sm:min-w-45'>
									<MobileCellLabel>{tTable('gildedLevel')}</MobileCellLabel>
									<NumberInput
										ariaLabel={t('gildedLevelAria', { name: hero.name })}
										compact
										disabled={!saveData}
										// Gilds come in ones and tens, not thousands.
										increments={gildIncrements}
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
