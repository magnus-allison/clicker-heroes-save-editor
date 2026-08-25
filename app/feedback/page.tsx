import type { Metadata } from 'next';

import { FeedbackSection } from '@/components/editor/sections/FeedbackSection';
import { Breadcrumb, homeCrumb } from '@/components/home/Breadcrumb';
import { PanelSection } from '@/components/ui/PanelSection';
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
			<Breadcrumb items={[homeCrumb, { label: 'General Feedback' }]} />
			<PanelSection>
				<FeedbackSection
					defaultOpen
					description='Share tool issues, site problems, missing workflows, or general suggestions.'
					title='Send Feedback'
				/>
			</PanelSection>
		</>
	);
}
