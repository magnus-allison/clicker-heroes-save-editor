import { BoundFieldControl } from '@/components/editor/BoundFieldControl';
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
					<p className='mb-3 text-[11px] uppercase tracking-[0.08em] text-(--color-text-dim)'>
						Summary
					</p>
					<div className='overflow-hidden rounded-2xl border border-(--color-border)'>
						<div className='overflow-x-auto'>
							<table className='min-w-full border-collapse text-left text-[13px] text-(--color-text-secondary)'>
								<tbody className='bg-(--color-bg)'>
									{mercenarySummaryFields.map((field) => (
										<tr
											className='not-last:border-b not-last:border-(--color-border-subtle)'
											key={field.path.join('.')}
										>
											<td className='px-4 py-3 text-(--color-text)'>{field.label}</td>
											<td className='min-w-55 px-4 py-3'>
												<BoundFieldControl
													kind={field.kind}
													path={field.path}
													selectOnFocus
												/>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>

				<div>
					<p className='mb-3 text-[11px] uppercase tracking-[0.08em] text-(--color-text-dim)'>
						Mercenary roster
					</p>
					<div className='overflow-hidden rounded-2xl border border-(--color-border)'>
						<div className='overflow-x-auto'>
							<table className='min-w-full border-collapse text-left text-[13px] text-(--color-text-secondary)'>
								<thead className='bg-(--color-table-header) text-[11px] uppercase tracking-[0.08em] text-(--color-text-dim)'>
									<tr>
										<th className='px-4 py-3'>Name</th>
										<th className='px-4 py-3'>Level</th>
										<th className='px-4 py-3'>Time to Die</th>
										<th className='px-4 py-3'>Bonus Lives</th>
									</tr>
								</thead>
								<tbody className='bg-(--color-bg)'>
									{mercenarySlots.map((slot) => (
										<tr
											className='not-last:border-b not-last:border-(--color-border-subtle)'
											key={slot.id}
										>
											<td className='min-w-55 px-4 py-3'>
												<BoundFieldControl
													kind='text'
													path={slot.namePath}
													selectOnFocus
												/>
											</td>
											<td className='min-w-40 px-4 py-3'>
												<NumberInput
													disabled={!saveData}
													onCommit={(value) => updateValue(slot.levelPath, value)}
													selectOnFocus
													value={Number(
														getValueAtPath(saveData, slot.levelPath) ?? 0
													)}
												/>
											</td>
											<td className='min-w-45 px-4 py-3'>
												<NumberInput
													disabled={!saveData}
													onCommit={(value) =>
														updateValue(slot.timeToDiePath, value)
													}
													selectOnFocus
													value={Number(
														getValueAtPath(saveData, slot.timeToDiePath) ?? 0
													)}
												/>
											</td>
											<td className='min-w-45 px-4 py-3'>
												<NumberInput
													disabled={!saveData}
													onCommit={(value) =>
														updateValue(slot.bonusLivesPath, value)
													}
													selectOnFocus
													value={Number(
														getValueAtPath(saveData, slot.bonusLivesPath) ?? 0
													)}
												/>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</SectionCard>
	);
};
