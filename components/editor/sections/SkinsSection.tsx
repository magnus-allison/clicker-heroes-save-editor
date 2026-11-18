'use client';

import { cn } from 'cn';
import { CheckIcon, type LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
import { Pill } from '@/components/ui/Pill';

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
	const allUnlocked = saveData
		? autoClickerSkins.every((skin) => Boolean(getValueAtPath(saveData, ['autoclickerSkins', skin.id])))
		: false;

	return (
		<CollapsiblePanel anchor={anchor} defaultOpen={defaultOpen} icon={icon} title={t('title')}>
			<div className='space-y-6'>
				<div className='flex items-center justify-between gap-3'>
					<Pill
						className='disabled:border-transparent disabled:opacity-45 cursor-pointer'
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
					>
						{t('unlockAll')}
					</Pill>
				</div>

				<EditorTable label={t('tableLabel')}>
					<EditorTableHead>
						<tr>
							<EditorTableHeaderCell>{tTable('image')}</EditorTableHeaderCell>
							<EditorTableHeaderCell>{tTable('skinName')}</EditorTableHeaderCell>
							<EditorTableHeaderCell>{tTable('unlocked')}</EditorTableHeaderCell>
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
									<div className='flex justify-start'>
										<Checkbox
											ariaLabel={t('unlockedAria', { name: skin.name })}
											checked={Boolean(getValueAtPath(saveData, ['autoclickerSkins', skin.id]))}
											disabled={!saveData}
											onCheckedChange={(checked) => updateValue(['autoclickerSkins', skin.id], checked)}
										/>
									</div>
								</EditorTableCell>
							</EditorTableRow>
						))}
					</EditorTableBody>
				</EditorTable>

				<div>
					<p className='text-[11px] uppercase tracking-[0.08em] text-(--color-fg-dim)'>{t('currentSkin')}</p>
					<div
						aria-label={t('currentSkin')}
						className='mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3'
						role='radiogroup'
					>
						{autoClickerSkins.map((skin) => {
							const isSelected = selectedSkinId === skin.id;

							return (
								<button
									aria-checked={isSelected}
									className={cn(
										'group flex h-12 items-center gap-2.5 rounded-xl pr-3 pl-1.5 text-left shadow-card transition-[background-color,box-shadow,color] duration-150 focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45',
										isSelected
											? 'bg-(--color-primary-surface) text-(--color-fg-strong) shadow-[0_0_0_1px_var(--color-primary-line)]'
											: 'text-fg-dim enabled:hover:bg-(--color-surface-hover) enabled:hover:text-fg-strong enabled:hover:shadow-card-hover'
									)}
									disabled={!saveData}
									key={skin.id}
									onClick={() => updateValue(['currentAutoclickerSkin'], skin.id)}
									role='radio'
									type='button'
								>
									<span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-raised'>
										<EditorImage
											alt=''
											className='h-7 w-7 object-contain transition-transform duration-150 group-enabled:group-hover:scale-110'
											size={28}
											src={skin.imageSrc}
										/>
									</span>
									<span className='min-w-0 flex-1 truncate font-aeonik text-[13px] tracking-wide'>
										{skin.name}
									</span>
									{isSelected && (
										<CheckIcon aria-hidden='true' className='h-3.5 w-3.5 shrink-0 text-(--color-primary)' />
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
