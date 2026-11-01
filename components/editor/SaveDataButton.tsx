import { type FC } from 'react';

import { cn } from 'cn';

interface Props {
	title: string;
	onClick: () => void;
	className?: string;
}

/**
 * The one action a save card is asking for — full-width and accent-tinted so it
 * reads as the end of the step.
 *
 * Same accent recipe as `Button variant='primary'`, on the `--color-primary-*`
 * tokens and `--shadow-raised`.
 */
export const SaveDataButton: FC<Props> = ({ className, onClick, title }) => (
	<button
		className={cn(
			'motion-press mt-8 flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-primary-line bg-primary-surface px-4 leading-none font-semibold whitespace-nowrap text-(--color-primary) shadow-[var(--shadow-raised)] transition-[background-color,border-color,color,box-shadow,transform] duration-150 hover:border-(--color-primary) hover:bg-(--color-primary-soft) active:bg-(--color-primary-surface) focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) focus-visible:outline-none',
			className
		)}
		onClick={onClick}
		type='button'
	>
		<p className='font-aeonik text-[13px] font-semibold uppercase'>{title}</p>
	</button>
);
