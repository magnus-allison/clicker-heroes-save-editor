import type { FC, ReactNode } from 'react';

import { AnchorLink } from '@/components/ui/AnchorLink';

interface Props {
	id: string;
	title: string;
	summary?: string;
	children: ReactNode;
}

/** One topic inside a `GuidePart`; sections are separated by the part's dividers. */
export const GuideSection: FC<Props> = ({ children, id, summary, title }) => (
	<section aria-labelledby={`${id}-heading`} className='scroll-mt-6 py-6 first:pt-0 last:pb-0' id={id}>
		<div className='group/heading flex items-center gap-1.5'>
			<h3
				className='font-aeonik text-[1.05rem] font-semibold leading-snug tracking-[0.01em] text-fg-strong'
				id={`${id}-heading`}
			>
				{title}
			</h3>
			<AnchorLink
				anchor={id}
				className='-my-1 opacity-0 focus-visible:opacity-100 group-hover/heading:opacity-100 [@media(hover:none)]:opacity-100'
				label={title}
			/>
		</div>
		{summary ? (
			<p className='mt-1.5 max-w-3xl text-[13px] leading-6 text-(--color-fg-muted)'>{summary}</p>
		) : null}
		<div className='mt-4'>{children}</div>
	</section>
);
