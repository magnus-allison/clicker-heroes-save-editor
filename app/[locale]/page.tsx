import { Monitor, ShieldCheck, Zap } from 'lucide-react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { PageJsonLd } from '@/components/seo/PageJsonLd';
import { initLocale, pageMetadata, type LocaleParams } from '@/i18n/page';
import { AdditionalInfo } from '@/components/home/AdditionalInfo';
import { Guides } from '@/components/home/Guides';
import { Tools } from '@/components/home/Tools';
import { Breadcrumb } from '@/components/home/Breadcrumb';
import { WelcomeBanner } from '@/components/home/WelcomeBanner';
import heroImage from '@/public/assets/home/hero.webp';

export const generateMetadata = pageMetadata('home');

const badges = [
	{ key: 'free', icon: Zap },
	{ key: 'browser', icon: Monitor },
	{ key: 'noAccount', icon: ShieldCheck }
] as const;

const Page = async ({ params }: LocaleParams) => {
	const locale = await initLocale(params);
	const t = await getTranslations('common.home');

	return (
		<>
			<PageJsonLd locale={locale} page='home' />

			{/* <WelcomeBanner /> */}

			{/* The page's `<h1>`. `WelcomeBanner` carried it; with that hidden, this keeps one in place. */}
			<section
				aria-labelledby='home-heading'
				className='grid items-center gap-6 px-1 py-2 sm:grid-cols-[minmax(0,1fr)_auto] md:py-4'
			>
				<div className='flex flex-col gap-4 md:gap-5'>
					<h1
						className='max-w-4xl font-manrope bg-linear-to-b from-hero-silver-from to-hero-silver-to bg-clip-text text-[1.875rem] leading-[1.1] font-bold tracking-tight text-transparent sm:text-[2rem] lg:text-[2.5rem]'
						id='home-heading'
					>
						{t.rich('title', {
							// Its own line from `sm` up; phones wrap where they need to.
							line: (chunks) => <span className='sm:block'>{chunks}</span>
						})}
					</h1>
					<p className='max-w-3xl font-manrope text-[15px] font-light tracking-[0.01rem] text-fg-muted/80 md:text-lg'>
						{t('intro')}
					</p>
					<ul className='flex flex-wrap gap-2 pt-1 md:gap-3'>
						{badges.map(({ key, icon: Icon }) => (
							<li
								className='inline-flex h-9 items-center gap-2 rounded-full bg-card-background px-3.5 font-aeonik text-[13px] text-fg-secondary shadow-card md:h-10 md:px-4 md:text-sm'
								key={key}
							>
								<Icon aria-hidden='true' className='h-4 w-4 shrink-0 text-hero-accent-from/60' />
								{t(`badges.${key}`)}
							</li>
						))}
					</ul>
				</div>
				{/* Decorative, and only from `sm` up: on phones the text alone fills the screen. */}
				<Image
					alt=''
					className='hidden h-auto w-28 sm:block md:w-36 lg:w-44'
					fetchPriority='high'
					loading='eager'
					sizes='(min-width: 1024px) 176px, (min-width: 768px) 144px, 112px'
					src={heroImage}
				/>
			</section>

			<section aria-labelledby='tools-heading' className='flex flex-col gap-10 scroll-mt-8' id='tools'>
				<Breadcrumb title='tools' />
				<div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
					<Tools />
				</div>
			</section>

			<section aria-labelledby='guides-heading' className='flex flex-col gap-10 scroll-mt-8' id='guides'>
				<Breadcrumb title='guides' />
				<div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
					<Guides />
				</div>
			</section>

			<section
				aria-labelledby='additional-info-heading'
				className='flex flex-col gap-10 scroll-mt-8'
				id='additional-info'
			>
				<Breadcrumb title='additional info' />
				<div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
					<AdditionalInfo />
				</div>
			</section>
		</>
	);
};

export default Page;
