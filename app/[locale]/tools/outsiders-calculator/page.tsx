import { OutsidersCalculator } from '@/components/tools/outsiders-calculator/OutsidersCalculator';
import { OutsidersAbout } from '@/components/tools/outsiders-calculator/OutsidersAbout';
import { PageJsonLd } from '@/components/seo/PageJsonLd';
import { initLocale, pageMetadata, type LocaleParams } from '@/i18n/page';

export const generateMetadata = pageMetadata('outsidersCalculator');

export default async function OutsidersCalculatorPage({ params }: LocaleParams) {
	const locale = await initLocale(params);

	return (
		<>
			<PageJsonLd locale={locale} page='outsidersCalculator' />
			<OutsidersCalculator />
			<OutsidersAbout />
		</>
	);
}
