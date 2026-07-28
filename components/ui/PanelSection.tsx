import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

interface Props {
	children: ReactNode;
	className?: string;
}

/**
 * Outermost card on a page. Use `SectionCard` for collapsible groups nested
 * inside one of these.
 */
export const PanelSection = ({ children, className }: Props) => {
	return (
		<div
			className={cn(
				'w-full overflow-hidden rounded-(--radius-panel) border border-(--color-line) bg-(--color-surface-raised) shadow-[var(--shadow-card)]',
				className
			)}
		>
			{children}
		</div>
	);
};
