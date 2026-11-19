import { type FC } from 'react';

import { cn } from 'cn';

interface Props {
	title: string;
	onClick: () => void;
	className?: string;
	disabled?: boolean;
	/**
	 * `primary` (default) is the accent-tinted action that ends a save step.
	 * `neutral` wears the input colours (inset fill, themed line, plain text)
	 * for a secondary action that sits among form controls, such as Unlock All.
	 */
	variant?: 'primary' | 'neutral';
}

const variantClasses = {
	primary:
		'border-primary-line bg-primary-surface text-(--color-primary-text) shadow-[var(--shadow-raised)] hover:border-(--color-primary) hover:bg-(--color-primary-soft) active:bg-(--color-primary-surface)',
	neutral:
		'border-(--color-line) bg-(--color-surface-inset) text-(--color-fg) hover:border-(--color-line-strong)'
} as const;

/**
 * The one action a save card is asking for — full-width and accent-tinted so it
 * reads as the end of the step.
 *
 * Same accent recipe as `Button variant='primary'`, on the `--color-primary-*`
 * tokens and `--shadow-raised`.
 */
export const SaveDataButton: FC<Props> = ({ className, disabled, onClick, title, variant = 'primary' }) => (
	<button
		className={cn(
			'motion-press mt-8 flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border px-4 leading-none font-semibold whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] duration-150 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-1 focus-visible:outline-(--color-focus-ring) disabled:pointer-events-none disabled:opacity-45 disabled:shadow-none',
			variantClasses[variant],
			className
		)}
		disabled={disabled}
		onClick={onClick}
		type='button'
	>
		<p className='font-aeonik text-[13px] font-semibold uppercase'>{title}</p>
	</button>
);
