import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { FileDownIcon, FileUpIcon } from 'lucide-react';

import { FolderTab } from '@/components/ui/FolderTab';
import { PanelSection } from '@/components/ui/PanelSection';
import { cn } from 'cn';

/**
 * Where a save field's own heading (icon and title) gives way to a folder tab
 * above it: `always`, or only from `lg`, where the panel splits into two
 * columns and each half gets a tab. The title stays in the field for screen
 * readers either way; only its look moves to the tab.
 */
export type HeadingInTab = 'always' | 'lg';

export const headingInTabClasses = {
	always: { icon: 'hidden', title: 'sr-only', row: 'mb-4' },
	lg: { icon: 'lg:hidden', title: 'lg:sr-only', row: 'lg:mb-4' }
} as const satisfies Record<HeadingInTab, { icon: string; title: string; row: string }>;

/**
 * The import/export card as a folder: the Import tab stands on the top-left
 * corner and, once the halves sit side by side, the Export tab stands over the
 * right half. Below `lg` the halves stack, so Export keeps its heading inside.
 * Pass `SaveImportField headingInTab='always'` and
 * `SaveExportField headingInTab='lg'` as the two children.
 */
export const SaveDataFolder = ({ children }: { children: ReactNode }) => {
	const t = useTranslations('editor');

	return (
		<div className='flex flex-col'>
			<div className='grid lg:grid-cols-2'>
				<FolderTab icon={FileUpIcon} title={t('importField.title')} />
				{/* Starts partway along the panel, on the column divider, so no pull-left. */}
				<FolderTab className={cn('ml-0 max-lg:hidden')} icon={FileDownIcon} title={t('exportField.title')} />
			</div>
			<PanelSection className='folder-panel grid rounded-tl-none p-0 lg:grid-cols-2'>{children}</PanelSection>
		</div>
	);
};
