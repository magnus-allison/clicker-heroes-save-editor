import type { FC } from 'react';
import { useTranslations } from 'next-intl';

import { ToolAbout } from '@/components/tools/ToolAbout';

export const SaveJsonAbout: FC = () => {
	const t = useTranslations('toolAbout.saveJson');

	return (
		<ToolAbout
			id='about-save-json'
			intro={t('intro')}
			related={['saveEditor', 'saveConverter', 'faq']}
			sections={[{ title: t('careful.title'), body: t('careful.body') }]}
		/>
	);
};
