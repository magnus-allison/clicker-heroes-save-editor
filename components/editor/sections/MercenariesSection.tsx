'use client';

import { BoundFieldControl } from '@/components/editor/BoundFieldControl';
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
import { mercenarySlots, mercenarySummaryFields } from '@/lib/data/editor-config';
import { useSaveStore } from '@/lib/save-store';
import { getValueAtPath } from '@/lib/save-utils';

type Props = {
	defaultOpen?: boolean;
};

export const MercenariesSection = ({ defaultOpen }: Props) => {
	const saveData = useSaveStore((state) => state.saveData);
	const updateValue = useSaveStore((state) => state.updateValue);

	return (
		<SectionCard
			defaultOpen={defaultOpen}
			description='Tweak mercenary lifetime stats and the current party roster.'
			title='Mercenaries'
		>
			<div className='space-y-6'>
				<div>
					<p className='mb-3 text-[11px] uppercase tracking-[0.08em] text-(--color-fg-dim)'>
						Summary
					</p>
					<EditorTable label='Mercenary summary'>
						<EditorTableBody>
							{mercenarySummaryFields.map((field) => (
								<EditorTableRow key={field.path.join('.')}>
									<EditorTableCell className='text-(--color-fg)'>
										{field.label}
									</EditorTableCell>
									<EditorTableCell className='min-w-55'>
										<BoundFieldControl
											kind={field.kind}
											label={field.label}
											path={field.path}
											selectOnFocus
										/>
									</EditorTableCell>
								</EditorTableRow>
							))}
						</EditorTableBody>
					</EditorTable>
				</div>

				<div>
					<p className='mb-3 text-[11px] uppercase tracking-[0.08em] text-(--color-fg-dim)'>
						Mercenary roster
					</p>
					<EditorTable label='Mercenary roster'>
						<EditorTableHead>
							<tr>
								<EditorTableHeaderCell>Name</EditorTableHeaderCell>
								<EditorTableHeaderCell>Level</EditorTableHeaderCell>
								<EditorTableHeaderCell>Time to Die</EditorTableHeaderCell>
								<EditorTableHeaderCell>Bonus Lives</EditorTableHeaderCell>
							</tr>
						</EditorTableHead>
						<EditorTableBody>
							{mercenarySlots.map((slot) => (
								<EditorTableRow key={slot.id}>
									<EditorTableCell className='min-w-55'>
										<BoundFieldControl
											kind='text'
											label={`Mercenary ${slot.id + 1} name`}
											path={slot.namePath}
											selectOnFocus
										/>
									</EditorTableCell>
									<EditorTableCell className='min-w-40'>
										<NumberInput
											ariaLabel={`Mercenary ${slot.id + 1} level`}
											disabled={!saveData}
											onCommit={(value) => updateValue(slot.levelPath, value)}
											selectOnFocus
											value={Number(getValueAtPath(saveData, slot.levelPath) ?? 0)}
										/>
									</EditorTableCell>
									<EditorTableCell className='min-w-45'>
										<NumberInput
											ariaLabel={`Mercenary ${slot.id + 1} time to die`}
											disabled={!saveData}
											onCommit={(value) => updateValue(slot.timeToDiePath, value)}
											selectOnFocus
											value={Number(
												getValueAtPath(saveData, slot.timeToDiePath) ?? 0
											)}
										/>
									</EditorTableCell>
									<EditorTableCell className='min-w-45'>
										<NumberInput
											ariaLabel={`Mercenary ${slot.id + 1} bonus lives`}
											disabled={!saveData}
											onCommit={(value) => updateValue(slot.bonusLivesPath, value)}
											selectOnFocus
											value={Number(
												getValueAtPath(saveData, slot.bonusLivesPath) ?? 0
											)}
										/>
									</EditorTableCell>
								</EditorTableRow>
							))}
						</EditorTableBody>
					</EditorTable>
				</div>
			</div>
		</SectionCard>
	);
};
