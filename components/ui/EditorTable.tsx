import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from 'cn';

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
 *
 * Styled after the glass import/export panel: no solid fill of its own, so
 * the panel's wash shows through, ringed by the same faint violet edge. The
 * header and row lines stay neutral so the colour never takes over.
 */
export const EditorTable = ({
	children,
	className,
	label,
	scrollerClassName,
	tableClassName
}: EditorTableProps) => {
	return (
		<div
			className={cn('overflow-hidden rounded-(--radius-card) border border-(--color-banner-edge)', className)}
		>
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
				'border-b border-(--color-line-subtle) bg-(--color-surface-header)/50 text-[11px] uppercase tracking-[0.11em] text-(--color-fg-dim)',
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
		<tbody className={cn('bg-transparent', className)} {...props}>
			{children}
		</tbody>
	);
};

/** Body row. Carries the single canonical row separator. */
export const EditorTableRow = ({ children, className, ...props }: EditorTableRowProps) => {
	return (
		<tr
			className={cn(
				'border-t border-(--color-line-subtle) transition-colors duration-150 first:border-t-0 hover:bg-(--color-surface-hover)/60',
				className
			)}
			{...props}
		>
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

/** `never` is for tables that are cards at every width and have no header row. */
const cellLabelVisibility = { sm: 'sm:hidden', never: '' } as const;

/**
 * A column header shown inside its cell. Tables that stack their rows into
 * cards below `sm` hide `EditorTableHead` there (`max-sm:hidden`), so each
 * input needs its own label; tables that are cards at every width drop the
 * header row and keep the labels (`hideFrom='never'`).
 */
export const MobileCellLabel = ({
	children,
	hideFrom = 'sm'
}: {
	children: ReactNode;
	hideFrom?: keyof typeof cellLabelVisibility;
}) => {
	return (
		<span
			className={cn(
				'mb-1.5 block font-aeonik text-[11px] font-semibold uppercase tracking-[0.11em] text-(--color-fg-dim)',
				cellLabelVisibility[hideFrom]
			)}
		>
			{children}
		</span>
	);
};
