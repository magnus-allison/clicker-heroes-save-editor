import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

type Props = HTMLAttributes<HTMLSpanElement> & {
	/** Gold spinning-gradient border and glow. Off by default. */
	isShining?: boolean;
};

export const Pill = ({ children, className, isShining = false, ...props }: Props) => (
	<span
		className={cn(
			'group relative inline-flex h-6 items-center rounded-full p-px',
			isShining
				? 'gradient-spin shadow-[0_0_15px_-5px_rgba(251,191,36,0.5)]'
				: 'bg-(--color-line)',
			'transition-all duration-300',
			className
		)}
		{...props}
	>
		<span className='inline-flex h-full items-center rounded-full bg-(--color-surface-raised) px-2 text-[10px] font-bold tracking-wide text-(--color-fg-strong) transition-all duration-75 ease-in'>
			{children}
		</span>
	</span>
);
