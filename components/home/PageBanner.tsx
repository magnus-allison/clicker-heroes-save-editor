import { type FC } from 'react';
import { AnnouncementBanner } from '@/components/home/AnnouncementBanner';

export const PageBanner: FC = () => {
	return (
		<div className='flex flex-col gap-2'>
			<section className='grid gap-6 rounded-panel  bg-card-background p-5 shadow-(--shadow-card) md:grid-cols-[auto_minmax(0,1fr)] md:items-center md:p-7'>
				<div className='flex h-23 w-23 items-center justify-center'>
					<img
						alt='Clicker Heroes'
						className='h-19 w-19 object-contain'
						src='/assets/icons/clicker-heroes.webp'
					/>
				</div>
				<div>
					<p className='inline-flex items-center gap-2 rounded-full py-1 text-xs font-normal uppercase text-[#C840BE] dark:text-[#FF57F9]'>
						Clicker Heroes - Free Tools & Calculators
					</p>
					<h1 className='text-[1.9rem] -ml-0.5  dark:text-fg-strong font-medium text-fg-heading uppercase'>
						clickerheroes.dev
					</h1>
					<p className='mt-1 max-w-3xl text-sm text-fg-muted'>
						Free browser-based utilities for editing save data, planning faster runs, guides and more.
					</p>
				</div>
			</section>

			{/* <AnnouncementBanner /> */}
			{/* <SeasonalItemsBanner /> */}
		</div>
	);
};
