'use client';

import type { LucideIcon } from 'lucide-react';
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
import { NumberInput } from '@/components/ui/NumberInput';
import { achievementGroups, getAchievementImage } from '@/lib/data/achievements';
import { useSaveStore } from '@/lib/save-store';
import { getValueAtPath } from '@/lib/save-utils';

type Props = {
	defaultOpen?: boolean;
	icon: LucideIcon;
	title: string;
};

export const AchievementsSection = ({ defaultOpen, icon, title }: Props) => {
	const saveData = useSaveStore((state) => state.saveData);
	const updateValue = useSaveStore((state) => state.updateValue);
	const t = useTranslations('editor.achievements');
	const tTable = useTranslations('editor.table');
	const has = t.has as (key: string) => boolean;
	const translate = t as unknown as (key: string) => string;
	const groupCaption = (group: { type: number; label: string }) => {
		const key = `groups.${group.type}`;
		return has(key) ? translate(key) : `${group.label}-related achievements`;
	};

	return (
		<CollapsiblePanel defaultOpen={defaultOpen} icon={icon} title={title}>
			<div className='space-y-6'>
				<EditorTable label={t('tableLabel')}>
					<EditorTableHead>
						<tr>
							<EditorTableHeaderCell>{tTable('image')}</EditorTableHeaderCell>
							<EditorTableHeaderCell>{tTable('item')}</EditorTableHeaderCell>
							<EditorTableHeaderCell className='text-left sm:text-right'>
								{tTable('value')}
							</EditorTableHeaderCell>
						</tr>
					</EditorTableHead>
					<EditorTableBody>
						<EditorTableRow>
							<EditorTableCell>
								<EditorImage
									alt={t('transcendentHighestZone')}
									className='h-11 w-11 object-contain'
									size={44}
									src='/assets/profile/Transcend_achieve.webp'
								/>
							</EditorTableCell>
							<EditorTableCell className='text-(--color-fg)'>{t('transcendentHighestZone')}</EditorTableCell>
							<EditorTableCell className='min-w-55'>
								<NumberInput
									ariaLabel={t('transcendentHighestZone')}
									disabled={!saveData}
									onCommit={(value) => updateValue(['transcendentHighestFinishedZone'], value)}
									selectOnFocus
									value={Number(getValueAtPath(saveData, ['transcendentHighestFinishedZone']) ?? 0)}
								/>
							</EditorTableCell>
						</EditorTableRow>
					</EditorTableBody>
				</EditorTable>

				<div className='grid gap-4 xl:grid-cols-2'>
					{achievementGroups.map((group) => (
						<EditorTable key={group.type}>
							{/* A `caption` rather than a heading above the table: it gives the
							    table an accessible name without a floating `h3`. */}
							<caption className='border-b border-(--color-line-subtle) bg-(--color-surface-muted) px-3 py-3 text-left text-[13px] text-(--color-fg) sm:px-4'>
								{groupCaption(group)}
							</caption>
							<EditorTableHead>
								<tr>
									<EditorTableHeaderCell>{tTable('image')}</EditorTableHeaderCell>
									<EditorTableHeaderCell>{tTable('description')}</EditorTableHeaderCell>
									<EditorTableHeaderCell>{tTable('unlocked')}</EditorTableHeaderCell>
								</tr>
							</EditorTableHead>
							<EditorTableBody>
								{group.items.map(({ achievement, id }) => (
									<EditorTableRow key={id}>
										<EditorTableCell className='align-top'>
											<EditorImage
												alt={achievement[0]}
												className='h-11 w-11 object-contain'
												size={44}
												src={getAchievementImage(achievement[4])}
											/>
										</EditorTableCell>
										<EditorTableCell className='align-top'>
											<p className='text-(--color-fg)'>{achievement[0]}</p>
											<p className='mt-1 leading-6 text-(--color-fg-secondary)'>{achievement[1]}</p>
											{achievement[2] ? (
												<p className='mt-1 italic text-(--color-fg-dim)'>{achievement[2]}</p>
											) : null}
											{achievement[3] ? (
												<p className='mt-1 text-(--color-primary-text)'>
													{t('reward', { reward: achievement[3] })}
												</p>
											) : null}
										</EditorTableCell>
										<EditorTableCell className='align-top'>
											<div className='flex justify-start pt-1'>
												<Checkbox
													ariaLabel={t('unlockedAria', { name: achievement[0] })}
													checked={Boolean(getValueAtPath(saveData, ['achievements', id]))}
													disabled={!saveData}
													onCheckedChange={(checked) => {
														if (!saveData) {
															return;
														}

														updateValue(['achievements', id], checked);
													}}
												/>
											</div>
										</EditorTableCell>
									</EditorTableRow>
								))}
							</EditorTableBody>
						</EditorTable>
					))}
				</div>
			</div>
		</CollapsiblePanel>
	);
};
