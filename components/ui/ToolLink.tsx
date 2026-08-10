import type { ReactNode } from 'react';

import Link from 'next/link';
import { ExternalLinkIcon } from 'lucide-react';

import { cn } from '@/lib/cn';

type Props = {
	href: string;
	children: ReactNode;
	className?: string;
};

/**
 * Link out to one of the read-only viewer tools from inside an editor section.
 *
 * Styled to match `Button`'s `secondary` variant, but it has to stay a `Link` so
 * navigation is a real anchor. Deliberately not the accent-filled `primary`
 * treatment: the section's own action (clearing data, editing fields) is the
 * primary one, and two accent fills in one card would leave neither reading as
 * the main one.
 *
 * Always opens in a new tab so the editor — and the save loaded into it — is
 * left untouched behind the viewer. The save store is per-tab in-memory state,
 * so the new tab starts at step 1 and the save has to be loaded there again.
 */
export const ToolLink = ({ children, className, href }: Props) => (
	<Link
		className={cn(
			'motion-press inline-flex h-10 items-center justify-center gap-2 rounded-(--radius-control) border border-(--color-line-soft) bg-(--color-surface-sunken) px-4 text-[13px] leading-none text-(--color-fg-muted) shadow-[var(--shadow-raised)] transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-snap hover:border-(--color-line-strong) hover:bg-(--color-surface-hover) hover:text-(--color-fg) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)',
			className
		)}
		href={href}
		rel='noopener noreferrer'
		target='_blank'
	>
		{children}
		<ExternalLinkIcon aria-hidden='true' className='h-3.5 w-3.5 shrink-0 opacity-70' />
		<span className='sr-only'>(opens in a new tab)</span>
	</Link>
);
