'use client';

import { Checkbox } from '@/components/ui/Checkbox';
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
import { achievementGroups, getAchievementImage } from '@/lib/data/achievements';
import { useSaveStore } from '@/lib/save-store';
import { getValueAtPath } from '@/lib/save-utils';

type Props = {
	defaultOpen?: boolean;
};

export const AchievementsSection = ({ defaultOpen }: Props) => {
	const saveData = useSaveStore((state) => state.saveData);
	const updateValue = useSaveStore((state) => state.updateValue);

	return (
		<SectionCard
			defaultOpen={defaultOpen}
			description='Toggle achievements in groups and adjust the transcendent highest zone field.'
			title='Achievements'
		>
			<div className='space-y-6'>
				<EditorTable className='my-2' label='Transcension achievement fields'>
					<EditorTableHead>
						<tr>
							<EditorTableHeaderCell>Image</EditorTableHeaderCell>
							<EditorTableHeaderCell>Item</EditorTableHeaderCell>
							<EditorTableHeaderCell className='text-left sm:text-right'>
								Value
							</EditorTableHeaderCell>
						</tr>
					</EditorTableHead>
					<EditorTableBody>
						<EditorTableRow>
							<EditorTableCell>
								<EditorImage
									alt='Transcendent Highest Zone'
									className='h-11 w-11 object-contain'
									size={44}
									src='/assets/profile/Transcend_achieve.webp'
								/>
							</EditorTableCell>
							<EditorTableCell className='text-(--color-fg)'>
								Transcendent Highest Zone
							</EditorTableCell>
							<EditorTableCell className='min-w-55'>
								<NumberInput
									ariaLabel='Transcendent Highest Zone'
									disabled={!saveData}
									onCommit={(value) =>
										updateValue(['transcendentHighestFinishedZone'], value)
									}
									selectOnFocus
									value={Number(
										getValueAtPath(saveData, ['transcendentHighestFinishedZone']) ?? 0
									)}
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
								{group.label}-related achievements
							</caption>
							<EditorTableHead>
								<tr>
									<EditorTableHeaderCell>Image</EditorTableHeaderCell>
									<EditorTableHeaderCell>Description</EditorTableHeaderCell>
									<EditorTableHeaderCell>Unlocked</EditorTableHeaderCell>
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
											<p className='mt-1 leading-6 text-(--color-fg-secondary)'>
												{achievement[1]}
											</p>
											{achievement[2] ? (
												<p className='mt-1 italic text-(--color-fg-dim)'>
													{achievement[2]}
												</p>
											) : null}
											{achievement[3] ? (
												<p className='mt-1 text-(--color-primary-text)'>
													Reward: {achievement[3]}
												</p>
											) : null}
										</EditorTableCell>
										<EditorTableCell className='align-top'>
											<div className='flex justify-start pt-1'>
												<Checkbox
													ariaLabel={`${achievement[0]} unlocked`}
													checked={Boolean(
														getValueAtPath(saveData, ['achievements', id])
													)}
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
		</SectionCard>
	);
};
