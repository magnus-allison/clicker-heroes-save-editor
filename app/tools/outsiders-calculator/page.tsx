import type { Metadata } from 'next';

import { OutsidersCalculator } from '@/components/tools/outsiders-calculator/OutsidersCalculator';
import { createPageJsonLd, createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata('outsidersCalculator');

const structuredData = createPageJsonLd('outsidersCalculator');

export default function OutsidersCalculatorPage() {
	return (
		<>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>
			<OutsidersCalculator />
		</>
	);
}
