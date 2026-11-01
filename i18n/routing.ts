import { defineRouting } from 'next-intl/routing';

/*
 * English keeps the unprefixed URLs it already ranks with (`/tools/save-editor`);
 * Spanish and German live under `/es` and `/de`. Nothing redirects on the browser's language —
 * search engines crawl without one, and every version must stay reachable by
 * its own URL. hreflang comes from page metadata (`lib/seo.ts`) rather than
 * the proxy's `Link` header, so there is a single source for it.
 */
export const routing = defineRouting({
	locales: ['en', 'es', 'de'],
	defaultLocale: 'en',
	localePrefix: 'as-needed',
	localeDetection: false,
	localeCookie: false,
	alternateLinks: false
});

export type Locale = (typeof routing.locales)[number];

/**
 * The path a page lives at in a locale: the default locale unprefixed, others
 * under `/<locale>`. Mirrors `localePrefix: 'as-needed'`.
 */
export const localizedPath = (path: string, locale: Locale) =>
	locale === routing.defaultLocale ? path : `/${locale}${path === '/' ? '' : path}`;
