import type { FC } from 'react';
import { useTranslations } from 'next-intl';

import { ToolAbout } from '@/components/tools/ToolAbout';

export const RelicEditorAbout: FC = () => {
	const t = useTranslations('toolAbout.relicEditor');

	return (
		<ToolAbout
			id='about-relic-editor'
			intro={t('intro')}
			related={['relicViewer', 'saveEditor', 'saveConverter']}
			sections={[
				{ title: t('editing.title'), body: t('editing.body') },
				{ title: t('safety.title'), body: t('safety.body') }
			]}
		/>
	);
};
