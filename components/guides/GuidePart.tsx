import type { FC, ReactNode } from 'react';

interface Props {
	id: string;
	/** Zero-padded part number rendered as an eyebrow above the title. */
	index: number;
	title: string;
	children: ReactNode;
}

/**
 * Top-level grouping for a guide. Parts carry the `h2`, so the `GuideSection`s
 * nested inside them drop to `h3` and the page keeps a single heading ramp.
 */
export const GuidePart: FC<Props> = ({ children, id, index, title }) => (
	<section aria-labelledby={`${id}-heading`} className='scroll-mt-8' id={id}>
		<div className='flex items-baseline gap-3 border-b border-(--color-line-soft) pb-2.5'>
			<span aria-hidden='true' className='text-[11px] uppercase tracking-[0.12em] text-(--color-fg-dim)'>
				Part {String(index).padStart(2, '0')}
			</span>
			<h2 className='text-[1.1rem] font-semibold leading-tight text-fg-strong' id={`${id}-heading`}>
				{title}
			</h2>
		</div>
		<div className='mt-5 flex flex-col gap-6'>{children}</div>
	</section>
);
