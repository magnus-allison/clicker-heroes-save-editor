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
	EditorTableImageHeaderCell,
	EditorTableRow
} from '@/components/ui/EditorTable';
import { achievementGroups, getAchievementImage } from '@/lib/data/achievements';
import { useSaveStore } from '@/lib/save-store';
import { getValueAtPath } from '@/lib/save-utils';

type Props = {
	/** Hash id that links straight to this section (see `CollapsiblePanel`). */
	anchor?: string;
	defaultOpen?: boolean;
	icon: LucideIcon;
	title: string;
};

export const AchievementsSection = ({ anchor, defaultOpen, icon, title }: Props) => {
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
		<CollapsiblePanel anchor={anchor} defaultOpen={defaultOpen} icon={icon} title={title}>
			<div className='grid gap-4 xl:grid-cols-2'>
				{achievementGroups.map((group) => (
					<EditorTable key={group.type}>
						{/* A `caption` rather than a heading above the table: it gives the
						    table an accessible name without a floating `h3`. */}
						<caption className='border-b border-(--color-banner-edge) bg-(--color-surface-inset) px-3 py-3 text-left font-aeonik text-[11px] font-semibold uppercase tracking-[0.11em] text-(--color-fg-muted) sm:px-4'>
							{groupCaption(group)}
						</caption>
						<EditorTableHead>
							<tr>
								<EditorTableImageHeaderCell>{tTable('image')}</EditorTableImageHeaderCell>
								<EditorTableHeaderCell>{tTable('description')}</EditorTableHeaderCell>
								<EditorTableHeaderCell className='text-right'>{tTable('unlocked')}</EditorTableHeaderCell>
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
										<div className='flex justify-end pt-1'>
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
		</CollapsiblePanel>
	);
};
