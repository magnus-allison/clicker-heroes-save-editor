import type { Metadata } from 'next';

import { RemoveClanDataEditor } from '@/components/editor/RemoveClanDataEditor';
import { RemoveClanDataAbout } from '@/components/tools/remove-clan-data/RemoveClanDataAbout';
import { createPageJsonLd, createPageMetadata, serializeJsonLd } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata('removeClanData');

const structuredData = createPageJsonLd('removeClanData');

export default function RemoveClanDataPage() {
	return (
		<>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
			/>
			<RemoveClanDataEditor />
			<RemoveClanDataAbout />
		</>
	);
}
