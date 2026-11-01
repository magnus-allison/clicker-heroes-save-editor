import { type FC } from 'react';
import { useTranslations } from 'next-intl';

import { guides } from '@/components/home/Guides';
import { tools } from '@/components/home/Tools';
import { LocaleSwitcher } from '@/components/ui/LocaleSwitcher';
import { Link } from '@/i18n/navigation';

/*
 * Links every tool and guide from every page, so nothing is more than one
 * click away and crawlers reach the whole site from any entry point. The
 * request pages and unreleased tools are left out.
 */
const isListed = (item: { key: string; tag?: string }) =>
	item.tag !== 'comingSoon' && item.key !== 'requestTool' && item.key !== 'requestGuide';

export const SiteFooter: FC = () => {
	const t = useTranslations('common');
	const links = [
		...tools.filter(isListed).map((tool) => ({ href: tool.href, title: t(`cards.tools.${tool.key}.title`) })),
		...guides
			.filter(isListed)
			.map((guide) => ({ href: guide.href, title: t(`cards.guides.${guide.key}.title`) })),
		{ href: '/faq', title: t('pages.faq') }
	];

	return (
		<footer className='mt-16 flex w-full max-w-297 flex-col gap-3 border-t border-(--color-line-subtle) px-1 pt-6 pb-2 text-[12px] text-fg-dim'>
			<nav aria-label={t('footer.label')}>
				<ul className='flex flex-wrap gap-x-4'>
					{links.map((link) => (
						<li key={link.href}>
							<Link
								className='inline-block py-1 transition-colors hover:text-fg-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring'
								href={link.href}
							>
								{link.title}
							</Link>
						</li>
					))}
				</ul>
			</nav>
			<LocaleSwitcher />
			<p className='text-fg-dim/65'>{t('footer.disclaimer')}</p>
		</footer>
	);
};
