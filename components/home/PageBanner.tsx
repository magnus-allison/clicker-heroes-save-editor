import { type FC } from 'react';

import { AnnouncementBanner } from '@/components/home/AnnouncementBanner';
// import { SeasonalItemsBanner } from '@/components/home/SeasonalItemsBanner';

interface Props {}

export const PageBanner: FC<Props> = () => {
	return (
		<div className='flex flex-col gap-3'>
			<section className='grid gap-6 rounded-panel border border-line bg-surface-raised bg-(image:--gradient-hero) p-5 shadow-(--shadow-card) md:grid-cols-[auto_minmax(0,1fr)] md:items-center md:p-7'>
				<div className='flex h-22 w-22 items-center justify-center'>
					<img
						alt='Clicker Heroes'
						className='h-18 w-18 object-contain'
						src='/assets/icons/clicker-heroes.webp'
					/>
				</div>
				<div>
					<p className='mb-2 inline-flex items-center gap-2 rounded-full py-1 text-xs font-normal uppercase text-[#FF57F9]'>
						Clicker Heroes - Free Tools & Calculators
					</p>
					<h1 className='text-4xl dark:text-[#F7EEE0] font-medium text-fg-heading'>clickerheroes.dev</h1>
					<p className='mt-3 max-w-3xl text-sm text-fg-muted'>
						Free browser-based utilities for editing save data, planning faster runs, guides and more.
					</p>
				</div>
			</section>

			{/* <SeasonalItemsBanner /> */}
			<AnnouncementBanner />
		</div>
	);
};
