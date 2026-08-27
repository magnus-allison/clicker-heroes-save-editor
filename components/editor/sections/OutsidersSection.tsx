'use client';

import type { LucideIcon } from 'lucide-react';
import { useMemo } from 'react';

import { BoundFieldControl } from '@/components/editor/BoundFieldControl';
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
import { ancientSoulFields, getOutsiderStats, outsiderFields } from '@/lib/data/editor-config';
import { formatLargeNumber, formatNumber } from '@/lib/format';
import { useSaveStore } from '@/lib/save-store';
import { getValueAtPath } from '@/lib/save-utils';

type Props = {
	defaultOpen?: boolean;
	icon?: LucideIcon;
	title?: string;
};

/** Outsider bonuses grow past what plain grouping can show, so switch to
 *  exponential notation at the same threshold the section always used. */
const OUTSIDER_EXPONENTIAL_ABOVE = 100_000;

export const OutsidersSection = ({
	defaultOpen,
	icon,
	title = 'Outsiders and Ancient Souls'
}: Props) => {
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
		<CollapsiblePanel
			defaultOpen={defaultOpen}
			description='Edit ancient soul values and the outsider levels that shape long-run progression.'
			icon={icon}
			title={title}
		>
			<div className='space-y-6'>
				<div>
					<p className='mb-3 text-[11px] uppercase tracking-[0.08em] text-(--color-fg-dim)'>
						Ancient soul totals
					</p>
					<EditorTable label='Ancient soul totals'>
						<EditorTableBody>
							{ancientSoulFields.map((field) => (
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

				<EditorTable label='Outsiders'>
					<EditorTableHead>
						<tr>
							<EditorTableHeaderCell>Image</EditorTableHeaderCell>
							<EditorTableHeaderCell>Description</EditorTableHeaderCell>
							<EditorTableHeaderCell>Level</EditorTableHeaderCell>
							<EditorTableHeaderCell>Cost</EditorTableHeaderCell>
							<EditorTableHeaderCell>Spent</EditorTableHeaderCell>
						</tr>
					</EditorTableHead>
					<EditorTableBody>
						{outsiderRows.map(({ field, level, spent, stats }) => (
							<EditorTableRow key={field.id}>
								<EditorTableCell className='align-top'>
									<EditorImage
										alt={field.name}
										className='h-12 w-12 object-contain'
										size={48}
										src={field.imageSrc}
									/>
								</EditorTableCell>
								<EditorTableCell className='align-top'>
									<p className='text-(--color-fg)'>{field.name}</p>
									<p className='mt-1 leading-6 text-(--color-fg-secondary)'>
										{field.bonusLabel}
										{formatLargeNumber(stats.primary, OUTSIDER_EXPONENTIAL_ABOVE)}%{' '}
										{field.description}
									</p>
									{field.capDescription && stats.secondary !== undefined ? (
										<p className='mt-1 leading-6 text-(--color-fg-secondary)'>
											{field.capLabel}
											{formatLargeNumber(
												stats.secondary,
												OUTSIDER_EXPONENTIAL_ABOVE
											)}{' '}
											{field.capDescription}
										</p>
									) : null}
								</EditorTableCell>
								<EditorTableCell className='min-w-40 align-top'>
									<NumberInput
										ariaLabel={`${field.name} level`}
										disabled={!saveData}
										onCommit={(value) => updateValue(field.levelPath, value)}
										selectOnFocus
										value={level}
									/>
								</EditorTableCell>
								<EditorTableCell className='align-top text-(--color-fg)'>
									{formatNumber(stats.spent)} AS
								</EditorTableCell>
								<EditorTableCell className='min-w-40 align-top'>
									<NumberInput
										ariaLabel={`${field.name} ancient souls spent`}
										disabled={!saveData}
										onCommit={(value) => updateValue(field.spentPath, value)}
										selectOnFocus
										value={spent}
									/>
								</EditorTableCell>
							</EditorTableRow>
						))}
					</EditorTableBody>
				</EditorTable>
			</div>
		</CollapsiblePanel>
	);
};
