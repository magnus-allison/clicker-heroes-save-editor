import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';

import { FeedbackSection } from '@/components/editor/sections/FeedbackSection';
import { SectionHeading } from '@/components/home/SectionHeading';
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
			<SectionHeading
				back='/'
				description=''
				icon={<ArrowLeft aria-hidden='true' className='h-4 w-4' />}
				title='General Feedback'
			/>
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
