import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

type Props = {
	title: string;
	description?: string;
	children: ReactNode;
	defaultOpen?: boolean;
	actions?: ReactNode;
	className?: string;
};

export const SectionCard = ({ actions, children, className, defaultOpen, description, title }: Props) => {
	return (
		<details
			className={cn(
				'group relative border-b border-(--color-border-subtle) last:border-b-0',
				className
			)}
			open={defaultOpen}
		>
			<summary
				className='grid list-none cursor-pointer grid-cols-[auto_minmax(0,1fr)] items-start gap-x-2 gap-y-1 bg-(--color-bg-elevated) px-4 py-3 text-[13px] text-(--color-text) transition hover:bg-(--color-bg-hover) group-open:bg-(--color-bg-elevated-2) group-open:text-(--color-text-strong) marker:hidden [&::-webkit-details-marker]:hidden'
				style={{ padding: '12px 15px', paddingRight: actions ? 72 : 15 }}
			>
				<span className='mt-0.5 text-[11px] text-(--color-text-dim) transition duration-200 group-open:rotate-90 group-open:opacity-60'>
					▶
				</span>
				<h2 className='min-w-0 text-[13px] text-(--color-text) group-open:text-(--color-text-strong)'>
					{title}
				</h2>
				{description ? (
					<span className='col-start-2 block text-[12px] text-(--color-text-muted)'>
						{description}
					</span>
				) : null}
			</summary>
			{actions ? <div className='absolute top-3 right-4 z-10'>{actions}</div> : null}
			<div className='bg-(--color-bg) px-4 py-4' style={{ padding: 16 }}>
				{children}
			</div>
		</details>
	);
};
