'use client';

import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

type Props = {
	checked: boolean;
	disabled?: boolean;
	id?: string;
	label?: ReactNode;
	ariaLabel?: string;
	onCheckedChange: (checked: boolean) => void;
	className?: string;
};

export const Checkbox = ({ ariaLabel, checked, className, disabled, id, label, onCheckedChange }: Props) => {
	return (
		<label
			className={cn(
				'inline-flex items-center gap-2 text-(--color-text-secondary) transition',
				label &&
					'rounded-(--input-radius) border border-(--color-border-subtle) bg-(--color-bg-elevated) px-2.5 py-1.5 hover:border-(--color-border) hover:bg-(--color-bg-elevated-2)',
				disabled && 'cursor-not-allowed opacity-60',
				className
			)}
		>
			<input
				aria-label={ariaLabel ?? (typeof label === 'string' ? label : 'Toggle option')}
				checked={checked}
				className='h-[18px] w-[18px] accent-(--color-primary-check)'
				disabled={disabled}
				id={id}
				onChange={(event) => onCheckedChange(event.target.checked)}
				type='checkbox'
			/>
			{label ? <span className='text-[13px] text-(--color-text-secondary)'>{label}</span> : null}
		</label>
	);
};
