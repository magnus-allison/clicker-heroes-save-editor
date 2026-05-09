'use client';

import { useId, useState } from 'react';

import { cn } from '@/lib/cn';
import { formatNumber, parseNumberish, sanitizeNumberInput } from '@/lib/save-utils';

type Props = {
	value: number | string;
	onCommit: (value: number) => void;
	ariaLabel?: string;
	className?: string;
	disabled?: boolean;
	id?: string;
	name?: string;
	placeholder?: string;
	selectOnFocus?: boolean;
	allowDecimal?: boolean;
};

export const NumberInput = ({
	allowDecimal = true,
	ariaLabel,
	className,
	disabled,
	id,
	name,
	onCommit,
	placeholder,
	selectOnFocus,
	value
}: Props) => {
	const generatedId = useId();
	const [draftValue, setDraftValue] = useState(String(value ?? ''));
	const [isFocused, setIsFocused] = useState(false);
	const displayValue = isFocused ? draftValue : formatNumber(value);

	return (
		<input
			aria-label={ariaLabel ?? placeholder ?? 'Number input'}
			className={cn(
				'h-10 min-w-40 w-full rounded-(--input-radius) border border-(--color-border) bg-(--color-bg) px-2.5 text-[13px] text-(--color-text) outline-none transition placeholder:text-(--color-text-dim) hover:border-(--color-border-hover) focus:border-(--color-border-hover) focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) disabled:cursor-not-allowed disabled:border-(--color-border-soft) disabled:bg-(--color-bg-soft) disabled:text-(--color-text-dim)',
				className
			)}
			disabled={disabled}
			id={id ?? generatedId}
			inputMode={allowDecimal ? 'decimal' : 'numeric'}
			name={name}
			onBlur={() => {
				setIsFocused(false);
				const nextValue = parseNumberish(draftValue);
				onCommit(nextValue);
				setDraftValue(String(nextValue));
			}}
			onChange={(event) => {
				setDraftValue(sanitizeNumberInput(event.target.value, allowDecimal));
			}}
			onFocus={(event) => {
				setIsFocused(true);
				setDraftValue(String(value ?? ''));
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
	);
};
