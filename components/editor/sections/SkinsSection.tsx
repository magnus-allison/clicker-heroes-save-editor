'use client';

import { cn } from 'cn';
import { CheckIcon, type LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { SaveDataButton } from '@/components/editor/SaveDataButton';
import { Checkbox } from '@/components/ui/Checkbox';
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
import { autoClickerSkins } from '@/lib/data/editor-config';
import { useSaveStore } from '@/lib/save-store';
import { getValueAtPath, setValueAtPath } from '@/lib/save-utils';

type Props = {
	/** Hash id that links straight to this section (see `CollapsiblePanel`). */
	anchor?: string;
	showToast: (message: string) => void;
	defaultOpen?: boolean;
	icon?: LucideIcon;
};

export const SkinsSection = ({ anchor, defaultOpen, icon, showToast }: Props) => {
	const saveData = useSaveStore((state) => state.saveData);
	const updateSave = useSaveStore((state) => state.updateSave);
	const updateValue = useSaveStore((state) => state.updateValue);
	const t = useTranslations('editor.skins');
	const tTable = useTranslations('editor.table');
	const selectedSkinId = Number(
		getValueAtPath(saveData, ['currentAutoclickerSkin']) ?? autoClickerSkins[0].id
	);
	const isUnlocked = (skinId: number) => Boolean(getValueAtPath(saveData, ['autoclickerSkins', skinId]));
	const allUnlocked = saveData ? autoClickerSkins.every((skin) => isUnlocked(skin.id)) : false;

	const setUnlocked = (skinId: number, unlocked: boolean) => {
		updateSave((current) => {
			let next = setValueAtPath(current, ['autoclickerSkins', skinId], unlocked);
			if (!unlocked && skinId === selectedSkinId) {
				next = setValueAtPath(next, ['currentAutoclickerSkin'], autoClickerSkins[0].id);
			}
			return next;
		});
	};

	return (
		<CollapsiblePanel anchor={anchor} defaultOpen={defaultOpen} icon={icon} title={t('title')}>
			<div className='space-y-6'>
				<div className='flex items-center justify-end gap-3'>
					<SaveDataButton
						className='mt-0 w-auto'
						disabled={!saveData || allUnlocked}
						onClick={() => {
							if (!saveData) {
								return;
							}

							updateSave((current) => {
								let next = current;
								autoClickerSkins.forEach((skin) => {
									next = setValueAtPath(next, ['autoclickerSkins', skin.id], true);
								});
								return next;
							});
							showToast(t('allUnlocked'));
						}}
						title={t('unlockAll')}
						variant='neutral'
					/>
				</div>

				<EditorTable label={t('tableLabel')} tableClassName='w-full table-fixed'>
					{/* The item tables' column widths, so names and images line up across sections. */}
					<colgroup>
						<col className='w-18 sm:w-22' />
						<col className='w-[28%] sm:w-52' />
						<col className='w-[52%] sm:w-120' />
					</colgroup>
					<EditorTableHead>
						<tr>
							<EditorTableHeaderCell>{tTable('image')}</EditorTableHeaderCell>
							<EditorTableHeaderCell>{tTable('skinName')}</EditorTableHeaderCell>
							<EditorTableHeaderCell className='text-right'>{tTable('unlocked')}</EditorTableHeaderCell>
						</tr>
					</EditorTableHead>
					<EditorTableBody>
						{autoClickerSkins.map((skin) => (
							<EditorTableRow key={skin.id}>
								<EditorTableCell>
									<EditorImage
										alt={skin.name}
										className='h-11 w-11 object-contain'
										size={44}
										src={skin.imageSrc}
									/>
								</EditorTableCell>
								<EditorTableCell className='text-(--color-fg)'>{skin.name}</EditorTableCell>
								<EditorTableCell>
									<div className='flex justify-end'>
										<Checkbox
											ariaLabel={t('unlockedAria', { name: skin.name })}
											checked={Boolean(getValueAtPath(saveData, ['autoclickerSkins', skin.id]))}
											disabled={!saveData}
											onCheckedChange={(checked) => setUnlocked(skin.id, checked)}
										/>
									</div>
								</EditorTableCell>
							</EditorTableRow>
						))}
					</EditorTableBody>
				</EditorTable>

				<div>
					<p className='font-aeonik text-[11px] font-semibold uppercase tracking-[0.08em] text-(--color-fg-dim)'>
						{t('currentSkin')}
					</p>
					<div aria-label={t('currentSkin')} className='mt-3 flex flex-wrap gap-2' role='radiogroup'>
						{autoClickerSkins.map((skin) => {
							const isSelected = selectedSkinId === skin.id;
							// Only owned skins can be worn. The selected tile stays enabled even
							// if an older save points at a locked skin, so it still shows.
							const isSelectable = isSelected || isUnlocked(skin.id);

							return (
								// Picture only: the name lives in the accessible label and the hover title.
								<button
									aria-checked={isSelected}
									aria-label={skin.name}
									className={cn(
										'group relative flex h-14 w-14 items-center justify-center rounded-(--radius-control) border bg-(--color-surface-inset) transition-[background-color,border-color] duration-150 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-1 focus-visible:outline-(--color-focus-ring) disabled:cursor-not-allowed disabled:opacity-45',
										isSelected
											? 'border-(--color-fg-dim) bg-(--color-surface-hover)'
											: 'border-(--color-line) enabled:hover:border-(--color-line-strong)'
									)}
									disabled={!saveData || !isSelectable}
									key={skin.id}
									onClick={() => updateValue(['currentAutoclickerSkin'], skin.id)}
									role='radio'
									title={skin.name}
									type='button'
								>
									<EditorImage alt='' className='h-10 w-10 object-contain' size={40} src={skin.imageSrc} />
									{isSelected && (
										<span className='absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-(--color-fg-dim) bg-(--color-background)'>
											<CheckIcon
												aria-hidden='true'
												className='h-2.5 w-2.5 text-(--color-fg-strong)'
												strokeWidth={3.5}
											/>
										</span>
									)}
								</button>
							);
						})}
					</div>
				</div>
			</div>
		</CollapsiblePanel>
	);
};
