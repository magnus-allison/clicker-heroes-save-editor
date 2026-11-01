import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { routing, type Locale } from '@/i18n/routing';
import { createPageMetadata, type SeoPageKey } from '@/lib/seo';

export type LocaleParams = { params: Promise<{ locale: string }> };

/**
 * Resolves and validates a page's `[locale]` segment and registers it for
 * static rendering. Every layout and page under `app/[locale]` calls this
 * before reading translations, or the route falls back to dynamic rendering.
 */
export const initLocale = async (params: LocaleParams['params']): Promise<Locale> => {
	const { locale } = await params;

	if (!hasLocale(routing.locales, locale)) notFound();

	setRequestLocale(locale);

	return locale;
};

/** A page's `generateMetadata`: its title, description, canonical and hreflang in the requested locale. */
export const pageMetadata =
	(key: SeoPageKey) =>
	async ({ params }: LocaleParams): Promise<Metadata> => {
		const { locale } = await params;

		return createPageMetadata(key, hasLocale(routing.locales, locale) ? locale : routing.defaultLocale);
	};
