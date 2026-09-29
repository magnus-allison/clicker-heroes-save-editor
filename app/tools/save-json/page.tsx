import type { Metadata } from 'next';

import { SaveJson } from '@/components/tools/save-json/SaveJson';
import { createPageJsonLd, createPageMetadata, serializeJsonLd } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata('saveJson');

const structuredData = createPageJsonLd('saveJson');

export default function SaveJsonPage() {
	return (
		<>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
			/>
			<SaveJson />
		</>
	);
}
