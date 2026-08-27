import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

type Props = HTMLAttributes<HTMLSpanElement> & {
	isShining?: boolean;
	disabled?: boolean;
};

export const Pill = ({ children, className, isShining, disabled, ...props }: Props) => (
	<span
		className={cn(
			'group relative inline-flex h-6 items-center rounded-full p-px transition-all duration-300 bg-line',
			isShining && 'gradient-spin shadow-[0_0_15px_-5px_rgba(251,191,36,0.5)]',
			className,
			disabled && 'opacity-20 cursor-not-allowed pointer-events-none'
		)}
		{...props}
	>
		<span className='inline-flex h-full items-center rounded-full bg-surface-raised/90 px-2 text-[0.7rem] pt-[0.05rem] font-medium tracking-wide text-fg-strong transition-all duration-75 ease-in font-aeonik uppercase'>
			{children}
		</span>
	</span>
);
