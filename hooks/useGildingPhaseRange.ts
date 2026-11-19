'use client';

import { useLocale, useTranslations } from 'next-intl';

import { formatGoldExponent, type GildingPhase } from '@/lib/gilding-chart';

/** `e35 to e295`, `e108,838 onwards`: a phase's gold span in the page locale. */
export const useGildingPhaseRange = () => {
	const t = useTranslations('guides.gildingChart');
	const locale = useLocale();

	return ({ rangeFrom, rangeTo }: GildingPhase) =>
		rangeTo === null
			? t('rangeOnwards', { from: formatGoldExponent(rangeFrom, locale) })
			: t('range', { from: formatGoldExponent(rangeFrom, locale), to: formatGoldExponent(rangeTo, locale) });
};
