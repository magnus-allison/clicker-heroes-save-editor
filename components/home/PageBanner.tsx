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
		<header className='site-banner grid gap-4 rounded-2xl p-5 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-info md:flex md:items-center md:justify-between md:gap-6 md:px-6 md:py-4.5'>
			<Link
				aria-label={t('homeLabel')}
				className='@container grid min-w-0 flex-1 gap-3 rounded-xl outline-none md:grid-cols-[auto_minmax(0,1fr)] md:items-center md:gap-6'
				href='/'
			>
				<div className='flex h-16 w-16 shrink-0 items-center justify-center md:h-23 md:w-23'>
					<img
						alt=''
						className='h-full w-full object-contain md:h-17 md:w-17'
						src='/assets/icons/clicker-heroes.webp'
					/>
				</div>
				<div className='min-w-0'>
					<p className='font-aeonik ml-[-0.1rem] text-[clamp(0.9375rem,7cqi,1.625rem)] tracking-wide font-black uppercase text-fg-strong md:tracking-wider'>
						clickerheroes.dev
					</p>
					<p className='text-[10px] font-medium uppercase tracking-[0.11em] text-banner-accent font-aeonik md:text-sm md:tracking-[0.13em]'>
						{t('tagline')}
					</p>
				</div>
			</Link>
		</header>
	);
};
