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
 * the panel's wash shows through, ringed by the same faint violet edge. Every
 * line inside the table (header rule, row separators) uses that same edge so
 * the grid reads as one frame; fills and text stay neutral so the colour never
 * takes over.
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
						// Tighten the gap between an image cell and the name/item beside it.
						// `w-px` shrinks an auto-layout image column to the image itself instead of
						// letting it take a share of the spare width. Fixed-layout tables size the
						// column through their `<colgroup>` (`w-15`) instead. `max-w-none` stops the
						// default `img { max-width: 100% }` resolving against that 1px and
						// collapsing the image.
						'[&_td:has(>img)]:w-px [&_td:has(>img)]:min-w-max [&_td:has(>img)]:pr-0 [&_td>img]:max-w-none [&_td:has(>img)+td]:pl-10',
						// Same for the header row when the image is the first column, so the
						// headings stay lined up with their cells.
						'[&:has(td:first-child>img)_th:first-child]:pr-0 [&:has(td:first-child>img)_th:nth-child(2)]:pl-10',
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
				'border-b border-(--color-banner-edge) bg-(--color-surface-inset) text-[13px] uppercase tracking-[0.11em] text-(--color-fg-muted)',
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
				'border-t border-(--color-banner-edge) transition-colors duration-150 first:border-t-0 hover:bg-[light-dark(rgba(0,0,0,0.03),rgba(0,0,0,0.25))]',
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

/**
 * Header for an image column. The column is only as wide as its picture, so
 * a visible label would run into the next heading; the picture speaks for
 * itself, and the label stays for screen readers.
 */
export const EditorTableImageHeaderCell = ({ children, ...props }: EditorTableHeaderCellProps) => {
	return (
		<EditorTableHeaderCell {...props}>
			<span className='sr-only'>{children}</span>
		</EditorTableHeaderCell>
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
