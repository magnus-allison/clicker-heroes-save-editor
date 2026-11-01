import type { FC } from 'react';
import { useTranslations } from 'next-intl';

import { ToolAbout } from '@/components/tools/ToolAbout';

export const SaveConverterAbout: FC = () => {
	const t = useTranslations('toolAbout.saveConverter');

	return (
		<ToolAbout
			id='about-save-converter'
			intro={t('intro')}
			related={['saveEditor', 'removeClanData', 'faq']}
			sections={[{ title: t('difference.title'), body: t('difference.body') }]}
		/>
	);
};
