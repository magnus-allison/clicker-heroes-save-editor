import type { Metadata } from 'next';

import { GildingChartGuide } from '@/components/guides/gilding-chart/GildingChartGuide';
import { Breadcrumb } from '@/components/home/Breadcrumb';
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
			<Breadcrumb subtitle='Hero Gilding Chart' title='guides' />
			<GildingChartGuide />
		</>
	);
}
