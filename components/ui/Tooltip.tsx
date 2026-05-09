import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

type Props = {
	title: string;
	trigger: ReactNode;
	children: ReactNode;
	className?: string;
	triggerClassName?: string;
	placement?: 'top' | 'bottom';
};

export const Tooltip = ({
	children,
	className,
	title,
	trigger,
	triggerClassName,
	placement = 'bottom'
}: Props) => {
	const placementClassName =
		placement === 'top'
			? 'bottom-[calc(100%+8px)] translate-y-0 translate-x-0 opacity-0 group-hover/tooltip:-translate-y-1 group-hover/tooltip:opacity-100 group-focus-within/tooltip:-translate-y-1 group-focus-within/tooltip:opacity-100'
			: 'top-[calc(100%+8px)] translate-y-1 opacity-0 group-hover/tooltip:translate-y-0 group-hover/tooltip:opacity-100 group-focus-within/tooltip:translate-y-0 group-focus-within/tooltip:opacity-100';

	return (
		<div
			className={cn('group/tooltip relative inline-flex hover:z-[100] focus-within:z-[100]', className)}
		>
			<div className={triggerClassName}>{trigger}</div>
			<div
				className={cn(
					'pointer-events-none absolute left-0 z-[1000] flex w-[min(520px,calc(100vw-2rem))] flex-col gap-1 rounded-(--input-radius) border border-(--color-border-hover) bg-(--color-bg-elevated) p-3 text-left text-[12px] leading-6 text-(--color-text-secondary) shadow-[0_2px_8px_var(--color-shadow)] transition duration-150',
					placementClassName
				)}
			>
				<p className='border-b border-(--color-border) pb-1.5 text-[12px] uppercase tracking-[0.08em] text-(--color-text)'>
					{title}
				</p>
				<div className='space-y-2'>{children}</div>
			</div>
		</div>
	);
};
