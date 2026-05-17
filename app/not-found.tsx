import Link from 'next/link';

const recoveryLinks = [
	{
		href: '/tools/save-editor',
		label: 'Open Save Editor',
		description: 'Return to the main editor and load a save file.'
	},
	{
		href: '/tools/save-editor#about-clicker-heroes-save-editor',
		label: 'Read About The Tool',
		description: 'Jump to the overview and supported editing features.'
	}
] as const;

const NotFound = () => {
	return (
		<main className='flex min-h-full items-center justify-center px-4 py-10 sm:px-6 sm:py-14'>
			<section className='w-full max-w-4xl overflow-hidden rounded-xl border border-(--color-border) bg-(--color-bg) shadow-[0_12px_32px_var(--color-shadow)]'>
				<div className='border-b border-(--color-border-soft) bg-(--color-bg-elevated) px-4 py-3 text-[11px] uppercase tracking-[0.16em] text-(--color-text-dim) sm:px-6'>
					Error 404
				</div>
				<div className='grid gap-6 px-4 py-6 sm:px-6 md:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)] md:gap-8 md:py-8'>
					<div>
						<p className='text-[11px] uppercase tracking-[0.12em] text-(--color-primary)'>
							Requested route missing
						</p>
						<h1 className='mt-3 text-2xl font-semibold text-(--color-text-strong) sm:text-3xl'>
							Page not found
						</h1>
						<p className='mt-4 max-w-2xl text-[13px] leading-6 text-(--color-text-secondary) sm:text-sm'>
							The page you requested does not exist, was moved, or the URL was typed incorrectly.
							 The save editor itself is still available from its tool page.
						</p>
						<div className='mt-6 flex flex-wrap gap-3'>
							{recoveryLinks.map((link, index) => (
								<Link
									className={
										index === 0
											? 'inline-flex min-h-10 items-center justify-center rounded-(--input-radius) border border-(--color-primary-border) bg-(--color-selected-bg) px-4 text-[13px] text-(--color-primary) transition hover:border-(--color-primary) hover:bg-(--color-primary-bg) hover:text-(--color-text-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)'
											: 'inline-flex min-h-10 items-center justify-center rounded-(--input-radius) border border-(--color-border-soft) bg-(--color-bg-soft) px-4 text-[13px] text-(--color-text-muted) transition hover:border-(--color-border-hover) hover:bg-(--color-bg-hover) hover:text-(--color-text) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)'
									}
									href={link.href}
									key={link.href}
								>
									{link.label}
								</Link>
							))}
						</div>
					</div>
					<aside className='rounded-(--input-radius) border border-(--color-border-soft) bg-(--color-bg-soft) p-4'>
						<p className='text-[11px] uppercase tracking-[0.12em] text-(--color-text-dim)'>
							Available from here
						</p>
						<ul className='mt-4 space-y-4'>
							{recoveryLinks.map((link) => (
								<li className='border-l border-(--color-border) pl-3' key={link.href}>
									<p className='text-[13px] text-(--color-text)'>{link.label}</p>
									<p className='mt-1 text-[12px] leading-5 text-(--color-text-muted)'>
										{link.description}
									</p>
								</li>
							))}
						</ul>
					</aside>
				</div>
			</section>
		</main>
	);
};

export default NotFound;