'use client';

import { ChevronDownIcon, type LucideIcon } from 'lucide-react';
import { useId, useState, type ReactNode } from 'react';

import { PanelSection } from '@/components/ui/PanelSection';
import { cn } from '@/lib/cn';

type Props = {
	icon?: LucideIcon;
	title: string;
	description?: string;
	defaultOpen?: boolean;
	children: ReactNode;
	className?: string;
	bodyClassName?: string;
};

export const CollapsiblePanel = ({
	bodyClassName,
	children,
	className,
	defaultOpen = true,
	icon: Icon,
	title
}: Props) => {
	const [isOpen, setIsOpen] = useState(defaultOpen);
	const bodyId = useId();

	return (
		<PanelSection className={className}>
			<button
				aria-controls={bodyId}
				aria-expanded={isOpen}
				className='-m-1 flex w-full cursor-pointer items-center gap-3 rounded-(--radius-control) p-1 text-left transition-colors duration-150 hover:text-fg-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-strong'
				onClick={() => setIsOpen((open) => !open)}
				type='button'
			>
				{Icon ? <Icon aria-hidden='true' className='h-4.5 w-4.5 shrink-0 text-fg pt-0.5' /> : null}
				<span className='min-w-0 flex-1'>
					<span className='font-aeonik block text-[1.05rem] font-semibold tracking-wide uppercase text-fg-strong [word-spacing:0.2em]'>
						{title}
					</span>
				</span>
				<ChevronDownIcon
					aria-hidden='true'
					className={cn(
						'h-4 w-4 shrink-0 text-(--color-fg-dim) transition-transform duration-200 ease-snap',
						isOpen && 'rotate-180 text-(--color-primary)'
					)}
				/>
			</button>
			<div className={cn('mt-4', !isOpen && 'hidden', bodyClassName)} id={bodyId}>
				{children}
			</div>
		</PanelSection>
	);
};
