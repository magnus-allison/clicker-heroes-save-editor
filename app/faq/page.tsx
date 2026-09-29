import type { Metadata } from 'next';

import { FaqContent } from '@/components/faq/FaqContent';
import { Breadcrumb } from '@/components/home/Breadcrumb';
import { createPageJsonLd, createPageMetadata, serializeJsonLd } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata('faq');

const structuredData = createPageJsonLd('faq');

export default function FaqPage() {
	return (
		<>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
			/>
			<Breadcrumb subtitle='FAQ' title='additional info' />
			<FaqContent />
		</>
	);
}
