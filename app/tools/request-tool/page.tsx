import type { Metadata } from 'next';

import { FeedbackSection } from '@/components/editor/sections/FeedbackSection';
import { Breadcrumb, homeCrumb } from '@/components/home/Breadcrumb';
import { PanelSection } from '@/components/ui/PanelSection';
import { createPageJsonLd, createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata('requestTool');

const structuredData = createPageJsonLd('requestTool');

export default function RequestToolPage() {
	return (
		<>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>
			<Breadcrumb items={[homeCrumb, { label: 'Tools' }, { label: 'Request a New Tool' }]} />
			<PanelSection>
				<FeedbackSection
					defaultOpen
					description='Describe the tool you want, what it should work out, and how you would use it.'
					emptyMessageError='Describe the tool before sending your request.'
					messageLabel='Your tool request'
					messagePlaceholder='What should the tool do? What would you put in, and what should it tell you?'
					submitLabel='Send request'
					successMessage='Tool request sent.'
					title='Request a Tool'
					topic='tool-request'
				/>
			</PanelSection>
		</>
	);
}
