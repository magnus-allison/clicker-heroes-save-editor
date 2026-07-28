import { type FC } from 'react';

interface Props {}

export const PageBanner: FC<Props> = () => {
	return (
		<section className='grid gap-6 rounded-(--radius-panel) border border-line bg-surface-raised bg-(image:--gradient-hero) p-5 shadow-(--shadow-card) md:grid-cols-[auto_minmax(0,1fr)] md:items-center md:p-7'>
			<div className='flex h-22 w-22 items-center justify-center'>
				<img
					alt='Clicker Heroes'
					className='h-18 w-18 object-contain'
					src='/assets/icons/clicker-heroes.png'
				/>
			</div>
			<div>
				<p className='mb-2 inline-flex items-center gap-2 rounded-full py-1 text-xs font-medium uppercase text-primary'>
					{/* <span aria-hidden='true' className='h-1.5 w-1.5 rounded-full bg-primary' /> */}
					Clicker Heroes - Free Tools & Calculators
				</p>
				<h1 className='text-4xl text-fg-strong font-medium'>clickerheroes.dev</h1>
				<p className='mt-3 max-w-3xl text-sm text-(--color-fg-muted)'>
					Free browser-based utilities for editing save data, planning faster runs, guides and more.
				</p>
			</div>
		</section>
	);
};
