'use client';

import { useMemo } from 'react';

import { ChevronRight } from 'lucide-react';

import { EditorImage } from '@/components/ui/EditorImage';
import { diffSaveData, MAX_CHANGES } from '@/lib/save-diff';
import { describeChange } from '@/lib/save-diff-labels';
import { useSaveStore } from '@/lib/save-store';

type Props = {
	defaultOpen?: boolean;
};

/**
 * "What did I actually change?", answered next to the export box.
 *
 * The store keeps the imported save as `originalSaveData` and every edit is
 * copy-on-write, so an untouched subtree is still the same object — the diff
 * costs about as much as the number of edits, not the size of the save, and
 * can be recomputed on every render.
 *
 * Renders nothing until the first edit, which keeps it out of the way in the
 * read-only tools that share this panel.
 */
export const SaveChangesSummary = ({ defaultOpen }: Props) => {
	const saveData = useSaveStore((state) => state.saveData);
	const originalSaveData = useSaveStore((state) => state.originalSaveData);

	const { changes, truncated } = useMemo(
		() => diffSaveData(originalSaveData, saveData),
		[originalSaveData, saveData]
	);
	const describedChanges = useMemo(() => changes.map(describeChange), [changes]);

	if (describedChanges.length === 0) {
		return null;
	}

	return (
		<details
			className='group rounded-(--radius-card) border border-(--color-line) bg-(--color-surface-sunken)'
			open={defaultOpen}
		>
			<summary className='flex cursor-pointer list-none items-center gap-2 px-3 py-2.5 text-[12px] text-(--color-fg) transition-colors duration-150 ease-snap marker:hidden hover:text-(--color-fg-strong) [&::-webkit-details-marker]:hidden'>
				<ChevronRight
					aria-hidden='true'
					className='h-3.5 w-3.5 shrink-0 text-(--color-fg-dim) transition-transform duration-200 ease-snap group-open:rotate-90 group-open:text-(--color-primary)'
				/>
				<span className='font-semibold'>Changes</span>
				<span className='rounded-full border border-(--color-line) bg-(--color-surface) px-2 py-0.5 text-[11px] tabular-nums text-(--color-fg-muted)'>
					{describedChanges.length}
					{truncated ? '+' : ''}
				</span>
				<span className='ml-auto text-[11px] text-(--color-fg-dim)'>vs. imported save</span>
			</summary>

			<ul className='max-h-72 overflow-y-auto border-t border-(--color-line-subtle)'>
				{describedChanges.map((change) => (
					<li
						className='grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-(--color-line-subtle) px-3 py-2 last:border-b-0'
						key={change.key}
					>
						{change.imageSrc ? (
							<EditorImage
								alt=''
								className='h-7 w-7 shrink-0 object-contain'
								size={28}
								src={change.imageSrc}
							/>
						) : (
							<div className='h-7 w-7 shrink-0 rounded-(--radius-control) border border-dashed border-(--color-line-soft)' />
						)}
						<span className='min-w-0 truncate text-[12px] text-(--color-fg)' title={change.label}>
							{change.label}
						</span>
						<span className='flex shrink-0 items-center gap-1.5 text-[12px] tabular-nums'>
							<span className='max-w-28 truncate text-(--color-fg-dim)' title={change.from}>
								{change.from}
							</span>
							<span aria-hidden='true' className='text-(--color-fg-dim)'>
								→
							</span>
							<span className='max-w-28 truncate font-semibold text-(--color-fg-strong)' title={change.to}>
								{change.to}
							</span>
						</span>
					</li>
				))}
			</ul>

			{truncated ? (
				<p className='border-t border-(--color-line-subtle) px-3 py-2 text-[11px] text-(--color-fg-dim)'>
					Only the first {MAX_CHANGES} changes are listed.
				</p>
			) : null}
		</details>
	);
};
