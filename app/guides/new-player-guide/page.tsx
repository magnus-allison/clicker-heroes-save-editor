import type { Metadata } from 'next';

import { NewPlayerGuide } from '@/components/guides/new-player-guide/NewPlayerGuide';
import { Breadcrumb } from '@/components/home/Breadcrumb';
import { createPageJsonLd, createPageMetadata, serializeJsonLd } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata('newPlayerGuide');

const structuredData = createPageJsonLd('newPlayerGuide');

export default function NewPlayerGuidePage() {
	return (
		<>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
			/>
			<Breadcrumb subtitle='New Player Guide' title='guides' />
			<NewPlayerGuide />
		</>
	);
}
