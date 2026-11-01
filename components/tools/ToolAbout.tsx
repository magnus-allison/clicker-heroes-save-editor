import { Fragment, type FC, type ReactNode } from 'react';

import { GuideLink } from '@/components/guides/GuideLink';

export type ToolAboutSection = {
	title: string;
	body: ReactNode;
};

export type ToolAboutLink = {
	href: string;
	title: string;
};

interface Props {
	id: string;
	intro: ReactNode;
	sections: readonly ToolAboutSection[];
	related: readonly ToolAboutLink[];
}

/**
 * Short server-rendered note under a tool: what it does and how it works. The
 * tools are interactive forms with little prose of their own, so this is the
 * text search engines read — kept brief so it never competes with the tool.
 */
export const ToolAbout: FC<Props> = ({ id, intro, related, sections }) => (
	<section
		aria-labelledby={`${id}-heading`}
		className='mt-6 flex max-w-3xl flex-col gap-5 border-t border-(--color-line-subtle) pt-8 text-[13px] leading-6 text-(--color-fg-secondary)'
		id={id}
	>
		<h2 className='text-[0.95rem] font-semibold leading-tight text-fg-strong' id={`${id}-heading`}>
			How it works
		</h2>
		<p>{intro}</p>
		{sections.map((section) => (
			<div key={section.title}>
				<h3 className='font-semibold text-fg-strong'>{section.title}</h3>
				<div className='mt-1'>{section.body}</div>
			</div>
		))}
		<p className='text-(--color-fg-muted)'>
			See also:{' '}
			{related.map((link, index) => (
				<Fragment key={link.href}>
					{index > 0 ? ' · ' : null}
					<GuideLink href={link.href}>{link.title}</GuideLink>
				</Fragment>
			))}
		</p>
	</section>
);
