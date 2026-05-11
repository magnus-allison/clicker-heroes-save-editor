import type { ReactNode } from 'react';
import { CircleHelp } from 'lucide-react';

import { Tooltip } from '@/components/ui/Tooltip';
import { cn } from '@/lib/cn';

type Props = {
	title: string;
	children: ReactNode;
	className?: string;
	placement?: 'top' | 'bottom';
	triggerClassName?: string;
	contentClassName?: string;
	titleClassName?: string;
};

export const HelpToolTip = ({
	children,
	className,
	placement,
	title,
	triggerClassName,
	contentClassName,
	titleClassName
}: Props) => {
	return (
		<Tooltip
			className={className}
			contentClassName={contentClassName}
			titleClassName={titleClassName}
			placement={placement}
			title={title}
			trigger={
				<button
					aria-label={title}
					className={cn(
						'group inline-flex h-10 min-h-10 w-10 min-w-10 items-center justify-center self-stretch rounded-(--input-radius) border border-transparent bg-transparent transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) disabled:cursor-not-allowed disabled:border-transparent disabled:bg-transparent disabled:opacity-45',
						triggerClassName
					)}
					type='button'
				>
					<CircleHelp
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
