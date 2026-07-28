import type { FC } from 'react';

export type GuideSectionLink = {
	id: string;
	title: string;
};

interface Props {
	sections: readonly GuideSectionLink[];
}

/**
 * In-page contents. Plain anchors rather than `next/link` so the browser
 * handles the hash scroll natively (and `scroll-behavior: smooth` applies).
 */
export const GuideIndex: FC<Props> = ({ sections }) => (
	<nav
		aria-label='Guide contents'
		className='rounded-(--radius-card) border border-(--color-line-soft) bg-(--color-surface-sunken) p-4 shadow-[var(--shadow-raised)]'
	>
		<p className='text-[11px] uppercase tracking-[0.12em] text-(--color-fg-dim)'>Contents</p>
		<ol className='mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2'>
			{sections.map((section, index) => (
				<li className='flex items-baseline gap-2 text-[13px]' key={section.id}>
					<span aria-hidden='true' className='w-5 shrink-0 text-right text-[11px] text-(--color-fg-dim)'>
						{String(index + 1).padStart(2, '0')}
					</span>
					<a
						className='text-(--color-fg-secondary) transition-colors hover:text-fg-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)'
						href={`#${section.id}`}
					>
						{section.title}
					</a>
				</li>
			))}
		</ol>
	</nav>
);
