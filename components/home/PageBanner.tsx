import { type FC } from 'react';
import Link from 'next/link';

/*
 * The site name is deliberately not a heading: it sits on every page, and a
 * shared `<h1>` would hide each page's real topic from search engines. Pages
 * render their own `<h1>` (via `Breadcrumb`, or the home page intro).
 */
export const PageBanner: FC = () => {
	return (
		<Link
			aria-label='clickerheroes.dev home'
			className='@container grid gap-3 rounded-2xl bg-card-background p-5 shadow-card transition-shadow duration-300 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-strong md:grid-cols-[auto_minmax(0,1fr)] md:items-center md:gap-6 md:px-6 md:py-4.5'
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
				<p className='font-aeonik ml-[-0.1rem] text-[clamp(1.375rem,9cqi,2.25rem)] tracking-wide font-bold uppercase text-fg-heading dark:text-fg-strong md:tracking-wider'>
					clickerheroes.dev
				</p>
				<p className='text-[10px] font-medium uppercase tracking-[0.11em] text-[#C840BE] dark:text-[#FF57F9] font-aeonik md:text-[11px] md:tracking-[0.13em]'>
					Free Tools &amp; Calculators - Clicker Heroes
				</p>
			</div>
		</Link>
	);
};
