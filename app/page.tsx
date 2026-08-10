import type { Metadata } from 'next';

import { AnvilIcon, BookOpen, Info, MessageSquare } from 'lucide-react';

import { createPageJsonLd, createPageMetadata } from '@/lib/seo';
import { AdditionalInfo } from '@/components/home/AdditionalInfo';
import { Guides } from '@/components/home/Guides';
import { SectionHeading } from '@/components/home/SectionHeading';
import { Tools } from '@/components/home/Tools';
import { LinkCard } from '@/components/ui/LinkCard';

export const metadata: Metadata = createPageMetadata('home');

const structuredData = createPageJsonLd('home');

const Page = () => (
	<>
		<script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

		<section aria-labelledby='tools-heading' className='flex flex-col'>
			<SectionHeading
				description='Pick the utility you need and keep everything local in your browser.'
				icon={<AnvilIcon aria-hidden='true' className='h-5 w-5' />}
				title='Tools'
			/>
			<div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
				<Tools />
			</div>
		</section>

		<section aria-labelledby='guides-heading' className='flex flex-col'>
			<SectionHeading
				description='Short walkthroughs for common save editing and route planning tasks.'
				icon={<BookOpen aria-hidden='true' className='h-5 w-5' />}
				title='Guides'
			/>
			<div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
				<Guides />
			</div>
		</section>

		<section aria-labelledby='feedback-heading' className='flex flex-col'>
			<SectionHeading
				description='Send general feedback, report issues, or request features and guides.'
				icon={<MessageSquare aria-hidden='true' className='h-5 w-5' />}
				title='Feedback'
			/>
			<LinkCard
				cta='Open feedback page'
				href='/feedback'
				layout='horizontal'
				title='Report bugs, request features, or suggest a guide'
			/>
		</section>

		<section aria-labelledby='additional-info-heading' className='flex flex-col'>
			<SectionHeading
				description='Project source, support, and the official Clicker Heroes links.'
				icon={<Info aria-hidden='true' className='h-5 w-5' />}
				title='Additional Info'
			/>
			<AdditionalInfo />
		</section>
	</>
);

export default Page;
