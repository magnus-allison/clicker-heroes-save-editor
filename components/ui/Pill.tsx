import type { HTMLAttributes } from 'react';

import { cn } from 'cn';

type Props = HTMLAttributes<HTMLSpanElement> & {
	isShining?: boolean;
	disabled?: boolean;
};

export const Pill = ({ children, className, isShining, disabled, ...props }: Props) => (
	<span
		className={cn(
			'group relative inline-flex h-6 items-center rounded-full p-px transition-all duration-300 bg-line',
			isShining && 'gradient-spin shadow-[0_0_16px_-4px_rgba(34,211,238,0.6)]',
			className,
			disabled && 'opacity-20 cursor-not-allowed pointer-events-none'
		)}
		{...props}
	>
		<span className='inline-flex h-full items-center gap-1 rounded-full bg-surface-raised px-2.5 pb-px text-[0.75rem] leading-none font-semibold tracking-wider text-fg-strong transition-all duration-75 ease-in font-aeonik uppercase'>
			{children}
		</span>
	</span>
);
