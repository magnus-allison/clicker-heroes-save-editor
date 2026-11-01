import createMiddleware from 'next-intl/middleware';

import { routing } from '@/i18n/routing';

/*
 * Maps unprefixed URLs onto the English `[locale]` routes and strips a
 * redundant `/en` prefix. API routes, Next internals, and anything with a file
 * extension (sitemap, robots, images, fonts) skip it.
 */
export default createMiddleware(routing);

export const config = {
	matcher: '/((?!api|_next|_vercel|.*\\..*).*)'
};
