'use client';

import { useLocale, useTranslations } from 'next-intl';

import { Link, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

/**
 * Links to the current page in every other language. Plain links rather than a
 * select, so crawlers also follow them between the language versions.
 */
export const LocaleSwitcher = () => {
	const t = useTranslations('common');
	const locale = useLocale();
	const pathname = usePathname();

	return (
		<p className='flex flex-wrap items-center gap-x-3'>
			<span>{t('footer.language')}:</span>
			{routing.locales.map((option) =>
				option === locale ? (
					<span aria-current='true' className='text-fg-strong' key={option} lang={option}>
						{t(`localeNames.${option}`)}
					</span>
				) : (
					<Link
						className='inline-block py-1 transition-colors hover:text-fg-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring'
						href={pathname}
						hrefLang={option}
						key={option}
						lang={option}
						locale={option}
					>
						{t(`localeNames.${option}`)}
					</Link>
				)
			)}
		</p>
	);
};
