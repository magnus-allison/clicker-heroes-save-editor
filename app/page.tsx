import type { Metadata } from 'next';

import { createPageJsonLd, createPageMetadata } from '@/lib/seo';
import { AdditionalInfo } from '@/components/home/AdditionalInfo';
import { Guides } from '@/components/home/Guides';
import { Tools } from '@/components/home/Tools';
import { Breadcrumb } from '@/components/home/Breadcrumb';

export const metadata: Metadata = createPageMetadata('home');

const structuredData = createPageJsonLd('home');

const Page = () => (
	<>
		<script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

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

		<section aria-labelledby='additional-info-heading' className='flex flex-col gap-10 scroll-mt-8' id='additional-info'>
			<Breadcrumb title='additional info' />
			<div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
				<AdditionalInfo />
			</div>
			<p className='text-[12px] leading-6 text-fg-dim'>
				This is an independent project and is not affiliated with, endorsed by, or associated with the
				creators of Clicker Heroes.
			</p>
		</section>
	</>
);

export default Page;
