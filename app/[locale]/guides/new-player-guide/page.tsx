import { NewPlayerGuide } from '@/components/guides/new-player-guide/NewPlayerGuide';
import { Breadcrumb } from '@/components/home/Breadcrumb';
import { PageJsonLd } from '@/components/seo/PageJsonLd';
import { initLocale, pageMetadata, type LocaleParams } from '@/i18n/page';

export const generateMetadata = pageMetadata('newPlayerGuide');

export default async function NewPlayerGuidePage({ params }: LocaleParams) {
	const locale = await initLocale(params);

	return (
		<>
			<PageJsonLd locale={locale} page='newPlayerGuide' />
			<Breadcrumb page='newPlayerGuide' title='guides' />
			<NewPlayerGuide />
		</>
	);
}
