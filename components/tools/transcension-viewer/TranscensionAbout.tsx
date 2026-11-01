import type { FC } from 'react';
import { useTranslations } from 'next-intl';

import { ToolAbout } from '@/components/tools/ToolAbout';

export const TranscensionAbout: FC = () => {
	const t = useTranslations('toolAbout.transcension');

	return (
		<ToolAbout
			id='about-transcension-viewer'
			intro={t('intro')}
			related={['outsidersCalculator', 'ancientsCalculator', 'progressTips']}
			sections={[
				{ title: t('shows.title'), body: t('shows.body') },
				{ title: t('helps.title'), body: t('helps.body') }
			]}
		/>
	);
};
