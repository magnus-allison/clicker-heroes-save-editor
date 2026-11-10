import type { ReactNode } from 'react';

import { cn } from 'cn';

interface Props {
	children: ReactNode;
	className?: string;
}

/**
 * Every panel on the site, in the same frosted `glass-panel` treatment as the
 * site banner (see globals.css). That class sets the background and shadow
 * unlayered, so there is no point adding background or shadow utilities here.
 */
export const PanelSection = ({ children, className }: Props) => {
	return (
		<div
			className={cn(
				'glass-panel group flex w-full flex-col overflow-hidden rounded-2xl p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-strong',
				className
			)}
		>
			{children}
		</div>
	);
};
