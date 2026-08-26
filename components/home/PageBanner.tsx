import { type FC } from 'react';

export const PageBanner: FC = () => {
	return (
		<section className='grid gap-6 rounded-2xl bg-card-background p-3 shadow-card md:grid-cols-[auto_minmax(0,1fr)] md:items-center md:px-6 md:py-4.5'>
			<div className='flex h-23 w-23 items-center justify-center'>
				<img
					alt='Clicker Heroes'
					className='h-17 w-17 object-contain'
					src='/assets/icons/clicker-heroes.webp'
				/>
			</div>
			<div>
				<h1 className='font-aeonik ml-[-0.1rem] text-[2.25rem] tracking-wider font-bold uppercase text-fg-heading dark:text-fg-strong'>
					clickerheroes.dev
				</h1>
				<p className='inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.13em] text-[#C840BE] dark:text-[#FF57F9] font-aeonik'>
					Free Tools & Calculators - Clicker Heroes
				</p>
			</div>
		</section>
	);
};
