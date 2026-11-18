import type { FC, ReactNode } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { GuideLink } from '@/components/guides/GuideLink';
import { ToolAbout } from '@/components/tools/ToolAbout';
import { toolLinks } from '@/components/tools/tool-links';
import type { Locale } from '@/i18n/routing';
import { ancientsCalculatorFaqs } from '@/lib/seo';

type Term = { name: string; body: string };

const Steps: FC<{ steps: readonly string[] }> = ({ steps }) => (
	<ol className='list-decimal space-y-1 pl-5'>
		{steps.map((step) => (
			<li key={step}>{step}</li>
		))}
	</ol>
);

const Terms: FC<{ terms: readonly Term[] }> = ({ terms }) => (
	<dl className='grid gap-2'>
		{terms.map((term) => (
			<div key={term.name}>
				<dt className='font-medium text-fg-strong'>{term.name}</dt>
				<dd>{term.body}</dd>
			</div>
		))}
	</dl>
);

export const AncientsAbout: FC = () => {
	const t = useTranslations('toolAbout.ancients');
	const locale = useLocale() as Locale;
	const link = (href: string) => ({
		link: (chunks: ReactNode) => <GuideLink href={href}>{chunks}</GuideLink>
	});

	return (
		<ToolAbout
			faqs={ancientsCalculatorFaqs(locale)}
			id='about-ancients-calculator'
			intro={t('intro')}
			related={['saveEditor', 'outsidersCalculator', 'transcensionViewer', 'gildingChart', 'newPlayerGuide']}
			sections={[
				{ title: t('howTo.title'), body: <Steps steps={t.raw('howTo.steps') as string[]} /> },
				{ title: t('builds.title'), body: t.rich('builds.body', link(toolLinks.progressTips)) },
				{ title: t('bestHero.title'), body: t.rich('bestHero.body', link(toolLinks.gildingChart)) },
				{ title: t('settings.title'), body: <Terms terms={t.raw('settings.items') as Term[]} /> },
				{ title: t('results.title'), body: <Terms terms={t.raw('results.items') as Term[]} /> },
				{ title: t('example.title'), body: t('example.body') }
			]}
		/>
	);
};
