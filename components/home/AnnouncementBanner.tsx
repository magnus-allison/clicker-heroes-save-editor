import { type FC } from 'react';
import Link from 'next/link';
import { ArrowRight, MessageSquare } from 'lucide-react';

export const AnnouncementBanner: FC = () => (
	<Link
		className='group hidden flex-wrap items-center gap-x-3 gap-y-2 rounded-card border border-line hover:border-line-strong px-4 py-2.5 md:flex'
		href='/feedback'
	>
		<MessageSquare aria-hidden='true' className='h-4 w-4 shrink-0 text-fg-secondary' />
		<span className='min-w-0 text-xs text-fg-secondary'>
			Help us improve the site — share your suggestions and feedback!
		</span>
		<span className='ml-auto inline-flex shrink-0 items-center gap-1.5 text-[11px] font-semibold text-fg-secondary'>
			Open feedback page
			<ArrowRight aria-hidden='true' className='h-3 w-3 transition-transform group-hover:translate-x-0.5' />
		</span>
	</Link>
);
