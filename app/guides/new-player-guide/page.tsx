import type { Metadata } from 'next';

import { NewPlayerGuide } from '@/components/guides/new-player-guide/NewPlayerGuide';
import { Breadcrumb, homeCrumb } from '@/components/home/Breadcrumb';
import { createPageJsonLd, createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata('newPlayerGuide');

const structuredData = createPageJsonLd('newPlayerGuide');

export default function NewPlayerGuidePage() {
	return (
		<>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>
			<Breadcrumb items={[homeCrumb, { label: 'Guides' }, { label: 'New Player Guide' }]} />
			<NewPlayerGuide />
		</>
	);
}
