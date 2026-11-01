import type { FC } from 'react';
import { useTranslations } from 'next-intl';

import { ToolAbout } from '@/components/tools/ToolAbout';

export const MercenaryAbout: FC = () => {
	const t = useTranslations('toolAbout.mercenary');

	return (
		<ToolAbout
			id='about-mercenary-viewer'
			intro={t('intro')}
			related={['newPlayerGuide', 'saveEditor', 'transcensionViewer']}
			sections={[
				{ title: t('roster.title'), body: t('roster.body') },
				{ title: t('lifetimeStats.title'), body: t('lifetimeStats.body') }
			]}
		/>
	);
};
