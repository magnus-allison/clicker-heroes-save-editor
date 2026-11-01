import { getTranslations } from 'next-intl/server';

import type { Locale } from '@/i18n/routing';
import { createPageJsonLd, serializeJsonLd, type SeoPageKey } from '@/lib/seo';

interface Props {
	locale: Locale;
	page: SeoPageKey;
}

/** The page's JSON-LD graph, with its breadcrumb named as the page's `<h1>` is. */
export const PageJsonLd = async ({ locale, page }: Props) => {
	const t = await getTranslations({ locale, namespace: 'common' });
	const pageName = page === 'home' ? t('home.title') : t(`pages.${page}`);

	return (
		<script
			type='application/ld+json'
			dangerouslySetInnerHTML={{ __html: serializeJsonLd(createPageJsonLd(page, locale, pageName)) }}
		/>
	);
};
