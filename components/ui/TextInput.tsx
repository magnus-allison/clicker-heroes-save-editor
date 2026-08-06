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
	/** Let the user drag-resize a `multiline` field vertically. */
	resizable?: boolean;
	/** Ignored when `multiline` is set. */
	type?: 'text' | 'email';
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
	resizable,
	rows = 4,
	selectOnFocus,
	type = 'text',
	value
}: Props) => {
	const generatedId = useId();
	const [draftValue, setDraftValue] = useState(value);
	const [isFocused, setIsFocused] = useState(false);
	const displayValue = isFocused ? draftValue : value;

	const sharedClassName = cn(
		'w-full rounded-(--radius-control) border border-(--color-line) bg-(--color-surface) px-2.5 text-[13px] text-(--color-fg) outline-none transition placeholder:text-(--color-fg-dim) hover:border-(--color-line-strong) focus:border-(--color-line-strong) focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) disabled:cursor-not-allowed disabled:border-(--color-line-soft) disabled:bg-(--color-surface-sunken) disabled:text-(--color-fg-dim)',
		multiline ? 'py-2' : 'h-10',
		multiline && resizable && 'resize-y',
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
			type={type}
			value={displayValue}
		/>
	);
};
