'use client';

import posthog from 'posthog-js';

import { Button } from '@/components/ui/Button';
import { SectionCard } from '@/components/ui/SectionCard';
import { ToolLink } from '@/components/ui/ToolLink';
import { useSaveStore } from '@/lib/save-store';
import { setValueAtPath } from '@/lib/save-utils';

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
					The save contains all transcensions and ascensions information. This can significantly increase the
					size of the save file, and the game does not require this history to continue working.
				</p>
				<div>
					<ToolLink href='/tools/transcension-viewer'>View Transcension History</ToolLink>
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

							// `setValueAtPath` rather than a `structuredClone`: the
							// untouched parts of the save keep their identity, which is
							// what lets the change summary diff the save in O(edits).
							updateSave((current) => setValueAtPath(current, ['stats', 'transcensions'], {}));
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
