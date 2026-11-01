import { SaveJson } from '@/components/tools/save-json/SaveJson';
import { SaveJsonAbout } from '@/components/tools/save-json/SaveJsonAbout';
import { PageJsonLd } from '@/components/seo/PageJsonLd';
import { initLocale, pageMetadata, type LocaleParams } from '@/i18n/page';

export const generateMetadata = pageMetadata('saveJson');

export default async function SaveJsonPage({ params }: LocaleParams) {
	const locale = await initLocale(params);

	return (
		<>
			<PageJsonLd locale={locale} page='saveJson' />
			<SaveJson />
			<SaveJsonAbout />
		</>
	);
}
