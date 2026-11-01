import { defineRouting } from 'next-intl/routing';

/*
 * English keeps the unprefixed URLs it already ranks with (`/tools/save-editor`);
 * Spanish lives under `/es`. Nothing redirects on the browser's language —
 * search engines crawl without one, and every version must stay reachable by
 * its own URL. hreflang comes from page metadata (`lib/seo.ts`) rather than
 * the proxy's `Link` header, so there is a single source for it.
 */
export const routing = defineRouting({
	locales: ['en', 'es'],
	defaultLocale: 'en',
	localePrefix: 'as-needed',
	localeDetection: false,
	localeCookie: false,
	alternateLinks: false
});

export type Locale = (typeof routing.locales)[number];
