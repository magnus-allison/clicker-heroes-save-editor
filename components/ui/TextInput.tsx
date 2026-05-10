'use client';

import type { FocusEvent } from 'react';
import { useId, useState } from 'react';

import { cn } from '@/lib/cn';

type Props = {
	value: string;
	onCommit?: (value: string) => void;
	onValueChange?: (value: string) => void;
	placeholder?: string;
	ariaLabel?: string;
	className?: string;
	disabled?: boolean;
	id?: string;
	name?: string;
	multiline?: boolean;
	rows?: number;
	readOnly?: boolean;
	selectOnFocus?: boolean;
};

export const TextInput = ({
	className,
	disabled,
	id,
	multiline,
	name,
	onCommit,
	onValueChange,
	placeholder,
	ariaLabel,
	readOnly,
	rows = 4,
	selectOnFocus,
	value
}: Props) => {
	const generatedId = useId();
	const [draftValue, setDraftValue] = useState(value);
	const [isFocused, setIsFocused] = useState(false);
	const displayValue = isFocused ? draftValue : value;

	const sharedClassName = cn(
		'w-full rounded-(--input-radius) border border-(--color-border) bg-(--color-bg) px-2.5 text-[13px] text-(--color-text) outline-none transition placeholder:text-(--color-text-dim) hover:border-(--color-border-hover) focus:border-(--color-border-hover) focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) disabled:cursor-not-allowed disabled:border-(--color-border-soft) disabled:bg-(--color-bg-soft) disabled:text-(--color-text-dim)',
		multiline ? 'py-2' : 'h-10',
		className
	);

	const handleFocus = (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setIsFocused(true);
		setDraftValue(value);
		if (selectOnFocus) {
			event.currentTarget.select();
		}
	};

	const handleChange = (nextValue: string) => {
		setDraftValue(nextValue);
		onValueChange?.(nextValue);
	};

	const handleBlur = () => {
		setIsFocused(false);
		onCommit?.(draftValue);
	};

	if (multiline) {
		return (
			<textarea
				aria-label={ariaLabel ?? placeholder ?? 'Text input'}
				className={sharedClassName}
				disabled={disabled}
				id={id ?? generatedId}
				name={name}
				onBlur={handleBlur}
				onChange={(event) => {
					handleChange(event.target.value);
				}}
				onFocus={handleFocus}
				placeholder={placeholder}
				readOnly={readOnly}
				rows={rows}
				value={displayValue}
			/>
		);
	}

	return (
		<input
			aria-label={ariaLabel ?? placeholder ?? 'Text input'}
			className={sharedClassName}
			disabled={disabled}
			id={id ?? generatedId}
			name={name}
			onBlur={handleBlur}
			onChange={(event) => {
				handleChange(event.target.value);
			}}
			onFocus={handleFocus}
			placeholder={placeholder}
			readOnly={readOnly}
			type='text'
			value={displayValue}
		/>
	);
};
