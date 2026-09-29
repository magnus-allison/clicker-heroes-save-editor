import type { Metadata } from 'next';

import { AncientsCalculator } from '@/components/tools/ancients-calculator/AncientsCalculator';
import { createPageJsonLd, createPageMetadata, serializeJsonLd } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata('ancientsCalculator');

const structuredData = createPageJsonLd('ancientsCalculator');

export default function AncientsCalculatorPage() {
	return (
		<>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
			/>
			<AncientsCalculator />
		</>
	);
}
