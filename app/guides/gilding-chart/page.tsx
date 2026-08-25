import type { Metadata } from 'next';

import { GildingChartGuide } from '@/components/guides/gilding-chart/GildingChartGuide';
import { Breadcrumb, homeCrumb } from '@/components/home/Breadcrumb';
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
			<Breadcrumb items={[homeCrumb, { label: 'Guides' }, { label: 'Hero Gilding Chart' }]} />
			<GildingChartGuide />
		</>
	);
}
