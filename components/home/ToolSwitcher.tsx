'use client';

import { type KeyboardEvent, useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { cn } from 'cn';
import { tools } from '@/components/home/Tools';
import { Link } from '@/i18n/navigation';
import type { messages } from '@/messages';

type PageKey = keyof (typeof messages)['en']['common']['pages'];

/** Tools that have a page, in home page order. */
const switchableTools = tools.filter(
	(tool): tool is (typeof tools)[number] & { key: PageKey } => tool.tag !== 'comingSoon'
);

interface Props {
	page: PageKey;
	/** The heading's id and class, as `Breadcrumb` gives its other headings. */
	id: string;
	className: string;
}

/**
 * The tool name in the breadcrumb, as a button that opens a list of every other
 * tool. Links rather than a select, so crawlers still see the tool pages. On
 * phones the list anchors to the breadcrumb row (the nearest positioned
 * ancestor) so it has room; from `sm` up it sits under the name.
 */
export const ToolSwitcher = ({ page, id, className }: Props) => {
	const t = useTranslations('common');
	const listId = useId();
	const wrapperRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const listRef = useRef<HTMLUListElement>(null);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const closeOnOutsidePointer = (event: PointerEvent) => {
			if (!wrapperRef.current?.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('pointerdown', closeOnOutsidePointer);
		return () => document.removeEventListener('pointerdown', closeOnOutsidePointer);
	}, [isOpen]);

	const links = () => Array.from(listRef.current?.querySelectorAll('a') ?? []);

	const focusLink = (offset: number) => {
		const items = links();
		const index = items.indexOf(document.activeElement as HTMLAnchorElement);
		const next = index === -1 ? (offset > 0 ? 0 : items.length - 1) : index + offset;
		items[(next + items.length) % items.length]?.focus();
	};

	const onKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Escape' && isOpen) {
			setIsOpen(false);
			buttonRef.current?.focus();
		} else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
			event.preventDefault();
			if (!isOpen) {
				setIsOpen(true);
				// The list renders on the next frame.
				requestAnimationFrame(() => focusLink(event.key === 'ArrowDown' ? 1 : -1));
			} else {
				focusLink(event.key === 'ArrowDown' ? 1 : -1);
			}
		}
	};

	return (
		<div
			className='sm:relative'
			onBlur={(event) => {
				if (!event.currentTarget.contains(event.relatedTarget)) {
					setIsOpen(false);
				}
			}}
			onKeyDown={onKeyDown}
			ref={wrapperRef}
		>
			<h1 aria-current='page' className={className} id={id}>
				<button
					aria-controls={listId}
					aria-expanded={isOpen}
					className='group -mx-1 flex cursor-pointer items-center gap-1 rounded-radius-control px-1 uppercase transition-colors hover:text-fg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring'
					onClick={() => setIsOpen((open) => !open)}
					ref={buttonRef}
					type='button'
				>
					{t(`pages.${page}`)}
					<ChevronDown
						aria-hidden='true'
						className={cn(
							'h-4 w-4 shrink-0 text-fg-dim transition-transform duration-150 group-hover:text-fg-strong',
							isOpen && 'rotate-180'
						)}
					/>
				</button>
			</h1>
			<ul
				aria-label={t('breadcrumb.switchTool')}
				className={cn(
					'absolute top-full left-0 z-50 mt-2 max-h-[min(70vh,28rem)] w-72 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-xl border border-card-border bg-card-background p-1.5 shadow-popover',
					!isOpen && 'hidden'
				)}
				id={listId}
				ref={listRef}
			>
				{switchableTools.map(({ key, href, icon: Icon }) => {
					const isCurrent = key === page;

					return (
						<li key={key}>
							<Link
								aria-current={isCurrent ? 'page' : undefined}
								className={cn(
									'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-fg-secondary transition-colors hover:bg-surface-hover hover:text-fg-strong focus-visible:bg-surface-hover focus-visible:text-fg-strong focus-visible:outline-none',
									isCurrent && 'font-medium text-fg-strong'
								)}
								href={href}
								onClick={() => setIsOpen(false)}
							>
								<Icon aria-hidden='true' className='h-4 w-4 shrink-0 text-fg-dim' />
								<span className='flex-1'>{t(`pages.${key}`)}</span>
								{isCurrent ? (
									<Check aria-hidden='true' className='h-4 w-4 shrink-0 text-primary-text' />
								) : null}
							</Link>
						</li>
					);
				})}
			</ul>
		</div>
	);
};
