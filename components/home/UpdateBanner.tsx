import { type FC } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';

import { toolLinks } from '@/components/tools/tool-links';
import { Link } from '@/i18n/navigation';

const linkClassName =
	'group inline-flex items-center gap-1.5 rounded-sm text-[11px] font-semibold text-(--color-info) focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-1 focus-visible:outline-(--color-focus-ring)';

/**
 * Home-page notice for the latest game update (currently the Orc auto clicker
 * skin), linking to the Save Editor's skins panel. Same shape as
 * `LastSaveBanner`, in the theme info blue.
 */
export const UpdateBanner: FC = () => {
	const t = useTranslations('common.home.update');

	return (
		<aside
			aria-label={t('label')}
			className='-mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-(--radius-card) border border-(--color-info-line) bg-(--color-info-surface) px-4 py-2.5'
		>
			<span className='inline-flex h-5 shrink-0 items-center rounded-full border border-(--color-info-line) px-2 text-[10px] font-bold tracking-wide text-(--color-info)'>
				{t('badge')}
			</span>
			<img
				alt=''
				aria-hidden='true'
				className='-my-2 h-12 w-12 shrink-0 object-contain'
				src='/assets/autoclickers/Autoclicker_orc_animated.webp'
			/>
			<span className='min-w-0 text-xs text-fg-secondary'>{t('text')}</span>
			<span className='ml-auto inline-flex shrink-0 items-center gap-4'>
				<Link className={linkClassName} href={{ pathname: toolLinks.saveEditor, hash: 'skins' }}>
					{t('link')}
					<ArrowRight
						aria-hidden='true'
						className='h-3 w-3 transition-transform group-hover:translate-x-0.5'
					/>
				</Link>
			</span>
		</aside>
	);
};
