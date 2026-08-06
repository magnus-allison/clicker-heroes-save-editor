import type { FC } from 'react';

export type GuideSectionLink = {
	id: string;
	title: string;
};

export type GuideIndexPart = {
	id: string;
	title: string;
	sections: readonly GuideSectionLink[];
};

interface Props {
	parts: readonly GuideIndexPart[];
}

/**
 * In-page contents, grouped by part. Plain anchors rather than `next/link` so
 * the browser handles the hash scroll natively (and `scroll-behavior: smooth`
 * applies).
 */
export const GuideIndex: FC<Props> = ({ parts }) => (
	<nav aria-label='Guide contents' className='border-y border-(--color-line-subtle) py-4 sm:py-5'>
		<p className='text-[11px] uppercase tracking-[0.12em] text-(--color-fg-dim)'>Contents</p>
		<div className='mt-3 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3'>
			{parts.map((part, partIndex) => (
				<div key={part.id}>
					<p className='flex items-baseline gap-2 text-[12px] font-semibold text-fg-strong'>
						<span aria-hidden='true' className='text-[11px] font-normal text-(--color-fg-dim)'>
							{String(partIndex + 1).padStart(2, '0')}
						</span>
						{part.title}
					</p>
					<ul className='mt-1.5 flex flex-col gap-1 pl-[1.6rem]'>
						{part.sections.map((section) => (
							<li className='text-[13px] leading-5' key={section.id}>
								<a
									className='text-(--color-fg-secondary) transition-colors hover:text-fg-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)'
									href={`#${section.id}`}
								>
									{section.title}
								</a>
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	</nav>
);
