'use client';

import { ChevronDownIcon, type LucideIcon } from 'lucide-react';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';

import { AnchorLink } from '@/components/ui/AnchorLink';
import { PanelSection } from '@/components/ui/PanelSection';
import { cn } from 'cn';

type Props = {
	icon?: LucideIcon;
	title: string;
	description?: string;
	defaultOpen?: boolean;
	/**
	 * Makes the panel linkable as `#anchor`: a matching hash opens it and
	 * scrolls to it, and the header gets a button that copies the link. Keep it
	 * the same in every locale so shared links keep working.
	 */
	anchor?: string;
	children: ReactNode;
	className?: string;
	bodyClassName?: string;
};

export const CollapsiblePanel = ({
	anchor,
	bodyClassName,
	children,
	className,
	defaultOpen = true,
	icon: Icon,
	title
}: Props) => {
	const [isOpen, setIsOpen] = useState(defaultOpen);
	const bodyId = useId();
	const sectionRef = useRef<HTMLDivElement>(null);
	// Set when the hash targets this panel; the effect below scrolls once the
	// panel has rendered open, so the scroll lands on the laid-out section.
	const [scrollRequest, setScrollRequest] = useState<ScrollBehavior | null>(null);

	useEffect(() => {
		if (!anchor) {
			return;
		}

		const revealIfTargeted = (behavior: ScrollBehavior) => {
			if (decodeURIComponent(window.location.hash.slice(1)) === anchor) {
				setIsOpen(true);
				setScrollRequest(behavior);
			}
		};
		// A link opened fresh jumps straight there; a smooth scroll down a long
		// editor would take seconds. In-page hash changes can glide.
		const onHashChange = () => revealIfTargeted('smooth');

		revealIfTargeted('instant');
		window.addEventListener('hashchange', onHashChange);
		return () => window.removeEventListener('hashchange', onHashChange);
	}, [anchor]);

	useEffect(() => {
		if (scrollRequest) {
			sectionRef.current?.scrollIntoView({ behavior: scrollRequest, block: 'start' });
			setScrollRequest(null);
		}
	}, [scrollRequest]);

	return (
		<div className={cn('flex flex-col', anchor && 'scroll-mt-8')} id={anchor} ref={sectionRef}>
			{/* The header is a folder tab standing up off the panel's top-left
			    corner; `.glass-tab` joins it to the panel without a seam. */}
			<div className='group/header flex min-w-0 items-center gap-2'>
				<button
					aria-controls={bodyId}
					aria-expanded={isOpen}
					className='glass-tab relative z-10 flex min-w-0 cursor-pointer items-center gap-3 rounded-t-xl px-5 pt-3 pb-2.5 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-line-strong'
					onClick={() => setIsOpen((open) => !open)}
					type='button'
				>
					{Icon ? <Icon aria-hidden='true' className='h-4.5 w-4.5 shrink-0 text-fg pt-0.5' /> : null}
					<span className='font-aeonik min-w-0 text-[1.05rem] leading-snug font-semibold tracking-wide uppercase text-fg-strong [word-spacing:0.2em]'>
						{title}
					</span>
					<ChevronDownIcon
						aria-hidden='true'
						className={cn(
							'ml-1 h-4 w-4 shrink-0 text-fg-strong transition-transform duration-200 ease-snap',
							isOpen && 'rotate-180'
						)}
					/>
				</button>
				{anchor ? (
					<AnchorLink
						anchor={anchor}
						className='opacity-0 focus-visible:opacity-100 group-hover/header:opacity-100 [@media(hover:none)]:opacity-100'
						label={title}
					/>
				) : null}
			</div>
			{/* Closed, the panel shrinks to a strip under the tab, like a shut folder. */}
			<PanelSection className={cn('folder-panel rounded-tl-none', !isOpen && 'h-3 p-0', className)}>
				<div className={cn(!isOpen && 'hidden', bodyClassName)} id={bodyId}>
					{children}
				</div>
			</PanelSection>
		</div>
	);
};
