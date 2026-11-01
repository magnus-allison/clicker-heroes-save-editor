import type { FC } from 'react';
import { useTranslations } from 'next-intl';

import { GuideLink } from '@/components/guides/GuideLink';
import { ToolAbout } from '@/components/tools/ToolAbout';

export const OutsidersAbout: FC = () => {
	const t = useTranslations('toolAbout.outsiders');

	return (
		<ToolAbout
			id='about-outsiders-calculator'
			intro={t.rich('intro', {
				link: (chunks) => (
					<GuideLink href='https://driej.github.io/Clicker-Heroes-Outsiders/'>{chunks}</GuideLink>
				)
			})}
			related={['ancientsCalculator', 'instakillCalculator', 'transcensionViewer']}
			sections={[
				{ title: t('spendingOrder.title'), body: t('spendingOrder.body') },
				{ title: t('applying.title'), body: t('applying.body') }
			]}
		/>
	);
};
