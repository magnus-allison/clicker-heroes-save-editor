import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: 'primary' | 'secondary' | 'subtle' | 'ghost';
	size?: 'sm' | 'md';
	fullWidth?: boolean;
};

/*
 * `primary` is the only variant that carries a solid accent fill — it marks the
 * one action a step is asking for, so there should never be two of them
 * competing in the same panel. Everything else is a neutral surface.
 *
 * Deliberately no `background-image` gradients here: a gradient paints over
 * `background-color`, which would silently swallow the hover colour these
 * variants (and the shared base class) rely on. Depth comes from the inset
 * highlight in `--shadow-raised` / `--shadow-accent` instead.
 */
const variantClasses = {
	primary:
		'border-(--color-primary-strong) bg-(--color-primary-fill) font-semibold text-(--color-primary-fg) shadow-[var(--shadow-accent)] hover:border-(--color-primary-strong) hover:bg-(--color-primary-strong) hover:text-(--color-primary-fg) hover:shadow-[var(--shadow-accent-hover)] active:bg-(--color-primary-fill)',
	secondary:
		'border-(--color-line-soft) bg-(--color-surface-sunken) text-(--color-fg-muted) shadow-[var(--shadow-raised)] hover:text-(--color-fg)',
	subtle:
		'border-(--color-line-subtle) bg-(--color-surface-muted) text-(--color-fg-muted) shadow-[var(--shadow-raised)] hover:bg-(--color-surface-sunken) hover:text-(--color-fg)',
	ghost:
		'border-transparent bg-transparent px-2.5 text-[11px] text-(--color-fg-dim) shadow-none hover:border-transparent hover:bg-(--color-surface-hover) hover:text-(--color-fg)'
} as const;

const sizeClasses = {
	sm: 'h-8 px-2.5 text-[11px]',
	md: 'h-10 px-4 text-[13px]'
} as const;

export const Button = ({
	children,
	className,
	fullWidth,
	size = 'md',
	type = 'button',
	variant = 'secondary',
	...props
}: Props) => {
	return (
		<button
			className={cn(
				'motion-press inline-flex items-center justify-center gap-2 rounded-(--radius-control) border bg-(--color-surface-strong) leading-none text-(--color-fg) transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-snap hover:border-(--color-line-strong) hover:bg-(--color-surface-hover) active:bg-(--color-surface-muted) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) disabled:cursor-not-allowed disabled:border-(--color-line-soft) disabled:bg-(--color-surface-sunken) disabled:text-(--color-fg-dim) disabled:shadow-none',
				variantClasses[variant],
				sizeClasses[size],
				fullWidth && 'w-full',
				className
			)}
			type={type}
			{...props}
		>
			{children}
		</button>
	);
};
