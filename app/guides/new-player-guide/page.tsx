import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';

import { NewPlayerGuide } from '@/components/guides/new-player-guide/NewPlayerGuide';
import { SectionHeading } from '@/components/home/SectionHeading';
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
			<SectionHeading
				back='/'
				description=''
				icon={<ArrowLeft aria-hidden='true' className='h-4 w-4' />}
				title='Guides · New Player Guide'
			/>
			<NewPlayerGuide />
		</>
	);
}
