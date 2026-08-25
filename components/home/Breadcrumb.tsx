import Link from 'next/link';
import { ChevronRight, LayoutPanelTop } from 'lucide-react';
import { type FC, type ReactNode } from 'react';

import { cn } from '@/lib/cn';

export interface Crumb {
	/** Visible text. Omit on the home crumb to show the icon only. */
	label?: string;
	/** Renders the crumb as a link when set. The last crumb should leave this unset. */
	href?: string;
	/** Replaces the label. Used for the leading home icon. */
	icon?: ReactNode;
	/** Accessible name when the crumb renders as an icon only. */
	srLabel?: string;
}

interface Props {
	items: Crumb[];
	className?: string;
}

const crumbText = 'text-2xl font-medium leading-tight font-aeonik [word-spacing:0.2em]';

export const Breadcrumb: FC<Props> = ({ items, className }) => (
	<nav aria-label='Breadcrumb' className={cn('ml-3 flex flex-col', className)}>
		<ol className='flex flex-row items-center gap-1'>
			{items.map((item, index) => {
				const isLast = index === items.length - 1;
				const content = item.icon ?? item.label;
				// The trail replaces the page heading, so the current crumb keeps the
				// h2 the page would otherwise lose.
				const Tag = isLast ? 'h2' : 'span';
				/*
				 * Every crumb — icon or text — is the same 40px-tall, px-2 box, so
				 * `items-center` lands them all on one line. The leading crumb is
				 * pulled left by its own padding so the trail starts flush with the
				 * content below rather than 8px inside it.
				 */
				const box = cn(crumbText, 'flex h-10 shrink-0 items-center px-2', index === 0 && '-ml-2');

				return (
					<li key={item.href ?? item.label ?? index} className='flex flex-row items-center gap-1'>
						{index > 0 && <ChevronRight aria-hidden='true' className='h-5 w-5 shrink-0 text-fg-muted/60' />}
						{item.href && !isLast ? (
							<Link
								className={cn(
									box,
									'motion-press rounded-(--radius-control) text-(--color-fg-muted) transition-[background-color,color] duration-150 ease-snap hover:bg-(--color-surface-hover) hover:text-(--color-fg-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)'
								)}
								href={item.href}
							>
								{content}
								{!item.label && <span className='sr-only'>{item.srLabel ?? 'Home'}</span>}
							</Link>
						) : (
							<Tag
								aria-current={isLast ? 'page' : undefined}
								className={cn(box, isLast ? 'text-(--color-fg-strong)' : 'text-(--color-fg-muted)')}
							>
								{content}
								{!item.label && <span className='sr-only'>{item.srLabel ?? 'Home'}</span>}
							</Tag>
						)}
					</li>
				);
			})}
		</ol>
	</nav>
);

export const homeCrumb: Crumb = {
	href: '/',
	// Matched to the 24px crumb text, so the glyph reads at the same weight as
	// the labels next to it rather than sitting small in its own box.
	icon: <LayoutPanelTop aria-hidden='true' className='h-5 w-5 mt-0.5' />,
	srLabel: 'Home'
};
