import type { Metadata } from 'next';

import { RemoveClanDataEditor } from '@/components/editor/RemoveClanDataEditor';
import { createPageJsonLd, createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata('removeClanData');

const structuredData = createPageJsonLd('removeClanData');

export default function RemoveClanDataPage() {
	return (
		<>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>
			<RemoveClanDataEditor />
		</>
	);
}
