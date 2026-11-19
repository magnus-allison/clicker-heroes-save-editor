'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';

import { PlusIcon } from 'lucide-react';
import { cn } from 'cn';
import { useTranslations } from 'next-intl';
import { formatNumber, parseNumberish, sanitizeNumberInput } from '@/lib/save-utils';

const defaultIncrements = [10, 100, 1_000, 10_000, 100_000, 1_000_000, 10_000_000, 100_000_000] as const;

const incrementLabel = (amount: number) => {
	if (amount >= 1_000_000_000) return `+${amount / 1_000_000_000}B`;
	if (amount >= 1_000_000) return `+${amount / 1_000_000}M`;
	if (amount >= 1_000) return `+${amount / 1_000}K`;

	return `+${amount}`;
};

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
	/** Extra classes for the wrapper around the input and its add menu. */
	wrapperClassName?: string;
	/** Amounts in the add menu beside the input. Defaults to +10, +100 and +1k. */
	increments?: readonly number[];
};

export const NumberInput = ({
	allowDecimal = true,
	ariaLabel,
	className,
	compact = false,
	disabled,
	id,
	increments = defaultIncrements,
	inputClassName,
	name,
	onCommit,
	placeholder,
	selectOnFocus,
	value,
	wrapperClassName
}: Props) => {
	const t = useTranslations('common.ui');
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
				'flex w-full gap-1.5 sm:ml-auto sm:items-stretch',
				compact ? 'sm:w-73.5' : 'sm:max-w-full sm:w-fit',
				wrapperClassName
			)}
		>
			<input
				aria-label={ariaLabel ?? placeholder ?? t('numberInput')}
				className={cn(
					'h-10 w-full min-w-0 rounded-(--radius-control) border border-(--color-line) bg-(--color-surface-inset) px-2.5 text-(--color-fg) outline-none transition-[color,background-color,border-color,box-shadow] duration-150 placeholder:text-(--color-fg-dim) hover:border-(--color-line-strong) focus:border-(--color-line-strong) focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-1 focus-visible:outline-(--color-focus-ring) disabled:cursor-not-allowed disabled:border-(--color-line-soft) disabled:bg-(--color-surface-sunken) disabled:text-(--color-fg-dim) flex-1 sm:w-auto',
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
			<AddMenu disabled={disabled} increments={increments} onAdd={handleIncrement} />
		</div>
	);
};

type AddMenuProps = {
	increments: readonly number[];
	disabled?: boolean;
	onAdd: (amount: number) => void;
};

/**
 * One `+` beside the input that opens the step amounts, instead of a row of
 * step buttons on every input. The menu uses the native popover, so it draws
 * in the top layer: tables clip their overflow, and an in-place dropdown would
 * be cut off. The browser closes it on an outside click or Escape; scrolling
 * or resizing closes it too, since it is placed once against the button. It
 * stays open between picks, so `+1k` can be pressed several times.
 */
const AddMenu = ({ disabled, increments, onAdd }: AddMenuProps) => {
	const menuId = useId();
	const buttonRef = useRef<HTMLButtonElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const menu = menuRef.current;
		const button = buttonRef.current;
		if (!isOpen || !menu || !button) {
			return;
		}

		// Right-aligned under the button, flipped above when there is no room below.
		const gap = 4;
		const anchor = button.getBoundingClientRect();
		const fitsBelow = anchor.bottom + gap + menu.offsetHeight <= window.innerHeight;
		const top = fitsBelow ? anchor.bottom + gap : anchor.top - gap - menu.offsetHeight;
		const left = Math.max(gap, anchor.right - menu.offsetWidth);
		menu.style.top = `${top}px`;
		menu.style.left = `${left}px`;
		// Invisible until placed, so it never flashes at the browser's default spot.
		menu.dataset.placed = '';
		menu.querySelector<HTMLButtonElement>('button')?.focus();

		const close = () => menu.hidePopover();
		window.addEventListener('scroll', close, { capture: true, passive: true });
		window.addEventListener('resize', close);
		return () => {
			delete menu.dataset.placed;
			window.removeEventListener('scroll', close, { capture: true });
			window.removeEventListener('resize', close);
		};
	}, [isOpen]);

	const moveFocus = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
			return;
		}
		event.preventDefault();
		const items = [...(menuRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? [])];
		const current = items.indexOf(document.activeElement as HTMLButtonElement);
		const step = event.key === 'ArrowDown' ? 1 : -1;
		items[(current + step + items.length) % items.length]?.focus();
	};

	return (
		<>
			<button
				aria-expanded={isOpen}
				aria-haspopup='menu'
				aria-label='Add to value'
				className={cn(
					'flex h-10 w-10 flex-none items-center justify-center rounded-(--radius-control) border border-(--color-line) bg-(--color-surface-inset) text-(--color-fg-muted) transition-[color,border-color] duration-150 hover:border-(--color-line-strong) hover:text-(--color-fg) focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-1 focus-visible:outline-(--color-focus-ring) disabled:cursor-not-allowed disabled:border-(--color-line-soft) disabled:bg-(--color-surface-sunken) disabled:text-(--color-fg-dim)',
					isOpen && 'border-(--color-line-strong) text-(--color-fg)'
				)}
				disabled={disabled}
				popoverTarget={menuId}
				ref={buttonRef}
				type='button'
			>
				<PlusIcon aria-hidden='true' className='h-4 w-4' strokeWidth={2.5} />
			</button>
			<div
				className='inset-auto m-0 min-w-24 rounded-(--radius-control) not-data-placed:invisible border border-(--color-line) bg-(--color-surface-menu) p-1 text-(--color-fg) shadow-(--shadow-popover)'
				id={menuId}
				onKeyDown={moveFocus}
				onToggle={(event) => setIsOpen(event.newState === 'open')}
				popover='auto'
				ref={menuRef}
				role='menu'
			>
				{increments.map((amount) => (
					<button
						aria-label={`Increase by ${amount}`}
						className='flex h-8 w-full items-center rounded-[4px] px-2.5 text-left text-[13px] tabular-nums text-(--color-fg-secondary) outline-none transition-colors duration-100 hover:bg-(--color-surface-menu-hover) hover:text-(--color-fg-strong) focus-visible:bg-(--color-surface-menu-hover) focus-visible:text-(--color-fg-strong)'
						key={amount}
						onClick={() => onAdd(amount)}
						// Focus follows the pointer, as in a native menu, so the item under
						// the mouse and the keyboard-focused item are always the same one.
						onPointerMove={(event) => event.currentTarget.focus()}
						role='menuitem'
						type='button'
					>
						{incrementLabel(amount)}
					</button>
				))}
			</div>
		</>
	);
};
