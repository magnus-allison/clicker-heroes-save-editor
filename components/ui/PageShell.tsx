import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

type Props = {
	children: ReactNode;
	/**
	 * `wide` (default) is the tool/editor width. `narrow` is for text-led pages
	 * such as feedback and 404.
	 */
	width?: 'wide' | 'narrow';
	/**
	 * `tight` (default) stacks panels; `loose` separates the landing page's
	 * marketing sections.
	 */
	spacing?: 'tight' | 'loose';
	className?: string;
};

export const PageShell = ({ children, className, spacing = 'tight', width = 'wide' }: Props) => {
	return (
		<div className='flex min-h-screen w-full justify-center overflow-x-hidden p-5 sm:p-10'>
			<main
				className={cn(
					'flex w-full flex-col',
					width === 'narrow' ? 'max-w-4xl' : 'max-w-6xl',
					spacing === 'loose' ? 'gap-10' : 'gap-3',
					className
				)}
			>
				{children}
			</main>
		</div>
	);
};
