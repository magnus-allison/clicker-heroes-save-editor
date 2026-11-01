import type { Metadata } from 'next';

import { createPageJsonLd, createPageMetadata, serializeJsonLd } from '@/lib/seo';
import { AdditionalInfo } from '@/components/home/AdditionalInfo';
import { Guides } from '@/components/home/Guides';
import { Tools } from '@/components/home/Tools';
import { Breadcrumb } from '@/components/home/Breadcrumb';
import { WelcomeBanner } from '@/components/home/WelcomeBanner';

export const metadata: Metadata = createPageMetadata('home');

const structuredData = createPageJsonLd('home');

const Page = () => (
	<>
		<script
			type='application/ld+json'
			dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
		/>

		{/* <WelcomeBanner /> */}

		{/* The page's `<h1>`. `WelcomeBanner` carried it; with that hidden, this keeps one in place. */}
		<section aria-labelledby='home-heading' className='flex flex-col gap-2 px-1'>
			<h1
				className='font-aeonik text-xl font-bold tracking-wide text-fg-strong lg:text-2xl'
				id='home-heading'
			>
				Clicker Heroes Save Editor, Calculators &amp; Guides
			</h1>
			<p className='max-w-3xl font-aeonik text-[15px] font-light tracking-[0.035rem] text-fg-muted/80'>
				Free tools for Clicker Heroes 1.0e12. Everything runs in your browser.
			</p>
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

export default Page;
