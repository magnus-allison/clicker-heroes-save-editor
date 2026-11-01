import { InstakillCalculator } from '@/components/tools/instakill-calculator/InstakillCalculator';
import { InstakillAbout } from '@/components/tools/instakill-calculator/InstakillAbout';
import { PageJsonLd } from '@/components/seo/PageJsonLd';
import { initLocale, pageMetadata, type LocaleParams } from '@/i18n/page';

export const generateMetadata = pageMetadata('instakillCalculator');

export default async function InstakillCalculatorPage({ params }: LocaleParams) {
	const locale = await initLocale(params);

	return (
		<>
			<PageJsonLd locale={locale} page='instakillCalculator' />
			<InstakillCalculator />
			<InstakillAbout />
		</>
	);
}
