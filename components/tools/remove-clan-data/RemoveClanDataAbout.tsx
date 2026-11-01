import type { FC } from 'react';
import { useTranslations } from 'next-intl';

import { ToolAbout } from '@/components/tools/ToolAbout';

export const RemoveClanDataAbout: FC = () => {
	const t = useTranslations('toolAbout.removeClanData');

	return (
		<ToolAbout
			id='about-remove-clan-data'
			intro={t('intro')}
			related={['saveEditor', 'saveConverter', 'faq']}
			sections={[{ title: t('removed.title'), body: t('removed.body') }]}
		/>
	);
};
