import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

const NotFound = () => {
	const t = useTranslations('common.notFound');
	const recoveryLinks = [
		{
			href: '/tools/save-editor',
			label: t('openEditor'),
			description: t('openEditorDescription')
		},
		{
			href: '/tools/save-editor#about-clicker-heroes-save-editor',
			label: t('about'),
			description: t('aboutDescription')
		}
	];

	return (
		<div className='flex w-full items-center justify-center'>
			<section className='w-full max-w-4xl overflow-hidden rounded-(--radius-panel) border border-(--color-line) bg-(--color-surface-raised) shadow-[var(--shadow-popover)]'>
				<div className='border-b border-(--color-line-soft) bg-(--color-surface-header) px-4 py-3 text-[11px] uppercase tracking-[0.16em] text-(--color-fg-dim) sm:px-6'>
					{t('eyebrow')}
				</div>
				<div className='grid gap-6 px-4 py-6 sm:px-6 md:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)] md:gap-8 md:py-8'>
					<div>
						<p className='text-[11px] uppercase tracking-[0.12em] text-(--color-primary-text)'>
							{t('kicker')}
						</p>
						<h1 className='mt-3 text-2xl font-semibold text-(--color-fg-strong) sm:text-3xl'>{t('title')}</h1>
						<p className='mt-4 max-w-2xl text-[13px] leading-6 text-(--color-fg-secondary) sm:text-sm'>
							{t('body')}
						</p>
						<div className='mt-6 flex flex-wrap gap-3'>
							{recoveryLinks.map((link, index) => (
								<Link
									className={
										index === 0
											? // Mirrors `Button` variant="primary". Kept inline rather than
												// reusing the component because this is a navigation link.
												'motion-press inline-flex min-h-10 items-center justify-center rounded-(--radius-control) border border-(--color-primary-line) bg-(--color-primary-surface) px-4 text-[13px] font-semibold text-(--color-primary-text) shadow-[var(--shadow-raised)] transition-[background-color,border-color,box-shadow,transform] duration-150 ease-snap hover:border-(--color-primary) hover:bg-(--color-primary-soft) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)'
											: 'motion-press inline-flex min-h-10 items-center justify-center rounded-(--radius-control) border border-(--color-line-soft) bg-(--color-surface-sunken) px-4 text-[13px] text-(--color-fg-muted) shadow-[var(--shadow-raised)] transition-[background-color,border-color,color,transform] duration-150 ease-snap hover:border-(--color-line-strong) hover:bg-(--color-surface-hover) hover:text-(--color-fg) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)'
									}
									href={link.href}
									key={link.href}
								>
									{link.label}
								</Link>
							))}
						</div>
					</div>
					<aside className='rounded-(--radius-card) border border-(--color-line-soft) bg-(--color-surface-sunken) p-4 shadow-[var(--shadow-raised)]'>
						<p className='text-[11px] uppercase tracking-[0.12em] text-(--color-fg-dim)'>{t('available')}</p>
						<ul className='mt-4 space-y-4'>
							{recoveryLinks.map((link) => (
								<li className='border-l-2 border-(--color-primary-line) pl-3' key={link.href}>
									<p className='text-[13px] text-(--color-fg)'>{link.label}</p>
									<p className='mt-1 text-[12px] leading-5 text-(--color-fg-muted)'>{link.description}</p>
								</li>
							))}
						</ul>
					</aside>
				</div>
			</section>
		</div>
	);
};

export default NotFound;
