import { useLocale } from 'next-intl';

import { formatDecimal, formatFixed, formatLargeNumber, formatNumber } from '@/lib/format';

/**
 * The `lib/format` formatters bound to the page locale, for display-only
 * output: the other locales group thousands with a dot or a space and use a
 * decimal comma. Editable inputs keep the default format, because their parser
 * strips commas. `locale` is exposed for domain formatters (`formatHeroSouls`,
 * `formatGoldExponent`) that take it directly.
 */
export const useNumberFormat = () => {
	const locale = useLocale();

	return {
		locale,
		number: (value: unknown) => formatNumber(value, locale),
		large: (value: unknown, exponentialAbove?: number) => formatLargeNumber(value, exponentialAbove, locale),
		decimal: (value: unknown) => formatDecimal(value, locale),
		fixed: (value: unknown, digits: number) => formatFixed(value, digits, locale)
	};
};
