'use client';

import type { LucideIcon } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { BoundFieldControl } from '@/components/editor/BoundFieldControl';
import { useEditorText } from '@/components/editor/useEditorText';
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
import { useNumberFormat } from '@/components/ui/useNumberFormat';
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

export const OutsidersSection = ({ defaultOpen, icon, title }: Props) => {
	const t = useTranslations('editor.outsiders');
	const format = useNumberFormat();
	const tTable = useTranslations('editor.table');
	const { fieldLabel, resolve } = useEditorText();
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
			description={t('description')}
			icon={icon}
			title={title ?? t('title')}
		>
			<div className='space-y-6'>
				<div>
					<p className='mb-3 text-[11px] uppercase tracking-[0.08em] text-(--color-fg-dim)'>
						{t('soulTotals')}
					</p>
					<EditorTable label={t('soulTotals')}>
						<EditorTableBody>
							{ancientSoulFields.map((field) => (
								<EditorTableRow key={field.path.join('.')}>
									<EditorTableCell className='text-(--color-fg)'>{fieldLabel(field)}</EditorTableCell>
									<EditorTableCell className='min-w-55'>
										<BoundFieldControl
											kind={field.kind}
											label={fieldLabel(field)}
											path={field.path}
											selectOnFocus
										/>
									</EditorTableCell>
								</EditorTableRow>
							))}
						</EditorTableBody>
					</EditorTable>
				</div>

				<EditorTable label={t('tableLabel')}>
					<EditorTableHead>
						<tr>
							<EditorTableHeaderCell>{tTable('image')}</EditorTableHeaderCell>
							<EditorTableHeaderCell>{tTable('description')}</EditorTableHeaderCell>
							<EditorTableHeaderCell>{tTable('level')}</EditorTableHeaderCell>
							<EditorTableHeaderCell>{tTable('cost')}</EditorTableHeaderCell>
							<EditorTableHeaderCell>{tTable('spent')}</EditorTableHeaderCell>
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
										{format.large(stats.primary, OUTSIDER_EXPONENTIAL_ABOVE)}%{' '}
										{resolve({ key: `outsiders.bonus.${field.id}`, text: field.description })}
									</p>
									{field.capDescription && stats.secondary !== undefined ? (
										<p className='mt-1 leading-6 text-(--color-fg-secondary)'>
											{field.capLabel}
											{format.large(stats.secondary, OUTSIDER_EXPONENTIAL_ABOVE)}{' '}
											{resolve({ key: `outsiders.cap.${field.id}`, text: field.capDescription })}
										</p>
									) : null}
								</EditorTableCell>
								<EditorTableCell className='min-w-40 align-top'>
									<NumberInput
										ariaLabel={t('levelAria', { name: field.name })}
										disabled={!saveData}
										onCommit={(value) => updateValue(field.levelPath, value)}
										selectOnFocus
										value={level}
									/>
								</EditorTableCell>
								<EditorTableCell className='align-top text-(--color-fg)'>
									{t('cost', { amount: format.number(stats.spent) })}
								</EditorTableCell>
								<EditorTableCell className='min-w-40 align-top'>
									<NumberInput
										ariaLabel={t('spentAria', { name: field.name })}
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
