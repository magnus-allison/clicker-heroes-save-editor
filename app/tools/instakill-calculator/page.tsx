import type { Metadata } from 'next';

import { InstakillCalculator } from '@/components/tools/instakill-calculator/InstakillCalculator';
import { createPageJsonLd, createPageMetadata, serializeJsonLd } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata('instakillCalculator');

const structuredData = createPageJsonLd('instakillCalculator');

export default function InstakillCalculatorPage() {
	return (
		<>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
			/>
			<InstakillCalculator />
		</>
	);
}
