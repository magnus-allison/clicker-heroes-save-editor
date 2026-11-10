import { type FC } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';

import { toolLinks } from '@/components/tools/tool-links';
import { Link } from '@/i18n/navigation';

const linkClassName =
	'group inline-flex items-center gap-1.5 rounded-sm text-[11px] font-semibold text-(--color-banner-accent) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)';

/** Home-page notice for the relic tools; same shape as `LastSaveBanner`, in the site banner purple. */
export const NewToolsBanner: FC = () => {
	const t = useTranslations('common.home.newTools');

	return (
		<aside
			aria-label={t('label')}
			className='-mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-(--radius-card) border border-(--color-banner-pill-edge) bg-(--color-banner-pill) px-4 py-2.5'
		>
			<span className='inline-flex h-5 shrink-0 items-center rounded-full border border-(--color-banner-pill-edge) px-2 text-[10px] font-bold tracking-wide text-(--color-banner-accent)'>
				{t('badge')}
			</span>
			<img
				alt=''
				aria-hidden='true'
				className='h-5 w-5 shrink-0 object-contain'
				src='/assets/relics/6.webp'
			/>
			<span className='min-w-0 text-xs text-fg-secondary'>{t('text')}</span>
			<span className='ml-auto inline-flex shrink-0 items-center gap-4'>
				<Link className={linkClassName} href={toolLinks.relicViewer}>
					{t('viewer')}
					<ArrowRight
						aria-hidden='true'
						className='h-3 w-3 transition-transform group-hover:translate-x-0.5'
					/>
				</Link>
				<Link className={linkClassName} href={toolLinks.relicEditor}>
					{t('editor')}
					<ArrowRight
						aria-hidden='true'
						className='h-3 w-3 transition-transform group-hover:translate-x-0.5'
					/>
				</Link>
			</span>
		</aside>
	);
};
