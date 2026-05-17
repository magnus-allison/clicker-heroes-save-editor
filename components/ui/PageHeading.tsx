import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { type FC } from 'react';

interface Props {
	title: string;
	subtitle: string;
}

export const PageHeading: FC<Props> = ({ title, subtitle }) => {
	return (
		<header className='mb-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end'>
			<div className='grid grid-cols-[auto_1fr] gap-x-2 items-center'>
				<Link
					aria-label='Back to home'
					className='inline-flex size-9 items-center justify-center rounded-(--input-radius) text-(--color-text-muted) transition hover:text-(--color-text) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)'
					href='/'
				>
					<ArrowLeft aria-hidden='true' className='h-3.5 w-3.5' />
				</Link>
				<h1 className='text-[1.6rem] font-semibold leading-[1.2] text-(--color-text-strong)'>
					{title}
				</h1>
				<div /> {/* spacer so subtitle aligns under title */}
				<p className='max-w-190 text-sm text-(--color-text-muted)'>{subtitle}</p>
			</div>
		</header>
	);
};
