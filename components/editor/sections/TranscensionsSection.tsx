'use client';

import type { LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';
import { CollapsiblePanel } from '@/components/ui/CollapsiblePanel';
import { ToolLink } from '@/components/ui/ToolLink';
import { useSaveStore } from '@/lib/save-store';
import { setValueAtPath } from '@/lib/save-utils';

type Props = {
	defaultOpen?: boolean;
	icon?: LucideIcon;
	showToast: (message: string) => void;
	title?: string;
};

export const TranscensionsSection = ({ defaultOpen, icon, showToast, title }: Props) => {
	const t = useTranslations('editor.transcensions');
	const saveData = useSaveStore((state) => state.saveData);
	const updateSave = useSaveStore((state) => state.updateSave);

	return (
		<CollapsiblePanel
			defaultOpen={defaultOpen}
			description={t('description')}
			icon={icon}
			title={title ?? t('title')}
		>
			<div className='space-y-4 text-[12px] leading-6 text-(--color-fg-secondary)'>
				<p>{t('body')}</p>
				<div>
					<ToolLink href='/tools/transcension-viewer'>{t('viewHistory')}</ToolLink>
				</div>
				<p>
					{t.rich('inspect', {
						path: 'stats > transcensions',
						code: (chunks) => (
							<span className='rounded-(--radius-control) border border-(--color-line) bg-(--color-surface-muted) px-2 py-1 text-(--color-fg)'>
								{chunks}
							</span>
						)
					})}
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
							showToast(t('cleared'));
						}}
						variant='primary'
					>
						{t('clear')}
					</Button>
				</div>
			</div>
		</CollapsiblePanel>
	);
};
