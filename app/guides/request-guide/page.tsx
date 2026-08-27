import type { Metadata } from 'next';

import { FeedbackSection } from '@/components/editor/sections/FeedbackSection';
import { Breadcrumb } from '@/components/home/Breadcrumb';
import { createPageJsonLd, createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata('requestGuide');

const structuredData = createPageJsonLd('requestGuide');

export default function RequestGuidePage() {
	return (
		<>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>
			<Breadcrumb subtitle='Request a New Guide' title='guides' />
			<FeedbackSection
				defaultOpen
				description='Tell us the topic you are stuck on and what an ideal guide would cover.'
				emptyMessageError='Describe the guide before sending your request.'
				messageLabel='Your guide request'
				messagePlaceholder='What topic should the guide cover, and where are you getting stuck?'
				submitLabel='Send request'
				successMessage='Guide request sent.'
				title='Request a Guide'
				topic='guide-request'
			/>
		</>
	);
}
