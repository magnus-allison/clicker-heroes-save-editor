import { type FC } from 'react';
import { BookOpen, BoxIcon, ChevronRight, Info, type LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import type { messages } from '@/messages';

type PageKey = keyof (typeof messages)['en']['common']['pages'];

interface Props {
	/** The group the page sits in — matches the home page section headings. */
	title: 'tools' | 'guides' | 'additional info';
	/**
	 * The page itself: a tool, guide, or info page. Omitted on the home page.
	 * When set, its name is the page's `<h1>` — the site name in `PageBanner` is
	 * not a heading, so every page leads with its own topic.
	 */
	page?: PageKey;
}

const groups: Record<Props['title'], { icon: LucideIcon; href: string; label: 'tools' | 'guides' | 'additionalInfo' }> = {
	tools: { icon: BoxIcon, href: '/#tools', label: 'tools' },
	guides: { icon: BookOpen, href: '/#guides', label: 'guides' },
	'additional info': { icon: Info, href: '/#additional-info', label: 'additionalInfo' }
};

const headingClassName =
	'text-lg font-semibold leading-tight text-fg-strong font-aeonik [word-spacing:0.2em] uppercase tracking-wide';

export const Breadcrumb: FC<Props> = ({ title, page }) => {
	const t = useTranslations('common');
	const { icon: Icon, href, label } = groups[title];
	// Ids stay English so `/#tools`-style anchors work in every language.
	const id = `${title.replace(/\s+/g, '-')}-heading`;
	const groupName = t(`breadcrumb.groups.${label}`);

	return (
		<div className='flex flex-col'>
			<div className='flex flex-row items-center'>
				<span className='flex h-10 w-10 shrink-0 items-center justify-center text-fg-strong'>
					<Icon aria-hidden='true' className='h-5 w-5' />
				</span>
				{page ? (
					<nav aria-label={t('breadcrumb.label')} className='flex flex-row items-center'>
						<Link
							className={`${headingClassName} rounded-radius-control text-fg-dim transition-colors hover:text-fg-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring`}
							href={href}
						>
							{groupName}
						</Link>
						<ChevronRight aria-hidden='true' className='mx-1.5 h-4 w-4 shrink-0 text-fg-dim' />
						<h1 aria-current='page' className={headingClassName} id={id}>
							{t(`pages.${page}`)}
						</h1>
					</nav>
				) : (
					<h2 className={headingClassName} id={id}>
						{groupName}
					</h2>
				)}
			</div>
		</div>
	);
};
