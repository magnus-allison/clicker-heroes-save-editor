'use client';

import { useEffect, useId, useRef, useState } from 'react';

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

	useEffect(() => {
		if (!isFocused) {
			updateDraftValue(String(value ?? ''));
		}
	}, [isFocused, value]);

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
					'h-10 w-full min-w-0 rounded-(--input-radius) border border-(--color-border) bg-(--color-bg) px-2.5 text-(--color-text) outline-none transition placeholder:text-(--color-text-dim) hover:border-(--color-border-hover) focus:border-(--color-border-hover) focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) disabled:cursor-not-allowed disabled:border-(--color-border-soft) disabled:bg-(--color-bg-soft) disabled:text-(--color-text-dim) sm:w-auto sm:flex-1',
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
				<button
					aria-label={`Increase by ${option.amount}`}
					className='inline-flex h-10 flex-none items-center justify-center rounded-(--input-radius) border border-(--color-border-soft) bg-(--color-bg-elevated-2) px-2 text-sm! leading-none text-(--color-text-muted) transition-[background-color,border-color,color,box-shadow] duration-150 hover:border-(--color-border-hover) hover:bg-(--color-bg-hover) hover:text-(--color-text) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) disabled:cursor-not-allowed disabled:border-(--color-border-soft) disabled:bg-(--color-bg-soft) disabled:text-(--color-text-dim)'
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
					type='button'
				>
					{option.label}
				</button>
			))}
		</div>
	);
};
