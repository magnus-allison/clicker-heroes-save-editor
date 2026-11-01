import type { FC } from 'react';
import { useTranslations } from 'next-intl';

import { GuideLink } from '@/components/guides/GuideLink';
import { ToolAbout } from '@/components/tools/ToolAbout';

export const AncientsAbout: FC = () => {
	const t = useTranslations('toolAbout.ancients');

	return (
		<ToolAbout
			id='about-ancients-calculator'
			intro={t.rich('intro', {
				link: (chunks) => <GuideLink href='https://kepow.org/clickerheroes/'>{chunks}</GuideLink>
			})}
			related={['outsidersCalculator', 'gildingChart', 'transcensionViewer']}
			sections={[
				{ title: t('builds.title'), body: t('builds.body') },
				{ title: t('bestHero.title'), body: t('bestHero.body') }
			]}
		/>
	);
};
