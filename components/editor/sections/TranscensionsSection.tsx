import posthog from 'posthog-js';
import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { SectionCard } from '@/components/ui/SectionCard';
import { cn } from '@/lib/cn';
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
			<div className='space-y-4 text-[12px] leading-6 text-(--color-text-secondary)'>
				<p>
					The save contains all transcensions and ascensions information. This can significantly
					increase the size of the save file, and the game does not require this history to continue
					working.
				</p>
				<div>
					<Link
						className={cn(
							'inline-flex h-10 items-center justify-center gap-2 rounded-(--input-radius) border bg-(--color-bg-elevated-2) px-4 leading-none text-[13px] text-(--color-text) transition-[background-color,border-color,color,box-shadow] duration-150 hover:border-(--color-primary) hover:bg-(--color-primary-bg) hover:text-(--color-text-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)',
							'border-(--color-primary-border)/40 bg-(--color-selected-bg)/35 text-(--color-primary) shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_1px_2px_rgba(0,0,0,0.16)]'
						)}
						href='/tools/transcension-viewer'
					>
						View Transcension History
					</Link>
				</div>
				<p className='space-y-4'>
					To inspect the history first, look under{' '}
					<span className='border border-(--color-border) bg-(--color-bg-elevated) px-2 py-1 text-(--color-text)'>
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
