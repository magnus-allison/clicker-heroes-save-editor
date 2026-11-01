import { MercenaryViewer } from '@/components/tools/mercenary-viewer/MercenaryViewer';
import { MercenaryAbout } from '@/components/tools/mercenary-viewer/MercenaryAbout';
import { PageJsonLd } from '@/components/seo/PageJsonLd';
import { initLocale, pageMetadata, type LocaleParams } from '@/i18n/page';

export const generateMetadata = pageMetadata('mercenaryViewer');

export default async function MercenaryViewerPage({ params }: LocaleParams) {
	const locale = await initLocale(params);

	return (
		<>
			<PageJsonLd locale={locale} page='mercenaryViewer' />
			<MercenaryViewer />
			<MercenaryAbout />
		</>
	);
}
