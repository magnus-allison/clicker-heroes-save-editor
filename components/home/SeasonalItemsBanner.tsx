import { type FC } from 'react';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';

export const SeasonalItemsBanner: FC = () => {
	const t = useTranslations('editor.seasonalBanner');

	return (
		<Link
			className='group flex flex-wrap items-center gap-x-3 gap-y-2 rounded-(--radius-card) border border-(--color-gilded-line) bg-(--color-gilded-surface) px-4 py-2.5 hover:border-(--color-gold) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)'
			href='/tools/save-editor'
		>
			<span className='inline-flex h-5 shrink-0 items-center rounded-full border border-(--color-gilded-line) px-2 text-[10px] font-bold tracking-wide text-(--color-gold)'>
				{t('badge')}
			</span>
			<img
				alt=''
				aria-hidden='true'
				className='h-4 w-4 shrink-0 object-contain'
				src='/assets/seasonalItems/clickmas_present.webp'
			/>
			<span className='min-w-0 text-xs text-fg-secondary'>{t('text')}</span>
			<span className='ml-auto inline-flex shrink-0 items-center gap-1.5 text-[11px] font-semibold text-(--color-gold)'>
				{t('cta')}
				<ArrowRight aria-hidden='true' className='h-3 w-3 transition-transform group-hover:translate-x-0.5' />
			</span>
		</Link>
	);
};
