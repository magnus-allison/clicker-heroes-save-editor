import type { Metadata } from 'next';

import { ProgressTipsGuide } from '@/components/guides/progress-tips/ProgressTipsGuide';
import { Breadcrumb } from '@/components/home/Breadcrumb';
import { createPageJsonLd, createPageMetadata, serializeJsonLd } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata('progressTips');

const structuredData = createPageJsonLd('progressTips');

export default function ProgressTipsPage() {
	return (
		<>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
			/>
			<Breadcrumb subtitle='10 Tips to Progress Faster' title='guides' />
			<ProgressTipsGuide />
		</>
	);
}
