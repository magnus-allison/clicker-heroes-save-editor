'use client';

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
import { SectionCard } from '@/components/ui/SectionCard';
import { orderedHeroes } from '@/lib/data/heroes';
import { useSaveStore } from '@/lib/save-store';
import { getValueAtPath } from '@/lib/save-utils';

type Props = {
	defaultOpen?: boolean;
};

function getGildedLabel(epicLevel: number) {
	if (epicLevel <= 0) {
		return '';
	}

	return `${epicLevel}x Gilded (+${epicLevel * 50}%)`;
}

export const HeroesSection = ({ defaultOpen }: Props) => {
	const saveData = useSaveStore((state) => state.saveData);
	const updateValue = useSaveStore((state) => state.updateValue);
	const heroCollection =
		getValueAtPath<Record<string, { level?: number; epicLevel?: number }>>(saveData, [
			'heroCollection',
			'heroes'
		]) ?? {};

	return (
		<SectionCard
			defaultOpen={defaultOpen}
			description='Edit hero levels and gilded levels without digging through the raw save structure.'
			title='Heroes'
		>
			<EditorTable className='my-2' label='Heroes'>
				<EditorTableHead>
					<tr>
						<EditorTableHeaderCell>Image</EditorTableHeaderCell>
						<EditorTableHeaderCell>Hero</EditorTableHeaderCell>
						<EditorTableHeaderCell>Level</EditorTableHeaderCell>
						<EditorTableHeaderCell>Gilded Level</EditorTableHeaderCell>
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
									<p className={isGilded ? 'text-(--color-gold)' : 'text-(--color-fg)'}>
										{hero.name}
									</p>
									{isGilded ? (
										<p className='mt-1 text-[11px] uppercase tracking-[0.08em] text-(--color-gold)'>
											{getGildedLabel(epicLevel)}
										</p>
									) : null}
								</EditorTableCell>
								<EditorTableCell className='min-w-45'>
									<NumberInput
										ariaLabel={`${hero.name} level`}
										compact
										disabled={!saveData}
										onCommit={(value) =>
											updateValue(
												['heroCollection', 'heroes', hero.heroId, 'level'],
												value
											)
										}
										selectOnFocus
										value={level}
									/>
								</EditorTableCell>
								<EditorTableCell className='min-w-45'>
									<NumberInput
										ariaLabel={`${hero.name} gilded level`}
										compact
										disabled={!saveData}
										onCommit={(value) =>
											updateValue(
												['heroCollection', 'heroes', hero.heroId, 'epicLevel'],
												value
											)
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
		</SectionCard>
	);
};
