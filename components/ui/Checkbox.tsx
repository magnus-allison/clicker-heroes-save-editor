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
	const resolvedAriaLabel = ariaLabel ?? (typeof label === 'string' ? label : undefined);

	if (process.env.NODE_ENV !== 'production' && !resolvedAriaLabel) {
		// Previously this silently fell back to "Toggle option", which named
		// dozens of achievement and skin checkboxes identically.
		console.warn('Checkbox: pass `label` as a string or an explicit `ariaLabel`.');
	}

	return (
		<label
			htmlFor={resolvedId}
			className={cn(
				'inline-flex h-10 min-h-10 shrink-0 items-center rounded-(--radius-control) border border-(--color-line) bg-(--color-surface) text-(--color-fg) shadow-[inset_0_1px_2px_var(--color-shadow)] outline-none transition-[border-color,background-color,color,box-shadow] duration-150 ease-snap hover:border-(--color-line-strong) focus-within:border-(--color-primary-line) focus-within:ring-2 focus-within:ring-(--color-focus-ring)',
				hasLabel ? 'min-w-10 gap-2 px-2.5' : 'w-10 min-w-10 justify-center',
				checked &&
					!disabled &&
					'border-(--color-primary-line) bg-(--color-primary-surface) text-(--color-fg-strong) shadow-[var(--shadow-raised)]',
				disabled
					? 'cursor-not-allowed border-(--color-line-soft) bg-(--color-surface-sunken) text-(--color-fg-dim)'
					: 'cursor-pointer',
				className
			)}
		>
			<input
				aria-label={resolvedAriaLabel}
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
					// Scale-in on the tick is the only feedback for the `hasLabel: false`
					// variant, where the box itself barely changes size.
					'h-3.5 w-3.5 flex-none transition-[opacity,transform,color] duration-150 ease-spring',
					checked ? 'scale-100 text-(--color-primary) opacity-100' : 'scale-50 opacity-0',
					disabled && checked && 'text-(--color-fg-dim)'
				)}
				strokeWidth={3}
			/>
			{label ? (
				<span
					className={cn(
						'text-[13px] text-(--color-fg)',
						checked && !disabled && 'text-(--color-fg-strong)'
					)}
				>
					{label}
				</span>
			) : null}
		</label>
	);
};
