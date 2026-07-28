import type { ReactNode } from 'react';
import { CircleHelp } from 'lucide-react';

import { Tooltip } from '@/components/ui/Tooltip';
import { cn } from '@/lib/cn';

type Props = {
	title: string;
	children: ReactNode;
	className?: string;
	placement?: 'top' | 'bottom';
	/**
	 * Match the height of an adjacent 40px control instead of the default
	 * inline 28px circle.
	 */
	size?: 'inline' | 'control';
};

/**
 * The help affordance used across the tools. Its previous incarnation exposed
 * `triggerClassName` / `contentClassName` / `titleClassName`, and every call
 * site overrode all three to the same values — those are now the defaults, so
 * help tooltips look the same wherever they appear.
 */
export const HelpToolTip = ({ children, className, placement, size = 'inline', title }: Props) => {
	return (
		<Tooltip
			className={className}
			// Help content contains selectable paths and links, so it has to
			// receive pointer events.
			contentClassName='pointer-events-auto'
			placement={placement}
			title={title}
			trigger={
				<button
					aria-label={title}
					className={cn(
						'group inline-flex items-center justify-center rounded-full border border-transparent bg-transparent transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) disabled:cursor-not-allowed disabled:opacity-45',
						size === 'control' ? 'h-10 min-h-10 w-10 min-w-10' : 'h-7 min-h-7 w-7 min-w-7'
					)}
					type='button'
				>
					<CircleHelp
						aria-hidden='true'
						className='h-4 w-4 opacity-40 transition group-hover:opacity-90 group-focus-visible:opacity-90'
						strokeWidth={2}
					/>
				</button>
			}
		>
			{children}
		</Tooltip>
	);
};
