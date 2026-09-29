import type { Metadata } from 'next';

import { TranscensionViewer } from '@/components/tools/transcension-viewer/TranscensionViewer';
import { createPageJsonLd, createPageMetadata, serializeJsonLd } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata('transcensionViewer');

const structuredData = createPageJsonLd('transcensionViewer');

export default function TranscensionViewerPage() {
	return (
		<>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
			/>
			<TranscensionViewer />
		</>
	);
}
