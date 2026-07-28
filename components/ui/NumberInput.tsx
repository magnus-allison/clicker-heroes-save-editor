'use client';

import { useId, useRef, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { formatNumber, parseNumberish, sanitizeNumberInput } from '@/lib/save-utils';

const incrementOptions = [
	{ label: '+10', amount: 10 },
	{ label: '+100', amount: 100 },
	{ label: '+1k', amount: 1000 }
] as const;

type Props = {
	value: number | string;
	onCommit: (value: number) => void;
	ariaLabel?: string;
	className?: string;
	compact?: boolean;
	disabled?: boolean;
	id?: string;
	name?: string;
	placeholder?: string;
	selectOnFocus?: boolean;
	allowDecimal?: boolean;
	inputClassName?: string;
};

export const NumberInput = ({
	allowDecimal = true,
	ariaLabel,
	className,
	compact = false,
	disabled,
	id,
	inputClassName,
	name,
	onCommit,
	placeholder,
	selectOnFocus,
	value
}: Props) => {
	const generatedId = useId();
	const [draftValue, setDraftValue] = useState(String(value ?? ''));
	const [isFocused, setIsFocused] = useState(false);
	const draftValueRef = useRef(draftValue);
	const displayValue = isFocused ? draftValue : formatNumber(value);

	const updateDraftValue = (nextValue: string) => {
		draftValueRef.current = nextValue;
		setDraftValue(nextValue);
	};

	// No effect syncing `draftValue` to `value`: the draft is only ever read
	// while focused, `onFocus` seeds it from `value`, and `handleIncrement`
	// reads `value` directly when unfocused. Syncing in an effect just caused
	// a cascading re-render on every keystroke committed upstream.

	const commitValue = (nextValue: number) => {
		onCommit(nextValue);
		updateDraftValue(String(nextValue));
	};

	const handleIncrement = (amount: number) => {
		const baseValue = isFocused
			? parseNumberish(draftValueRef.current)
			: parseNumberish(String(value ?? '0'));
		commitValue(baseValue + amount);
	};

	return (
		<div
			className={cn(
				'flex w-full flex-wrap gap-1.5 sm:ml-auto sm:flex-nowrap sm:items-stretch',
				compact ? 'sm:w-73.5' : 'sm:max-w-full sm:w-fit'
			)}
		>
			<input
				aria-label={ariaLabel ?? placeholder ?? 'Number input'}
				className={cn(
					'h-10 w-full min-w-0 rounded-(--radius-control) border border-(--color-line) bg-(--color-surface) px-2.5 text-(--color-fg) outline-none transition placeholder:text-(--color-fg-dim) hover:border-(--color-line-strong) focus:border-(--color-line-strong) focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) disabled:cursor-not-allowed disabled:border-(--color-line-soft) disabled:bg-(--color-surface-sunken) disabled:text-(--color-fg-dim) sm:w-auto sm:flex-1',
					inputClassName || 'text-[13px]',
					compact ? 'sm:min-w-0' : 'sm:min-w-34',
					className
				)}
				disabled={disabled}
				id={id ?? generatedId}
				inputMode={allowDecimal ? 'decimal' : 'numeric'}
				name={name}
				onBlur={() => {
					setIsFocused(false);
					const nextValue = parseNumberish(draftValueRef.current);
					commitValue(nextValue);
				}}
				onChange={(event) => {
					updateDraftValue(sanitizeNumberInput(event.target.value, allowDecimal));
				}}
				onFocus={(event) => {
					setIsFocused(true);
					updateDraftValue(String(value ?? ''));
					if (selectOnFocus) {
						event.currentTarget.select();
					}
				}}
				onKeyDown={(event) => {
					if (event.key === 'Enter') {
						event.currentTarget.blur();
					}
				}}
				placeholder={placeholder}
				type='text'
				value={displayValue}
			/>
			{incrementOptions.map((option) => (
				<Button
					aria-label={`Increase by ${option.amount}`}
					className='flex-none px-2'
					disabled={disabled}
					key={option.amount}
					onPointerDown={(event) => {
						event.preventDefault();
						handleIncrement(option.amount);
					}}
					onKeyDown={(event) => {
						if (event.key === 'Enter' || event.key === ' ') {
							event.preventDefault();
							handleIncrement(option.amount);
						}
					}}
					variant='secondary'
				>
					{option.label}
				</Button>
			))}
		</div>
	);
};
