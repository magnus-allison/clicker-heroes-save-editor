import { type FC } from 'react';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

/*
 * The site name is deliberately not a heading: it sits on every page, and a
 * shared `<h1>` would hide each page's real topic from search engines. Pages
 * render their own `<h1>` (via `Breadcrumb`, or the home page intro).
 */
export const PageBanner: FC = () => {
	const t = useTranslations('common.banner');

	return (
		<header className='site-banner grid gap-3 rounded-2xl p-4 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-info md:flex md:items-center md:justify-between md:gap-6 md:px-5 md:py-3'>
			<Link
				aria-label={t('homeLabel')}
				className='@container grid min-w-0 flex-1 grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-xl outline-none md:gap-4'
				href='/'
			>
				<div className='flex h-12 w-12 shrink-0 items-center justify-center md:h-16 md:w-16'>
					<img
						alt=''
						className='h-full w-full object-contain md:h-13 md:w-13'
						src='/assets/icons/clicker-heroes.webp'
					/>
				</div>
				<div className='min-w-0'>
					<p className='font-aeonik ml-[-0.1rem] text-[clamp(0.875rem,6cqi,1.375rem)] tracking-wide font-bold uppercase text-fg-strong md:tracking-wider'>
						clickerheroes.dev
					</p>
					<p className='text-[10px] font-medium uppercase tracking-[0.11em] text-banner-accent font-aeonik md:text-xs md:tracking-[0.13em]'>
						{t('tagline')}
					</p>
				</div>
			</Link>
		</header>
	);
};
