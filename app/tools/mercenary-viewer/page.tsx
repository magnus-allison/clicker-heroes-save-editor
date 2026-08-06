import type { Metadata } from 'next';

import { MercenaryViewer } from '@/components/tools/mercenary-viewer/MercenaryViewer';
import { createPageJsonLd, createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata('mercenaryViewer');

const structuredData = createPageJsonLd('mercenaryViewer');

export default function MercenaryViewerPage() {
	return (
		<>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>
			<MercenaryViewer />
		</>
	);
}
