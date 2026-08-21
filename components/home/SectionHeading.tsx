import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { type FC, type ReactNode } from 'react';

import { cn } from '@/lib/cn';

interface Props {
	title: string;
	/**
	 * Accepted for the section headings on the home page. Not rendered yet —
	 * kept optional so page-level headings don't have to pass `description=''`.
	 */
	description?: string;
	/** Defaults to the back arrow when `back` is set, so page headings need only pass `back`. */
	icon?: ReactNode;
	/** Href for the parent page. Presence of this is what marks a heading as page-level. */
	back?: string;
	/**
	 * Screen-reader name for the back link. Override when the parent is not the
	 * home page, e.g. `backLabel='Back to guides'`.
	 */
	backLabel?: string;
}

/*
 * `slugify` keeps heading ids ASCII and selector-safe. Titles carry a middle dot
 * ('Tools · Save Editor'), which would otherwise land verbatim in the id and
 * break any `#fragment` link or `querySelector` aimed at it.
 */
const slugify = (value: string) =>
	value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

export const SectionHeading: FC<Props> = ({ icon, title, back, backLabel }) => (
	// Page-level headings (with a back link) sit directly in <main className='gap-10'>, so the
	// 40px flex gap is pulled back to keep the space below the heading at mb-7 (28px) everywhere.
	<div className={cn('flex flex-col', back ? '-mb-3' : 'mb-7')}>
		<div className='flex flex-row items-center gap-2'>
			{back ? (
				/*
				 * The link — not a wrapper span — owns the 40px box, so the whole
				 * square is clickable rather than just the 20px glyph. The icon is
				 * aria-hidden, so the sr-only text is the link's only accessible
				 * name; without it screen readers announce an empty link.
				 */
				<Link
					className='motion-press flex h-10 w-10 shrink-0 items-center justify-center rounded-(--radius-control) text-(--color-fg-strong) transition-[background-color,color] duration-150 ease-snap hover:bg-(--color-surface-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)'
					href={back}
				>
					{icon ?? <ArrowLeft aria-hidden='true' className='h-5 w-5' />}
					<span className='sr-only'>{backLabel ?? 'Back to home'}</span>
				</Link>
			) : (
				<span className='flex h-10 w-10 shrink-0 items-center justify-center text-fg-strong'>{icon}</span>
			)}
			<h2
				className='text-2xl font-medium leading-tight text-fg-strong font-aeonik [word-spacing:0.2em]'
				id={`${slugify(title)}-heading`}
			>
				{title}
			</h2>
		</div>
	</div>
);
