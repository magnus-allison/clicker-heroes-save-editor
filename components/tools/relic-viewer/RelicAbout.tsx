import type { FC } from 'react';
import { useTranslations } from 'next-intl';

import { ToolAbout } from '@/components/tools/ToolAbout';

export const RelicAbout: FC = () => {
	const t = useTranslations('toolAbout.relic');

	return (
		<ToolAbout
			id='about-relic-viewer'
			intro={t('intro')}
			related={['relicEditor', 'saveEditor', 'mercenaryViewer']}
			sections={[
				{ title: t('relics.title'), body: t('relics.body') },
				{ title: t('bonuses.title'), body: t('bonuses.body') }
			]}
		/>
	);
};
