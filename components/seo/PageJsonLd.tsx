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
	// The home title marks its second line and last words for the hero's
	// styling; the tags are dropped here, keeping just the words.
	const pageName =
		page === 'home'
			? t.markup('home.title', { line: (chunks) => chunks, accent: (chunks) => chunks })
			: t(`pages.${page}`);

	return (
		<script
			type='application/ld+json'
			dangerouslySetInnerHTML={{ __html: serializeJsonLd(createPageJsonLd(page, locale, pageName)) }}
		/>
	);
};
