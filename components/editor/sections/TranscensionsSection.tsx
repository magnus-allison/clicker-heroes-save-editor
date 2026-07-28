'use client';

import posthog from 'posthog-js';
import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { SectionCard } from '@/components/ui/SectionCard';
import { useSaveStore } from '@/lib/save-store';

type Props = {
	defaultOpen?: boolean;
	showToast: (message: string) => void;
};

export const TranscensionsSection = ({ defaultOpen, showToast }: Props) => {
	const saveData = useSaveStore((state) => state.saveData);
	const updateSave = useSaveStore((state) => state.updateSave);

	return (
		<SectionCard
			defaultOpen={defaultOpen}
			description='Save history for transcensions and ascensions can safely be cleared if you want a smaller export.'
			title='Transcensions and Ascensions'
		>
			<div className='space-y-4 text-[12px] leading-6 text-(--color-fg-secondary)'>
				<p>
					The save contains all transcensions and ascensions information. This can significantly
					increase the size of the save file, and the game does not require this history to continue
					working.
				</p>
				<div>
					{/* Styled to match `Button`'s `secondary` variant, but it has to stay
					    a `Link` so navigation is a real anchor. Deliberately not the
					    accent-filled `primary` treatment: "Clear Transcension Data"
					    below is this card's primary action, and two accent fills in one
					    card would leave neither reading as the main one. */}
					<Link
						className='motion-press inline-flex h-10 items-center justify-center gap-2 rounded-(--radius-control) border border-(--color-line-soft) bg-(--color-surface-sunken) px-4 text-[13px] leading-none text-(--color-fg-muted) shadow-[var(--shadow-raised)] transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-snap hover:border-(--color-line-strong) hover:bg-(--color-surface-hover) hover:text-(--color-fg) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)'
						href='/tools/transcension-viewer'
					>
						View Transcension History
					</Link>
				</div>
				<p>
					To inspect the history first, look under{' '}
					<span className='rounded-(--radius-control) border border-(--color-line) bg-(--color-surface-muted) px-2 py-1 text-(--color-fg)'>
						stats &gt; transcensions
					</span>{' '}
					in the JSON tools below.
				</p>
				<div className='max-w-70'>
					<Button
						disabled={!saveData}
						onClick={() => {
							if (!saveData) {
								return;
							}

							updateSave((current) => {
								const next = structuredClone(current);
								if (!next.stats || typeof next.stats !== 'object') {
									next.stats = {};
								}
								(next.stats as Record<string, unknown>).transcensions = {};
								return next;
							});
							showToast('Transcension history cleared.');
							posthog.capture('transcension_history_cleared');
						}}
						variant='primary'
					>
						Clear Transcension Data
					</Button>
				</div>
			</div>
		</SectionCard>
	);
};
