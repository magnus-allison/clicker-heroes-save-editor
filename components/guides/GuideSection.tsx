import type { FC, ReactNode } from 'react';

interface Props {
	id: string;
	title: string;
	summary?: string;
	children: ReactNode;
}

/**
 * One numbered chapter of a guide. The `id` doubles as the jump-link target
 * used by `GuideIndex`, so it has to stay stable once a guide is published.
 */
export const GuideSection: FC<Props> = ({ children, id, summary, title }) => (
	<section
		aria-labelledby={`${id}-heading`}
		className='scroll-mt-6 border-t border-(--color-line-subtle) pt-6 first:border-t-0 first:pt-0'
		id={id}
	>
		<h2 className='text-[1.05rem] font-semibold leading-tight text-fg-strong' id={`${id}-heading`}>
			{title}
		</h2>
		{summary ? (
			<p className='mt-2 max-w-3xl text-[13px] leading-6 text-(--color-fg-muted)'>{summary}</p>
		) : null}
		<div className='mt-4'>{children}</div>
	</section>
);
