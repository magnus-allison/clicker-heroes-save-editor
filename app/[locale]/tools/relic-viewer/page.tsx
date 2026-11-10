import { RelicViewer } from '@/components/tools/relic-viewer/RelicViewer';
import { RelicAbout } from '@/components/tools/relic-viewer/RelicAbout';
import { PageJsonLd } from '@/components/seo/PageJsonLd';
import { initLocale, pageMetadata, type LocaleParams } from '@/i18n/page';

export const generateMetadata = pageMetadata('relicViewer');

export default async function RelicViewerPage({ params }: LocaleParams) {
	const locale = await initLocale(params);

	return (
		<>
			<PageJsonLd locale={locale} page='relicViewer' />
			<RelicViewer />
			<RelicAbout />
		</>
	);
}
