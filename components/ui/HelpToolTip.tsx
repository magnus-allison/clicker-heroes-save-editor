import type { ReactNode } from 'react';
import { CircleHelp } from 'lucide-react';

import { Tooltip } from '@/components/ui/Tooltip';

type Props = {
	title: string;
	children: ReactNode;
	className?: string;
	placement?: 'top' | 'bottom';
};

export const HelpToolTip = ({ children, className, placement, title }: Props) => {
	return (
		<Tooltip
			className={className}
			placement={placement}
			title={title}
			trigger={
				<button
					aria-label={title}
					className='inline-flex h-[38px] min-h-[38px] w-[38px] min-w-[38px] items-center justify-center self-stretch rounded-(--input-radius) border border-transparent bg-transparent transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) disabled:cursor-not-allowed disabled:border-transparent disabled:bg-transparent disabled:opacity-45'
					type='button'
				>
					<CircleHelp
						className='h-4 w-4 opacity-40 transition group-hover/tooltip:opacity-90'
						strokeWidth={2}
					/>
				</button>
			}
		>
			{children}
		</Tooltip>
	);
};
