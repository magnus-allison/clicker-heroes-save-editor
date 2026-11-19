'use client';

import { useTranslations } from 'next-intl';
import type { DurationUnits } from '@/lib/format';

export const useDurationUnits = (): DurationUnits => {
	const t = useTranslations('tools.shared.units');

	return { year: t('year'), day: t('day'), hour: t('hour'), minute: t('minute') };
};
