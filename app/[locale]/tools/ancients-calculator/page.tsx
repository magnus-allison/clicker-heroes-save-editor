import { AncientsCalculator } from '@/components/tools/ancients-calculator/AncientsCalculator';
import { AncientsAbout } from '@/components/tools/ancients-calculator/AncientsAbout';
import { PageJsonLd } from '@/components/seo/PageJsonLd';
import { initLocale, pageMetadata, type LocaleParams } from '@/i18n/page';

export const generateMetadata = pageMetadata('ancientsCalculator');

export default async function AncientsCalculatorPage({ params }: LocaleParams) {
	const locale = await initLocale(params);

	return (
		<>
			<PageJsonLd locale={locale} page='ancientsCalculator' />
			<AncientsCalculator />
			<AncientsAbout />
		</>
	);
}
