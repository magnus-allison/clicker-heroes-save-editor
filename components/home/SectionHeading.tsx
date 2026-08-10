import Link from 'next/link';
import { type FC } from 'react';

import { cn } from '@/lib/cn';

interface Props {
	description: string;
	icon: React.ReactNode;
	title: string;
	back?: string;
}

export const SectionHeading: FC<Props> = ({ description, icon, title, back }) => (
	// Page-level headings (with a back link) sit directly in <main className='gap-10'>, so the
	// 40px flex gap is pulled back to keep the space below the heading at mb-7 (28px) everywhere.
	<div className={cn('flex flex-col', back ? '-mb-3' : 'mb-7')}>
		<div className='flex flex-row items-center gap-2'>
			<span className='flex h-10 w-10 items-center justify-center text-fg-strong'>
				{back ? <Link href={back}>{icon}</Link> : icon}
			</span>
			<h2
				className='text-2xl font-semibold leading-tight text-fg-strong'
				id={`${title.toLowerCase().replace(/\s+/g, '-')}-heading`}
			>
				{title}
			</h2>
		</div>
	</div>
);
