import type { FC, ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import { AnchorLink } from '@/components/ui/AnchorLink';
import { Pill } from '@/components/ui/Pill';

interface Props {
	id: string;
	/** Part number, shown zero-padded in the pill beside the title. */
	index: number;
	title: string;
	children: ReactNode;
}

/**
 * Top-level grouping for a guide, in the same glass panel as the tools. Parts
 * carry the `h2`, so the `GuideSection`s nested inside them drop to `h3` and
 * the page keeps a single heading ramp.
 */
export const GuidePart: FC<Props> = ({ children, id, index, title }) => {
	const t = useTranslations('guides.shared');

	return (
		<section
			aria-labelledby={`${id}-heading`}
			className='glass-panel scroll-mt-6 rounded-2xl p-5 sm:p-7'
			id={id}
		>
			<header className='group/heading flex flex-wrap items-center gap-x-3 gap-y-2'>
				<Pill aria-hidden='true'>{t('part', { number: String(index).padStart(2, '0') })}</Pill>
				<h2
					className='font-aeonik text-[1.05rem] font-semibold uppercase leading-tight tracking-wide text-fg-strong [word-spacing:0.2em]'
					id={`${id}-heading`}
				>
					{title}
				</h2>
				<AnchorLink
					anchor={id}
					className='-my-1 opacity-0 focus-visible:opacity-100 group-hover/heading:opacity-100 [@media(hover:none)]:opacity-100'
					label={title}
				/>
			</header>
			<div className='mt-6 flex flex-col divide-y divide-(--color-line-subtle)'>{children}</div>
		</section>
	);
};
