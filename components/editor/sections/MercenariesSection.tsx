'use client';

import type { LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { BoundFieldControl } from '@/components/editor/BoundFieldControl';
import { useEditorText } from '@/components/editor/useEditorText';
import { CollapsiblePanel } from '@/components/ui/CollapsiblePanel';
import {
	EditorTable,
	EditorTableBody,
	EditorTableCell,
	EditorTableHead,
	EditorTableHeaderCell,
	EditorTableRow
} from '@/components/ui/EditorTable';
import { NumberInput } from '@/components/ui/NumberInput';
import { ToolLink } from '@/components/ui/ToolLink';
import { mercenarySlots, mercenarySummaryFields } from '@/lib/data/editor-config';
import { useSaveStore } from '@/lib/save-store';
import { getValueAtPath } from '@/lib/save-utils';

type Props = {
	defaultOpen?: boolean;
	icon?: LucideIcon;
	title?: string;
};

export const MercenariesSection = ({ defaultOpen, icon, title }: Props) => {
	const t = useTranslations('editor.mercenaries');
	const tTable = useTranslations('editor.table');
	const { fieldLabel } = useEditorText();
	const saveData = useSaveStore((state) => state.saveData);
	const updateValue = useSaveStore((state) => state.updateValue);

	return (
		<CollapsiblePanel description={t('description')} icon={icon} title={title ?? t('title')}>
			<div className='space-y-6'>
				<div>
					<ToolLink href='/tools/mercenary-viewer'>{t('viewDetails')}</ToolLink>
				</div>

				<div>
					<p className='mb-3 text-[11px] uppercase tracking-[0.08em] text-(--color-fg-dim)'>{t('summary')}</p>
					<EditorTable label={t('summaryLabel')}>
						<EditorTableBody>
							{mercenarySummaryFields.map((field) => (
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

				<div>
					<p className='mb-3 text-[11px] uppercase tracking-[0.08em] text-(--color-fg-dim)'>{t('roster')}</p>
					<EditorTable label={t('roster')}>
						<EditorTableHead>
							<tr>
								<EditorTableHeaderCell>{tTable('name')}</EditorTableHeaderCell>
								<EditorTableHeaderCell>{tTable('level')}</EditorTableHeaderCell>
								<EditorTableHeaderCell>{tTable('timeToDie')}</EditorTableHeaderCell>
								<EditorTableHeaderCell>{tTable('bonusLives')}</EditorTableHeaderCell>
							</tr>
						</EditorTableHead>
						<EditorTableBody>
							{mercenarySlots.map((slot) => (
								<EditorTableRow key={slot.id}>
									<EditorTableCell className='min-w-55'>
										<BoundFieldControl
											kind='text'
											label={t('nameAria', { number: slot.id + 1 })}
											path={slot.namePath}
											selectOnFocus
										/>
									</EditorTableCell>
									<EditorTableCell className='min-w-40'>
										<NumberInput
											ariaLabel={t('levelAria', { number: slot.id + 1 })}
											disabled={!saveData}
											onCommit={(value) => updateValue(slot.levelPath, value)}
											selectOnFocus
											value={Number(getValueAtPath(saveData, slot.levelPath) ?? 0)}
										/>
									</EditorTableCell>
									<EditorTableCell className='min-w-45'>
										<NumberInput
											ariaLabel={t('timeToDieAria', { number: slot.id + 1 })}
											disabled={!saveData}
											onCommit={(value) => updateValue(slot.timeToDiePath, value)}
											selectOnFocus
											value={Number(getValueAtPath(saveData, slot.timeToDiePath) ?? 0)}
										/>
									</EditorTableCell>
									<EditorTableCell className='min-w-45'>
										<NumberInput
											ariaLabel={t('bonusLivesAria', { number: slot.id + 1 })}
											disabled={!saveData}
											onCommit={(value) => updateValue(slot.bonusLivesPath, value)}
											selectOnFocus
											value={Number(getValueAtPath(saveData, slot.bonusLivesPath) ?? 0)}
										/>
									</EditorTableCell>
								</EditorTableRow>
							))}
						</EditorTableBody>
					</EditorTable>
				</div>
			</div>
		</CollapsiblePanel>
	);
};
