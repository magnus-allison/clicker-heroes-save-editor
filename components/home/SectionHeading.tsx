import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { type FC, type ReactNode } from 'react';

import { cn } from '@/lib/cn';

interface Props {
	title: string | ReactNode;
	icon?: ReactNode;
}

const slugify = (value: string) =>
	value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

export const SectionHeading: FC<Props> = ({ icon, title }) => (
	<div className={cn('flex flex-col mb-10')}>
		<div className='flex flex-row items-center'>
			<span className='flex h-10 w-10 shrink-0 items-center justify-center text-fg-strong'>{icon}</span>
			<h2
				className='text-lg font-semibold leading-tight text-fg-strong font-aeonik [word-spacing:0.2em] uppercase tracking-wide'
				id={typeof title === 'string' ? `${slugify(title)}-heading` : undefined}
			>
				{title}
			</h2>
		</div>
	</div>
);
