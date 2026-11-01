import type { FC } from 'react';
import { useTranslations } from 'next-intl';

import { ToolAbout } from '@/components/tools/ToolAbout';

export const InstakillAbout: FC = () => {
	const t = useTranslations('toolAbout.instakill');

	return (
		<ToolAbout
			id='about-instakill-calculator'
			intro={t('intro')}
			related={['outsidersCalculator', 'ancientsCalculator', 'progressTips']}
			sections={[
				{ title: t('monstersPerZone.title'), body: t('monstersPerZone.body') },
				{ title: t('routeTime.title'), body: t('routeTime.body') }
			]}
		/>
	);
};
