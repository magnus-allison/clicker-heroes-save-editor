import type { Metadata } from 'next';
import Link from 'next/link';
import { AnvilIcon, ArrowRight, BookOpen, Info, MessageSquare } from 'lucide-react';

import { createPageJsonLd, createPageMetadata } from '@/lib/seo';
import { AdditionalInfo } from '@/components/home/AdditionalInfo';
import { Guides } from '@/components/home/Guides';
import { SectionHeading } from '@/components/home/SectionHeading';
import { Tools } from '@/components/home/Tools';

export const metadata: Metadata = createPageMetadata('home');

const structuredData = createPageJsonLd('home');

const Page = () => (
	<>
		<script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

		<section aria-labelledby='tools-heading' className='flex flex-col gap-3'>
			<SectionHeading
				description='Pick the utility you need and keep everything local in your browser.'
				icon={<AnvilIcon aria-hidden='true' className='h-4 w-4' />}
				title='Tools'
			/>
			<div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
				<Tools />
			</div>
		</section>

		<section aria-labelledby='guides-heading' className='flex flex-col gap-3'>
			<SectionHeading
				description='Short walkthroughs for common save editing and route planning tasks.'
				icon={<BookOpen aria-hidden='true' className='h-4 w-4' />}
				title='Guides'
			/>
			<div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
				<Guides />
			</div>
		</section>

		<section aria-labelledby='feedback-heading' className='flex flex-col gap-3'>
			<SectionHeading
				description='Send general feedback, report issues, or request features and guides.'
				icon={<MessageSquare aria-hidden='true' className='h-4 w-4' />}
				title='Feedback'
			/>
			<Link
				className='group flex items-center gap-4 rounded-(--radius-panel) border border-(--color-line) bg-(--color-surface-raised) bg-[image:var(--gradient-raised)] p-5 shadow-[var(--shadow-card)] hover:border-(--color-primary-line) hover:shadow-[var(--shadow-card-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)'
				href='/feedback'
			>
				<span className='min-w-0 text-sm font-medium text-fg-strong'>
					Report bugs, request features, or suggest a guide
				</span>
				<span className='ml-auto inline-flex shrink-0 items-center gap-2 text-[12px] font-semibold text-(--color-primary-text)'>
					Open feedback page
					<ArrowRight
						aria-hidden='true'
						className='h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5'
					/>
				</span>
			</Link>
		</section>

		<section aria-labelledby='additional-info-heading' className='flex flex-col gap-3'>
			<SectionHeading
				description='Project source, support, and the official Clicker Heroes links.'
				icon={<Info aria-hidden='true' className='h-4 w-4' />}
				title='Additional Info'
			/>
			<AdditionalInfo />
		</section>
	</>
);

export default Page;
