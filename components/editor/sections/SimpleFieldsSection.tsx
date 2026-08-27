'use client';

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
import { HelpToolTip } from '@/components/ui/HelpToolTip';
import type { SimpleFieldConfig } from '@/lib/data/editor-config';
import type { LucideIcon } from 'lucide-react';
import { type FC } from 'react';

type Props = {
	icon?: LucideIcon;
	title: string;
	description?: string;
	fields: SimpleFieldConfig[];
	defaultOpen?: boolean;
};

export const SimpleFieldsSection: FC<Props> = ({ icon, title, description, fields, defaultOpen }) => {
	const showImageColumn = fields.some((field) => Boolean(field.imageSrc));

	return (
		<CollapsiblePanel defaultOpen={defaultOpen} description={description} icon={icon} title={title}>
			<EditorTable label={title} tableClassName='w-full table-fixed'>
				<colgroup>
					{showImageColumn ? <col className='w-18 sm:w-22' /> : null}
					<col className='w-[28%] sm:w-52' />
					<col className='w-[52%] sm:w-120' />
				</colgroup>
				<EditorTableHead>
					<tr>
						{showImageColumn ? <EditorTableHeaderCell>Image</EditorTableHeaderCell> : null}
						<EditorTableHeaderCell>Item</EditorTableHeaderCell>
						<EditorTableHeaderCell className='text-left sm:text-right'>Amount</EditorTableHeaderCell>
					</tr>
				</EditorTableHead>
				<EditorTableBody>
					{fields.map((field) => (
						<EditorTableRow key={field.path.join('.')}>
							{showImageColumn ? (
								<EditorTableCell>
									{field.imageSrc ? (
										<EditorImage
											alt={field.label}
											className='h-11 w-11 object-contain'
											size={44}
											src={field.imageSrc}
										/>
									) : (
										<div className='h-11 w-11 rounded-(--radius-control) border border-dashed border-(--color-line-soft) bg-(--color-surface-sunken)' />
									)}
								</EditorTableCell>
							) : null}
							<EditorTableCell>
								<div className='flex min-w-0 items-center gap-3'>
									<span className='min-w-0 text-[13px] text-(--color-fg)'>{field.label}</span>
									{field.help ? (
										<HelpToolTip title={field.help.title}>
											<p>{field.help.body}</p>
										</HelpToolTip>
									) : null}
								</div>
							</EditorTableCell>
							<EditorTableCell>
								<BoundFieldControl
									allowMissing={field.allowMissing}
									inputClassName={field.inputClassName}
									kind={field.kind}
									label={field.label}
									options={field.options}
									path={field.path}
									selectOnFocus
								/>
							</EditorTableCell>
						</EditorTableRow>
					))}
				</EditorTableBody>
			</EditorTable>
		</CollapsiblePanel>
	);
};
