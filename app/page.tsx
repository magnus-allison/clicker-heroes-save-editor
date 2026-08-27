import type { Metadata } from 'next';

import { createPageJsonLd, createPageMetadata } from '@/lib/seo';
import { AdditionalInfo } from '@/components/home/AdditionalInfo';
import { Guides } from '@/components/home/Guides';
import { Tools } from '@/components/home/Tools';
import { Breadcrumb } from '@/components/home/Breadcrumb';
import { InfoIcon, ShieldAlertIcon } from 'lucide-react';

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

		<p className='mt-auto flex items-start gap-2 p-5 font-aeonik text-sm tracking-wide text-fg-dim/65'>
			<InfoIcon aria-hidden='true' className='mt-1 h-3 w-3 shrink-0' />
			<span>
				This is an independent project and is not affiliated with, endorsed by, or associated with the
				creators of Clicker Heroes.
			</span>
		</p>
	</>
);

export default Page;
