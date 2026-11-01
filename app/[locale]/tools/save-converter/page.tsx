import { SaveConverter } from '@/components/tools/save-converter/SaveConverter';
import { SaveConverterAbout } from '@/components/tools/save-converter/SaveConverterAbout';
import { PageJsonLd } from '@/components/seo/PageJsonLd';
import { initLocale, pageMetadata, type LocaleParams } from '@/i18n/page';

export const generateMetadata = pageMetadata('saveConverter');

export default async function SaveConverterPage({ params }: LocaleParams) {
	const locale = await initLocale(params);

	return (
		<>
			<PageJsonLd locale={locale} page='saveConverter' />
			<SaveConverter />
			<SaveConverterAbout />
		</>
	);
}
