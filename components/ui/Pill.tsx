import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

type Props = HTMLAttributes<HTMLSpanElement>;

export const Pill = ({ children, className, ...props }: Props) => (
	<span
		className={cn(
			'inline-flex h-6 items-center rounded-full border border-amber-400 bg-amber-200/25 px-2 text-[10px] font-bold tracking-wide text-fg-strong shadow-[var(--shadow-raised)]',
			className
		)}
		{...props}
	>
		{children}
	</span>
);
