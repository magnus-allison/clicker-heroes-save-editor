'use client';

import { useMemo } from 'react';

import { BoundFieldControl } from '@/components/editor/BoundFieldControl';
import { EditorImage } from '@/components/ui/EditorImage';
import { NumberInput } from '@/components/ui/NumberInput';
import { SectionCard } from '@/components/ui/SectionCard';
import { ancientSoulFields, getOutsiderStats, outsiderFields } from '@/lib/data/editor-config';
import { useSaveStore } from '@/lib/save-store';
import { getValueAtPath } from '@/lib/save-utils';

type Props = {
	defaultOpen?: boolean;
};

const formatOutsiderMetric = (value: number) => {
	if (Math.abs(value) < 100000) {
		return value.toFixed(2).replace(/\.?0+$/, '');
	}

	return value
		.toExponential(2)
		.replace('+', '')
		.replace(/\.?0+(e\d+)$/, '$1');
};

export const OutsidersSection = ({ defaultOpen }: Props) => {
	const saveData = useSaveStore((state) => state.saveData);
	const updateValue = useSaveStore((state) => state.updateValue);
	const outsiderRows = useMemo(
		() =>
			outsiderFields.map((field) => {
				const level = Number(getValueAtPath(saveData, field.levelPath) ?? 0);
				const spent = Number(getValueAtPath(saveData, field.spentPath) ?? 0);
				const stats = getOutsiderStats(field.id, level);

				return {
					field,
					level,
					spent,
					stats
				};
			}),
		[saveData]
	);

	return (
		<SectionCard
			defaultOpen={defaultOpen}
			description='Edit ancient soul values and the outsider levels that shape long-run progression.'
			title='Outsiders and Ancient Souls'
		>
			<div className='space-y-6'>
				<div>
					<p className='mb-3 text-[11px] uppercase tracking-[0.08em] text-(--color-text-dim)'>
						Ancient soul totals
					</p>
					<div className='overflow-hidden rounded-2xl border border-(--color-border)'>
						<div className='overflow-x-auto'>
							<table className='min-w-full border-collapse text-left text-[13px] text-(--color-text-secondary)'>
								<tbody className='bg-(--color-bg)'>
									{ancientSoulFields.map((field) => (
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

				<div className='overflow-hidden rounded-2xl border border-(--color-border)'>
					<div className='overflow-x-auto'>
						<table className='min-w-full border-collapse text-left text-[13px] text-(--color-text-secondary)'>
							<thead className='bg-(--color-table-header) text-[11px] uppercase tracking-[0.08em] text-(--color-text-dim)'>
								<tr>
									<th className='px-4 py-3'>Image</th>
									<th className='px-4 py-3'>Description</th>
									<th className='px-4 py-3'>Level</th>
									<th className='px-4 py-3'>Cost</th>
									<th className='px-4 py-3'>Spent</th>
								</tr>
							</thead>
							<tbody className='bg-(--color-bg)'>
								{outsiderRows.map(({ field, level, spent, stats }) => (
									<tr
										className='not-last:border-b not-last:border-(--color-border-subtle)'
										key={field.id}
									>
										<td className='px-4 py-3 align-top'>
											<EditorImage
												alt={field.name}
												className='h-12 w-12 object-contain'
												size={48}
												src={field.imageSrc}
											/>
										</td>
										<td className='px-4 py-3 align-top'>
											<p className='text-(--color-text)'>{field.name}</p>
											<p className='mt-1 leading-6 text-(--color-text-secondary)'>
												{field.bonusLabel}
												{formatOutsiderMetric(stats.primary)}% {field.description}
											</p>
											{field.capDescription && stats.secondary !== undefined ? (
												<p className='mt-1 leading-6 text-(--color-text-secondary)'>
													{field.capLabel}
													{stats.secondary.toFixed(2).replace(/\.?0+$/, '')}{' '}
													{field.capDescription}
												</p>
											) : null}
										</td>
										<td className='min-w-40 px-4 py-3 align-top'>
											<NumberInput
												disabled={!saveData}
												onCommit={(value) => updateValue(field.levelPath, value)}
												selectOnFocus
												value={level}
											/>
										</td>
										<td className='px-4 py-3 align-top text-(--color-text)'>
											{stats.spent.toLocaleString('en-US')} AS
										</td>
										<td className='min-w-40 px-4 py-3 align-top'>
											<NumberInput
												disabled={!saveData}
												onCommit={(value) => updateValue(field.spentPath, value)}
												selectOnFocus
												value={spent}
											/>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</SectionCard>
	);
};
