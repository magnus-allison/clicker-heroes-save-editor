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
	EditorTableRow
} from '@/components/ui/EditorTable';
import { NumberInput } from '@/components/ui/NumberInput';
import { orderedHeroes } from '@/lib/data/heroes';
import { useSaveStore } from '@/lib/save-store';
import { getValueAtPath } from '@/lib/save-utils';

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
				<EditorTableHead>
					<tr>
						<EditorTableHeaderCell>{tTable('image')}</EditorTableHeaderCell>
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
								className={
									isGilded
										? 'border-(--color-gilded-line) bg-(--color-gilded-surface) text-(--color-gold)'
										: undefined
								}
								key={hero.heroId}
							>
								<EditorTableCell>
									<EditorImage
										alt={hero.name}
										className='h-12 w-12 object-contain'
										size={48}
										src={imageSrc}
									/>
								</EditorTableCell>
								<EditorTableCell>
									<p className={isGilded ? 'text-(--color-gold)' : 'text-(--color-fg)'}>{hero.name}</p>
									{isGilded ? (
										<p className='mt-1 text-[11px] uppercase tracking-[0.08em] text-(--color-gold)'>
											{getGildedLabel(epicLevel)}
										</p>
									) : null}
								</EditorTableCell>
								<EditorTableCell className='min-w-45'>
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
								<EditorTableCell className='min-w-45'>
									<NumberInput
										ariaLabel={t('gildedLevelAria', { name: hero.name })}
										compact
										disabled={!saveData}
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
