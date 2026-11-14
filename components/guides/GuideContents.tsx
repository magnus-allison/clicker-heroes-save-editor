'use client';

import { type FC, useEffect, useState } from 'react';

import { cn } from 'cn';

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
	/** Visible heading, e.g. "Contents". Passed in so the `guides` messages stay server-only. */
	heading: string;
	/** Accessible name for the `<nav>`. */
	label: string;
}

/** How far below the top of the viewport a section must reach to count as the one being read. */
const READING_LINE_PX = 120;

/**
 * Tracks the section currently under the reading line, so the contents can
 * mark where the reader is. Falls back to the first section above the fold.
 */
const useActiveSection = (ids: readonly string[]) => {
	const [active, setActive] = useState<string | null>(null);

	useEffect(() => {
		let frame = 0;

		const update = () => {
			frame = 0;
			let current: string | null = null;

			for (const id of ids) {
				const element = document.getElementById(id);
				if (element && element.getBoundingClientRect().top <= READING_LINE_PX) current = id;
			}

			setActive(current);
		};

		const schedule = () => {
			if (!frame) frame = window.requestAnimationFrame(update);
		};

		update();
		window.addEventListener('scroll', schedule, { passive: true });
		window.addEventListener('resize', schedule);

		return () => {
			window.cancelAnimationFrame(frame);
			window.removeEventListener('scroll', schedule);
			window.removeEventListener('resize', schedule);
		};
	}, [ids]);

	return active;
};

/**
 * In-page contents, grouped by part. A panel above the guide on small
 * screens; a sticky sidebar from `lg` up. Plain anchors rather than
 * `next/link`, so the browser handles the hash scroll natively.
 */
export const GuideContents: FC<Props> = ({ heading, label, parts }) => {
	const [sectionIds] = useState(() => parts.flatMap((part) => part.sections.map((section) => section.id)));
	const active = useActiveSection(sectionIds);

	return (
		<nav
			aria-label={label}
			className='glass-panel rounded-2xl p-5 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto'
		>
			<p className='font-aeonik text-[11px] font-semibold uppercase tracking-[0.14em] text-(--color-fg-dim)'>
				{heading}
			</p>
			<ol className='mt-4 grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-1'>
				{parts.map((part, partIndex) => {
					const partActive = part.sections.some((section) => section.id === active);

					return (
						<li key={part.id}>
							<a
								className={cn(
									'flex items-baseline gap-2 rounded-(--radius-control) font-aeonik text-[12px] font-semibold uppercase tracking-[0.08em] transition-colors hover:text-fg-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) [word-spacing:0.12em]',
									partActive ? 'text-fg-strong' : 'text-(--color-fg-secondary)'
								)}
								href={`#${part.id}`}
							>
								<span
									aria-hidden='true'
									className={cn(
										'font-mono text-[11px] font-normal tracking-normal',
										partActive ? 'text-(--color-primary)' : 'text-(--color-fg-dim)'
									)}
								>
									{String(partIndex + 1).padStart(2, '0')}
								</span>
								{part.title}
							</a>
							<ul className='mt-2 ml-1 flex flex-col border-l border-(--color-line-subtle)'>
								{part.sections.map((section) => {
									const isActive = section.id === active;

									return (
										<li key={section.id}>
											<a
												aria-current={isActive ? 'location' : undefined}
												className={cn(
													'-ml-px block border-l py-1 pl-3.5 text-[12px] leading-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)',
													isActive
														? 'border-(--color-primary) text-fg-strong'
														: 'border-transparent text-(--color-fg-muted) hover:border-(--color-line-strong) hover:text-fg-strong'
												)}
												href={`#${section.id}`}
											>
												{section.title}
											</a>
										</li>
									);
								})}
							</ul>
						</li>
					);
				})}
			</ol>
		</nav>
	);
};
