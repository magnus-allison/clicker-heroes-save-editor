import type { FC } from 'react';
import { useTranslations } from 'next-intl';

import { ToolAbout } from '@/components/tools/ToolAbout';

export const OutsidersAbout: FC = () => {
	const t = useTranslations('toolAbout.outsiders');

	return (
		<ToolAbout
			id='about-outsiders-calculator'
			intro={t('intro')}
			related={['ancientsCalculator', 'instakillCalculator', 'transcensionViewer']}
			sections={[
				{ title: t('spendingOrder.title'), body: t('spendingOrder.body') },
				{ title: t('applying.title'), body: t('applying.body') }
			]}
		/>
	);
};
