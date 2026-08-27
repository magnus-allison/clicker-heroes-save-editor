import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

interface Props {
	children: ReactNode;
	className?: string;
}

export const PanelSection = ({ children, className }: Props) => {
	return (
		<div
			className={cn(
				'w-full overflow-hidden rounded-2xl bg-card-background group flex flex-col p-5 transition-shadow duration-300 shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-strong hover:shadow-card-hover',
				className
			)}
		>
			{children}
		</div>
	);
};
