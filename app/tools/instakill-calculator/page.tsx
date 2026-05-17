import type { Metadata } from 'next';

import { InstakillCalculator } from '@/components/tools/instakill-calculator/InstakillCalculator';
import { createPageJsonLd, createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata('instakillCalculator');

const structuredData = createPageJsonLd('instakillCalculator');

export default function InstakillCalculatorPage() {
	return (
		<>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>
			<InstakillCalculator />
		</>
	);
}
