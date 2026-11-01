import { notFound } from 'next/navigation';

import { initLocale, type LocaleParams } from '@/i18n/page';

/** Sends unknown paths to `[locale]/not-found.tsx`, inside the localized layout. */
export default async function CatchAllPage({ params }: LocaleParams) {
	await initLocale(params);
	notFound();
}
