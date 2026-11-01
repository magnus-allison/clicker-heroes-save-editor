import { RemoveClanDataEditor } from '@/components/editor/RemoveClanDataEditor';
import { RemoveClanDataAbout } from '@/components/tools/remove-clan-data/RemoveClanDataAbout';
import { PageJsonLd } from '@/components/seo/PageJsonLd';
import { initLocale, pageMetadata, type LocaleParams } from '@/i18n/page';

export const generateMetadata = pageMetadata('removeClanData');

export default async function RemoveClanDataPage({ params }: LocaleParams) {
	const locale = await initLocale(params);

	return (
		<>
			<PageJsonLd locale={locale} page='removeClanData' />
			<RemoveClanDataEditor />
			<RemoveClanDataAbout />
		</>
	);
}
