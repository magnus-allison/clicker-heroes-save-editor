'use client';

import { BoundFieldControl } from '@/components/editor/BoundFieldControl';
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
import { SectionCard } from '@/components/ui/SectionCard';
import type { SimpleFieldConfig } from '@/lib/data/editor-config';

type Props = {
	title: string;
	description?: string;
	fields: SimpleFieldConfig[];
	defaultOpen?: boolean;
	note?: string;
};

export const SimpleFieldsSection = ({ defaultOpen, description, fields, note, title }: Props) => {
	const showImageColumn = fields.some((field) => Boolean(field.imageSrc));

	return (
		<SectionCard defaultOpen={defaultOpen} description={description} title={title}>
			{note ? <p className='mb-4 text-[12px] leading-6 text-(--color-fg-secondary)'>{note}</p> : null}
			<EditorTable className='my-2' label={title} tableClassName='w-full table-fixed'>
				<colgroup>
					{showImageColumn ? <col className='w-18 sm:w-22' /> : null}
					<col className='w-[28%] sm:w-52' />
					<col className='w-[52%] sm:w-120' />
				</colgroup>
				<EditorTableHead>
					<tr>
						{showImageColumn ? <EditorTableHeaderCell>Image</EditorTableHeaderCell> : null}
						<EditorTableHeaderCell>Item</EditorTableHeaderCell>
						<EditorTableHeaderCell className='text-left sm:text-right'>
							Value
						</EditorTableHeaderCell>
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
		</SectionCard>
	);
};
