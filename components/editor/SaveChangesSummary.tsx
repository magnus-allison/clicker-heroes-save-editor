'use client';

import { useMemo } from 'react';

import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useEditorText } from '@/hooks/useEditorText';
import { EditorImage } from '@/components/ui/EditorImage';
import { diffSaveData, MAX_CHANGES } from '@/lib/save-diff';
import { describeChange } from '@/lib/save-diff-labels';
import { useSaveStore } from '@/hooks/useSaveStore';

const countClassName =
	'rounded-full border border-line bg-surface-inset px-2 py-0.5 text-[11px] tabular-nums text-fg-muted';

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
 * Only the editing tools render it. Before the first edit it shows as a static
 * bar of the same height, so the first change doesn't shift the page.
 */
export const SaveChangesSummary = ({ defaultOpen }: Props) => {
	const saveData = useSaveStore((state) => state.saveData);
	const originalSaveData = useSaveStore((state) => state.originalSaveData);
	const t = useTranslations('editor.changes');
	const { resolve } = useEditorText();

	const { changes, truncated } = useMemo(
		() => diffSaveData(originalSaveData, saveData),
		[originalSaveData, saveData]
	);
	const describedChanges = useMemo(() => changes.map(describeChange), [changes]);
	const rows = describedChanges.map((change) => ({
		key: change.key,
		imageSrc: change.imageSrc,
		label: resolve(change.label),
		from: resolve(change.from),
		to: resolve(change.to)
	}));

	if (describedChanges.length === 0) {
		return (
			<div className='flex items-center gap-2 rounded-control border border-line bg-surface-inset px-3 py-2.5 text-[12px] text-fg-dim'>
				<ChevronRight aria-hidden='true' className='h-3.5 w-3.5 shrink-0 opacity-50' />
				<span className='font-semibold'>{t('title')}</span>
				<span className={countClassName}>0</span>
				<span className='ml-auto text-[11px]'>{t('none')}</span>
			</div>
		);
	}

	return (
		<details className='group rounded-control border border-line bg-surface-inset' open={defaultOpen}>
			<summary className='flex cursor-pointer list-none items-center gap-2 px-3 py-2.5 text-[12px] text-fg transition-colors duration-150 ease-snap marker:hidden hover:bg-surface-hover hover:text-fg-strong group-open:bg-surface-strong [&::-webkit-details-marker]:hidden'>
				<ChevronRight
					aria-hidden='true'
					className='h-3.5 w-3.5 shrink-0 text-fg-dim transition-transform duration-200 ease-snap group-open:rotate-90 group-open:text-primary'
				/>
				<span className='font-semibold'>{t('title')}</span>
				<span className={countClassName}>
					{describedChanges.length}
					{truncated ? '+' : ''}
				</span>
				<span className='ml-auto text-[11px] text-fg-dim'>{t('versus')}</span>
			</summary>

			<ul className='max-h-72 overflow-y-auto border-t border-line-subtle'>
				{rows.map((change) => (
					<li
						className='grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-line-subtle px-3 py-2 last:border-b-0'
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
							<div className='h-7 w-7 shrink-0 rounded-control border border-dashed border-line-soft' />
						)}
						<span className='min-w-0 truncate text-[12px] text-fg' title={change.label}>
							{change.label}
						</span>
						<span className='flex shrink-0 items-center gap-1.5 text-[12px] tabular-nums'>
							<span className='max-w-28 truncate text-fg-dim' title={change.from}>
								{change.from}
							</span>
							<span aria-hidden='true' className='text-fg-dim'>
								→
							</span>
							<span className='max-w-28 truncate font-semibold text-fg-strong' title={change.to}>
								{change.to}
							</span>
						</span>
					</li>
				))}
			</ul>

			{truncated ? (
				<p className='border-t border-line-subtle px-3 py-2 text-[11px] text-fg-dim'>
					{t('truncated', { count: MAX_CHANGES })}
				</p>
			) : null}
		</details>
	);
};
