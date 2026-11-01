import { type FC } from 'react';
import Link from 'next/link';

import { guides } from '@/components/home/Guides';
import { tools } from '@/components/home/Tools';

/*
 * Links every tool and guide from every page, so nothing is more than one
 * click away and crawlers reach the whole site from any entry point. The
 * request pages and unreleased tools are left out.
 */
const isListed = (item: { href: string; tag?: string }) =>
	item.tag !== 'Coming soon' && !item.href.endsWith('/request-tool') && !item.href.endsWith('/request-guide');

const links = [...tools.filter(isListed), ...guides.filter(isListed), { title: 'FAQ', href: '/faq' }];

export const SiteFooter: FC = () => (
	<footer className='mt-16 flex w-full max-w-297 flex-col gap-3 border-t border-(--color-line-subtle) px-1 pt-6 pb-2 text-[12px] text-fg-dim'>
		<nav aria-label='Site'>
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
		<p className='text-fg-dim/65'>Independent project, not affiliated with the creators of Clicker Heroes.</p>
	</footer>
);
