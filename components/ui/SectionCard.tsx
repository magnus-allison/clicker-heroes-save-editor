import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/cn';

type Props = {
	title: string;
	description?: string;
	children: ReactNode;
	defaultOpen?: boolean;
	actions?: ReactNode;
	className?: string;
};

/**
 * Collapsible group inside a `PanelSection`.
 *
 * `actions` renders inside the summary row rather than absolutely positioned
 * over it, so it stays visible and clickable whether the card is open or shut.
 */
export const SectionCard = ({ actions, children, className, defaultOpen, description, title }: Props) => {
	return (
		<details
			className={cn('group border-b border-(--color-line-subtle) last:border-b-0', className)}
			open={defaultOpen}
		>
			{/*
			 * The left edge lights up in the accent colour while open, so the
			 * expanded card is findable at a glance in a long stack of them.
			 */}
			<summary className='relative grid cursor-pointer list-none grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-2 gap-y-1 bg-(--color-surface-muted) px-4 py-3 text-[13px] text-(--color-fg) transition-[background-color,color] duration-150 ease-snap marker:hidden before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-(--color-primary) before:opacity-0 before:transition-opacity before:duration-200 hover:bg-(--color-surface-hover) group-open:bg-(--color-surface-strong) group-open:text-(--color-fg-strong) group-open:before:opacity-100 [&::-webkit-details-marker]:hidden'>
				<ChevronRight
					aria-hidden='true'
					className='mt-0.5 h-3.5 w-3.5 shrink-0 text-(--color-fg-dim) transition-transform duration-200 ease-snap group-open:rotate-90 group-open:text-(--color-primary)'
				/>
				<h2 className='min-w-0 text-[13px] font-semibold text-(--color-fg) group-open:text-(--color-fg-strong)'>
					{title}
				</h2>
				{actions ? (
					// Stop clicks on the actions from toggling the <details>.
					<div
						className='col-start-3 row-start-1 -my-1 flex items-center'
						onClick={(event) => event.preventDefault()}
					>
						{actions}
					</div>
				) : null}
				{description ? (
					<span className='col-start-2 block text-[12px] text-(--color-fg-muted)'>{description}</span>
				) : null}
			</summary>
			<div className='border-t border-(--color-line-subtle) bg-(--color-surface) p-4'>
				{children}
			</div>
		</details>
	);
};
