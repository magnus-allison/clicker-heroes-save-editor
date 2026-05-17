import type { Metadata } from 'next';

import { FeedbackSection } from '@/components/editor/sections/FeedbackSection';
import { PageHeading } from '@/components/ui/PageHeading';
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
			<div className='flex min-h-screen w-full justify-center overflow-x-hidden p-5 sm:p-10'>
				<main className='flex w-full max-w-4xl flex-col gap-3'>
					<PageHeading
						title='General Feedback'
						subtitle='Use this page for bug reports, feature requests, missing guides, or rough edges anywhere on the site.'
					/>
					<div className='overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-bg-alt) shadow-[0_2px_8px_var(--color-shadow)]'>
						<FeedbackSection
							defaultOpen
							description='Share tool issues, site problems, missing workflows, or general suggestions.'
							title='Send Feedback'
						/>
					</div>
				</main>
			</div>
		</>
	);
}
