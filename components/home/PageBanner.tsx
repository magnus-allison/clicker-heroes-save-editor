import { type FC } from 'react';
import { AnnouncementBanner } from '@/components/home/AnnouncementBanner';

export const PageBanner: FC = () => {
	return (
		<div className='flex flex-col gap-2'>
			<section className='grid gap-6 rounded-3xl bg-card-background p-3 shadow-card md:grid-cols-[auto_minmax(0,1fr)] md:items-center md:p-6'>
				<div className='flex h-23 w-23 items-center justify-center'>
					<img
						alt='Clicker Heroes'
						className='h-19 w-19 object-contain'
						src='/assets/icons/clicker-heroes.webp'
					/>
				</div>
				<div>
					{/* Same micro-label metrics as the card footers, in the page's one accent. */}
					<p className='inline-flex items-center gap-2 text-[11px] font-light uppercase tracking-[0.14em] text-[#C840BE] dark:text-[#FF57F9]'>
						Clicker Heroes - Free Tools & Calculators
					</p>
					{/* Aeonik's space glyph is narrow; the word-spacing nudge keeps uppercase titles from closing up. */}
					<h1 className='font-aeonik -ml-[0.1rem] text-[2rem] tracking-wider font-bold uppercase text-fg-heading dark:text-fg-strong'>
						clickerheroes.dev
					</h1>
					<p className='mt-1 max-w-3xl text-sm text-fg-muted'>
						Free browser-based tools for editing saves, planning runs, and more.
					</p>
				</div>
			</section>

			{/* <AnnouncementBanner /> */}
			{/* <SeasonalItemsBanner /> */}
		</div>
	);
};
