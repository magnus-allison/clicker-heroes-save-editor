import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '@/lib/cn';

type EditorTableProps = {
	children: ReactNode;
	className?: string;
	scrollerClassName?: string;
	tableClassName?: string;
	/** Accessible name. Required when the table has no visible caption above it. */
	label?: string;
};

type EditorTableHeadProps = ComponentPropsWithoutRef<'thead'>;
type EditorTableBodyProps = ComponentPropsWithoutRef<'tbody'>;
type EditorTableRowProps = ComponentPropsWithoutRef<'tr'>;
type EditorTableHeaderCellProps = ComponentPropsWithoutRef<'th'>;
type EditorTableCellProps = ComponentPropsWithoutRef<'td'>;

/**
 * The only table in the app. Every editor and tool table goes through these
 * pieces so that border radius, header treatment, row separators and cell
 * padding stay identical everywhere.
 */
export const EditorTable = ({
	children,
	className,
	label,
	scrollerClassName,
	tableClassName
}: EditorTableProps) => {
	return (
		<div className={cn('overflow-hidden rounded-(--radius-card) border border-(--color-line)', className)}>
			<div className={cn('overflow-x-auto', scrollerClassName)}>
				<table
					aria-label={label}
					className={cn(
						'min-w-full border-collapse text-left text-[13px] text-(--color-fg-secondary)',
						tableClassName
					)}
				>
					{children}
				</table>
			</div>
		</div>
	);
};

export const EditorTableHead = ({ children, className, ...props }: EditorTableHeadProps) => {
	return (
		<thead
			className={cn(
				'bg-(--color-surface-header) text-[11px] uppercase tracking-[0.08em] text-(--color-fg-dim)',
				className
			)}
			{...props}
		>
			{children}
		</thead>
	);
};

export const EditorTableBody = ({ children, className, ...props }: EditorTableBodyProps) => {
	return (
		<tbody className={cn('bg-(--color-surface)', className)} {...props}>
			{children}
		</tbody>
	);
};

/** Body row. Carries the single canonical row separator. */
export const EditorTableRow = ({ children, className, ...props }: EditorTableRowProps) => {
	return (
		<tr className={cn('border-t border-(--color-line-subtle) first:border-t-0', className)} {...props}>
			{children}
		</tr>
	);
};

/** Header cell. Always `scope="col"` so screen readers can associate columns. */
export const EditorTableHeaderCell = ({
	children,
	className,
	scope = 'col',
	...props
}: EditorTableHeaderCellProps) => {
	return (
		<th className={cn('px-3 py-3 font-semibold sm:px-4 font-aeonik', className)} scope={scope} {...props}>
			{children}
		</th>
	);
};

export const EditorTableCell = ({ children, className, ...props }: EditorTableCellProps) => {
	return (
		<td className={cn('px-3 py-3 align-middle sm:px-4', className)} {...props}>
			{children}
		</td>
	);
};
