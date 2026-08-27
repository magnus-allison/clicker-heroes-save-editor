'use client';

import posthog from 'posthog-js';

import { type LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/Button';
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
	showToast: (message: string) => void;
	defaultOpen?: boolean;
	icon?: LucideIcon;
};

export const SkinsSection = ({ defaultOpen, icon, showToast }: Props) => {
	const saveData = useSaveStore((state) => state.saveData);
	const updateSave = useSaveStore((state) => state.updateSave);
	const updateValue = useSaveStore((state) => state.updateValue);
	const selectedSkinId = Number(
		getValueAtPath(saveData, ['currentAutoclickerSkin']) ?? autoClickerSkins[0].id
	);
	const allUnlocked = saveData
		? autoClickerSkins.every((skin) => Boolean(getValueAtPath(saveData, ['autoclickerSkins', skin.id])))
		: false;

	return (
		<CollapsiblePanel defaultOpen={defaultOpen} icon={icon} title='Auto Clicker Skins'>
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
							showToast('All skins unlocked.');
							posthog.capture('skins_all_unlocked');
						}}
					>
						Unlock All
					</Pill>
				</div>

				<EditorTable label='Auto clicker skins'>
					<EditorTableHead>
						<tr>
							<EditorTableHeaderCell>Image</EditorTableHeaderCell>
							<EditorTableHeaderCell>Skin Name</EditorTableHeaderCell>
							<EditorTableHeaderCell>Unlocked</EditorTableHeaderCell>
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
											ariaLabel={`${skin.name} unlocked`}
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
					<p className='text-[11px] uppercase tracking-[0.08em] text-(--color-fg-dim)'>Current skin</p>
					<div className='mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4'>
						{autoClickerSkins.map((skin) => {
							const isSelected = selectedSkinId === skin.id;

							return (
								// A `Button` rather than a bare `<button>` so these picker
								// cards get the shared focus ring and disabled treatment.
								// Selection is the `selected` surface rather than the
								// accent-filled `primary` variant: this is a choice among
								// eight options, not the panel's main action.
								<Button
									aria-pressed={isSelected}
									className={
										isSelected
											? 'h-auto flex-col rounded-(--radius-card) border-(--color-primary-line) bg-(--color-surface-selected) px-3 py-3 text-left text-(--color-fg-strong)'
											: 'h-auto flex-col rounded-(--radius-card) px-3 py-3 text-left'
									}
									disabled={!saveData}
									key={skin.id}
									onClick={() => updateValue(['currentAutoclickerSkin'], skin.id)}
									variant='secondary'
								>
									<EditorImage
										alt={skin.name}
										className='mx-auto h-16 w-16 object-contain'
										size={64}
										src={skin.imageSrc}
									/>
									<span className='mt-3 block text-center text-[12px]'>{skin.name}</span>
								</Button>
							);
						})}
					</div>
				</div>
			</div>
		</CollapsiblePanel>
	);
};
