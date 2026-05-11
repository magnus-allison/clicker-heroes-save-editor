import posthog from 'posthog-js';

import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { EditorImage } from '@/components/ui/EditorImage';
import { SectionCard } from '@/components/ui/SectionCard';
import { autoClickerSkins } from '@/lib/data/editor-config';
import { useSaveStore } from '@/lib/save-store';
import { getValueAtPath, setValueAtPath } from '@/lib/save-utils';

type Props = {
	showToast: (message: string) => void;
	defaultOpen?: boolean;
};

export const SkinsSection = ({ defaultOpen, showToast }: Props) => {
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
		<SectionCard
			defaultOpen={defaultOpen}
			description='Pick the current skin and toggle which auto clicker skins are unlocked.'
			title='Auto Clicker Skins'
		>
			<div className='space-x-6'>
				<div className='flex items-center justify-between gap-3'>
					<p className='text-[11px] uppercase tracking-[0.08em] text-(--color-text-dim)'>
						Unlocked skins
					</p>
					<Button
						className='disabled:border-transparent'
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
						size='sm'
						variant='ghost'
					>
						Unlock All
					</Button>
				</div>

				<div className='my-2 overflow-hidden border border-(--color-border)'>
					<div className='overflow-x-auto'>
						<table className='min-w-full border-collapse text-left text-[13px] text-(--color-text-secondary)'>
							<thead className='bg-(--color-bg-elevated) text-[11px] uppercase tracking-[0.08em] text-(--color-text-dim)'>
								<tr>
									<th className='px-4 py-3'>Image</th>
									<th className='px-4 py-3'>Skin Name</th>
									<th className='px-4 py-3'>Unlocked</th>
								</tr>
							</thead>
							<tbody className='bg-(--color-bg)'>
								{autoClickerSkins.map((skin) => (
									<tr
										className='not-last:border-b not-last:border-(--color-border-subtle)'
										key={skin.id}
									>
										<td className='px-4 py-3'>
											<EditorImage
												alt={skin.name}
												className='h-11 w-11 object-contain'
												size={44}
												src={skin.imageSrc}
											/>
										</td>
										<td className='px-4 py-3 text-(--color-text)'>{skin.name}</td>
										<td className='px-4 py-3'>
											<div className='flex justify-start'>
												<Checkbox
													checked={Boolean(
														getValueAtPath(saveData, [
															'autoclickerSkins',
															skin.id
														])
													)}
													disabled={!saveData}
													onCheckedChange={(checked) =>
														updateValue(['autoclickerSkins', skin.id], checked)
													}
												/>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				<div className='mt-4 mb-2'>
					<p className='text-[11px] uppercase tracking-[0.08em] text-(--color-text-dim)'>
						Current skin
					</p>
					<div className='mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4'>
						{autoClickerSkins.map((skin) => {
							const isSelected = selectedSkinId === skin.id;

							return (
								<button
									className={`border px-3 py-3 text-left transition ${
										isSelected
											? 'border-(--color-primary-border) bg-(--color-selected-bg)'
											: 'border-(--color-border) bg-(--color-bg-soft) hover:border-(--color-border-hover)'
									}`}
									disabled={!saveData}
									key={skin.id}
									onClick={() => updateValue(['currentAutoclickerSkin'], skin.id)}
									type='button'
								>
									<EditorImage
										alt={skin.name}
										className='mx-auto h-16 w-16 object-contain'
										size={64}
										src={skin.imageSrc}
									/>
									<p className='mt-3 text-center text-[12px] text-(--color-text-secondary)'>
										{skin.name}
									</p>
								</button>
							);
						})}
					</div>
				</div>
			</div>
		</SectionCard>
	);
};
