'use client';

import type { FocusEvent, MouseEvent, ReactNode } from 'react';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/cn';

type Props = {
	title: string;
	trigger: ReactNode;
	children: ReactNode;
	className?: string;
	contentClassName?: string;
	titleClassName?: string;
	triggerClassName?: string;
	placement?: 'top' | 'bottom';
};

export const Tooltip = ({
	children,
	className,
	contentClassName,
	titleClassName,
	title,
	trigger,
	triggerClassName,
	placement = 'bottom'
}: Props) => {
	const tooltipId = useId();
	const wrapperRef = useRef<HTMLDivElement>(null);
	const tooltipRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [position, setPosition] = useState<{
		left: number;
		top: number;
		placement: 'top' | 'bottom';
	} | null>(null);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const updatePosition = () => {
			const wrapper = wrapperRef.current;
			const tooltip = tooltipRef.current;

			if (!wrapper || !tooltip) {
				return;
			}

			const wrapperRect = wrapper.getBoundingClientRect();
			const tooltipRect = tooltip.getBoundingClientRect();
			const viewportWidth = window.innerWidth;
			const viewportHeight = window.innerHeight;
			const margin = 16;
			const gap = 8;
			const fitsAbove = wrapperRect.top - tooltipRect.height - gap >= margin;
			const fitsBelow = wrapperRect.bottom + tooltipRect.height + gap <= viewportHeight - margin;
			const resolvedPlacement =
				placement === 'top'
					? fitsAbove || !fitsBelow
						? 'top'
						: 'bottom'
					: !fitsBelow && fitsAbove
						? 'top'
						: 'bottom';
			const top =
				resolvedPlacement === 'top'
					? wrapperRect.top - tooltipRect.height - gap
					: wrapperRect.bottom + gap;
			const left = Math.min(
				Math.max(wrapperRect.left, margin),
				Math.max(margin, viewportWidth - tooltipRect.width - margin)
			);

			setPosition({ left, top, placement: resolvedPlacement });
		};

		updatePosition();

		window.addEventListener('resize', updatePosition);
		window.addEventListener('scroll', updatePosition, true);

		return () => {
			window.removeEventListener('resize', updatePosition);
			window.removeEventListener('scroll', updatePosition, true);
		};
	}, [isOpen, placement]);

	const handleMouseEnter = (_event: MouseEvent<HTMLDivElement>) => {
		setIsOpen(true);
	};

	const handleMouseLeave = (_event: MouseEvent<HTMLDivElement>) => {
		setIsOpen(false);
	};

	const handleFocus = () => {
		setIsOpen(true);
	};

	const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
		if (wrapperRef.current?.contains(event.relatedTarget as Node | null)) {
			return;
		}

		setIsOpen(false);
	};

	const portalMarkup =
		isOpen && typeof document !== 'undefined'
			? createPortal(
					<div
						className={cn(
							'pointer-events-none fixed z-1000 flex w-[min(520px,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] flex-col gap-1 rounded-(--input-radius) border border-(--color-border-hover) bg-(--color-bg-elevated) p-3 text-left text-[12px] leading-6 text-(--color-text-secondary) shadow-[0_2px_8px_var(--color-shadow)] transition duration-150',
							position?.placement === 'top' ? '-translate-y-1' : 'translate-y-0.5',
							contentClassName
						)}
						id={tooltipId}
						ref={tooltipRef}
						role='tooltip'
						style={{
							left: position?.left ?? 16,
							top: position?.top ?? 16,
							visibility: position ? 'visible' : 'hidden'
						}}
					>
						<p
							className={cn(
								'border-b border-(--color-border) pb-1.5 text-[12px] uppercase tracking-[0.08em] text-(--color-text) font-semibold',
								titleClassName
							)}
						>
							{title}
						</p>
						<div className='space-y-2'>{children}</div>
					</div>,
					document.body
				)
			: null;

	return (
		<>
			<div
				className={cn('relative inline-flex', className)}
				onBlurCapture={handleBlur}
				onFocusCapture={handleFocus}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				ref={wrapperRef}
			>
				<div aria-describedby={isOpen ? tooltipId : undefined} className={triggerClassName}>
					{trigger}
				</div>
			</div>
			{portalMarkup}
		</>
	);
};
