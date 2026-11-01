import { Fragment, type FC, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import { GuideLink } from '@/components/guides/GuideLink';
import { toolLinks, type ToolLinkKey } from '@/components/tools/tool-links';

export type ToolAboutSection = {
	title: string;
	body: ReactNode;
};

interface Props {
	id: string;
	intro: ReactNode;
	sections: readonly ToolAboutSection[];
	related: readonly ToolLinkKey[];
}

interface RelatedToolLinksProps {
	className?: string;
	related: readonly ToolLinkKey[];
}

/** "See also:" followed by the named tools and guides, dot-separated. */
export const RelatedToolLinks: FC<RelatedToolLinksProps> = ({ className, related }) => {
	const t = useTranslations('toolAbout');

	return (
		<p className={className}>
			{t('seeAlso')}{' '}
			{related.map((key, index) => (
				<Fragment key={key}>
					{index > 0 ? ' · ' : null}
					<GuideLink href={toolLinks[key]}>{t(`links.${key}`)}</GuideLink>
				</Fragment>
			))}
		</p>
	);
};

/**
 * Short server-rendered note under a tool: what it does and how it works. The
 * tools are interactive forms with little prose of their own, so this is the
 * text search engines read — kept brief so it never competes with the tool.
 */
export const ToolAbout: FC<Props> = ({ id, intro, related, sections }) => {
	const t = useTranslations('toolAbout');

	return (
		<section
			aria-labelledby={`${id}-heading`}
			className='mt-6 flex max-w-3xl flex-col gap-5 border-t border-(--color-line-subtle) pt-8 text-[13px] leading-6 text-(--color-fg-secondary)'
			id={id}
		>
			<h2 className='text-[0.95rem] font-semibold leading-tight text-fg-strong' id={`${id}-heading`}>
				{t('heading')}
			</h2>
			<p>{intro}</p>
			{sections.map((section) => (
				<div key={section.title}>
					<h3 className='font-semibold text-fg-strong'>{section.title}</h3>
					<div className='mt-1'>{section.body}</div>
				</div>
			))}
			<RelatedToolLinks className='text-(--color-fg-muted)' related={related} />
		</section>
	);
};
