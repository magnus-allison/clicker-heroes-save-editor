'use client';

import type { ReactNode } from 'react';
import { useId } from 'react';

import { Check } from 'lucide-react';

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
	const generatedId = useId();
	const resolvedId = id ?? generatedId;
	const hasLabel = Boolean(label);

	return (
		<label
			htmlFor={resolvedId}
			className={cn(
				'inline-flex h-10 min-h-10 shrink-0 items-center rounded-(--input-radius) border border-(--color-border) bg-(--color-bg) text-(--color-text) outline-none transition hover:border-(--color-border-hover) focus-within:border-(--color-border-hover) focus-within:ring-2 focus-within:ring-(--color-focus-ring)',
				hasLabel ? 'min-w-10 gap-2 px-2.5' : 'w-10 min-w-10 justify-center',
				checked &&
					!disabled &&
					'border-(--color-primary-border) bg-(--color-bg-elevated-2) text-(--color-text-strong)',
				disabled
					? 'cursor-not-allowed border-(--color-border-soft) bg-(--color-bg-soft) text-(--color-text-dim)'
					: 'cursor-pointer',
				className
			)}
		>
			<input
				aria-label={ariaLabel ?? (typeof label === 'string' ? label : 'Toggle option')}
				checked={checked}
				className='sr-only'
				disabled={disabled}
				id={resolvedId}
				onChange={(event) => onCheckedChange(event.target.checked)}
				type='checkbox'
			/>
			<Check
				aria-hidden='true'
				className={cn(
					'h-3.5 w-3.5 flex-none transition',
					checked ? 'opacity-100 text-(--color-primary)' : 'opacity-0',
					disabled && checked && 'text-(--color-text-dim)'
				)}
				strokeWidth={3}
			/>
			{label ? (
				<span
					className={cn(
						'text-[13px] text-(--color-text)',
						checked && !disabled && 'text-(--color-text-strong)'
					)}
				>
					{label}
				</span>
			) : null}
		</label>
	);
};
