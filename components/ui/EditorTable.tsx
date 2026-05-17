import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '@/lib/cn';

type EditorTableProps = {
	children: ReactNode;
	className?: string;
	scrollerClassName?: string;
	tableClassName?: string;
};

type EditorTableHeadProps = ComponentPropsWithoutRef<'thead'>;
type EditorTableBodyProps = ComponentPropsWithoutRef<'tbody'>;

export const EditorTable = ({ children, className, scrollerClassName, tableClassName }: EditorTableProps) => {
	return (
		<div className={cn('overflow-hidden rounded-2xl border border-(--color-border)', className)}>
			<div className={cn('overflow-x-auto', scrollerClassName)}>
				<table
					className={cn(
						'min-w-full border-collapse text-left text-[13px] text-(--color-text-secondary)',
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
				'bg-(--color-table-header) text-[11px] uppercase tracking-[0.08em] text-(--color-text-dim)',
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
		<tbody className={cn('bg-(--color-bg)', className)} {...props}>
			{children}
		</tbody>
	);
};