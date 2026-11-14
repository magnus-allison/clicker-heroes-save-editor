import type { FC, ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import { GuideContents, type GuideIndexPart } from '@/components/guides/GuideContents';

interface LeadProps {
	children: ReactNode;
}

/** The opening paragraph of a guide, set a size up from the body copy. */
export const GuideLead: FC<LeadProps> = ({ children }) => (
	<p className='max-w-3xl font-aeonik text-[1.05rem] font-light leading-7 tracking-[0.02em] text-(--color-fg-secondary)'>
		{children}
	</p>
);

interface Props {
	intro: ReactNode;
	parts: readonly GuideIndexPart[];
	/** The guide's `GuidePart`s. */
	children: ReactNode;
}

/**
 * Shell for the long-form guides: the lead paragraph, then the contents
 * beside the parts. The contents stack above the parts on small screens and
 * become a sticky sidebar from `lg` up.
 */
export const GuideLayout: FC<Props> = ({ children, intro, parts }) => {
	const t = useTranslations('guides.shared');

	return (
		<article className='flex flex-col gap-6'>
			<GuideLead>{intro}</GuideLead>
			<div className='grid gap-6 lg:grid-cols-[14rem_minmax(0,1fr)] lg:items-start'>
				<GuideContents heading={t('contents')} label={t('contentsLabel')} parts={parts} />
				<div className='flex min-w-0 flex-col gap-6'>{children}</div>
			</div>
		</article>
	);
};
