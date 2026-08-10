import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';

import { GildingChartGuide } from '@/components/guides/gilding-chart/GildingChartGuide';
import { SectionHeading } from '@/components/home/SectionHeading';
import { createPageJsonLd, createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata('gildingChart');

const structuredData = createPageJsonLd('gildingChart');

export default function GildingChartPage() {
	return (
		<>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>
			<SectionHeading
				back='/'
				description=''
				icon={<ArrowLeft aria-hidden='true' className='h-5 w-5' />}
				title='Guides · Hero Gilding Chart'
			/>
			<GildingChartGuide />
		</>
	);
}
