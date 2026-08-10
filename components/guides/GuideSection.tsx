import type { FC, ReactNode } from 'react';

interface Props {
	id: string;
	title: string;
	summary?: string;
	children: ReactNode;
}

export const GuideSection: FC<Props> = ({ children, id, summary, title }) => (
	<section aria-labelledby={`${id}-heading`} className='scroll-mt-8' id={id}>
		<h3 className='text-[0.95rem] font-semibold leading-tight text-fg-strong' id={`${id}-heading`}>
			{title}
		</h3>
		{summary ? (
			<p className='mt-1.5 max-w-3xl text-[13px] leading-6 text-(--color-fg-muted)'>{summary}</p>
		) : null}
		<div className='mt-3'>{children}</div>
	</section>
);
