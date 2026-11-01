import type { Metadata } from 'next';

import { OutsidersCalculator } from '@/components/tools/outsiders-calculator/OutsidersCalculator';
import { OutsidersAbout } from '@/components/tools/outsiders-calculator/OutsidersAbout';
import { createPageJsonLd, createPageMetadata, serializeJsonLd } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata('outsidersCalculator');

const structuredData = createPageJsonLd('outsidersCalculator');

export default function OutsidersCalculatorPage() {
	return (
		<>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
			/>
			<OutsidersCalculator />
			<OutsidersAbout />
		</>
	);
}
