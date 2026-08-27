import type { Metadata } from 'next';

import { FeedbackSection } from '@/components/editor/sections/FeedbackSection';
import { Breadcrumb } from '@/components/home/Breadcrumb';
import { createPageJsonLd, createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata('feedback');

const structuredData = createPageJsonLd('feedback');

export default function FeedbackPage() {
	return (
		<>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>
			<Breadcrumb subtitle='Feedback' title='additional info' />
			<FeedbackSection
				defaultOpen
				description='Share tool issues, site problems, missing workflows, or general suggestions.'
				title='Send Feedback'
			/>
		</>
	);
}
