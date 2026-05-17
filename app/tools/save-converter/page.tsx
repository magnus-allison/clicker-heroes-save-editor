import type { Metadata } from 'next';

import { SaveConverter } from '@/components/tools/save-converter/SaveConverter';
import { createPageJsonLd, createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata('saveConverter');

const structuredData = createPageJsonLd('saveConverter');

export default function SaveConverterPage() {
	return (
		<>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>
			<SaveConverter />
		</>
	);
}
