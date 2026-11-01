import { TranscensionViewer } from '@/components/tools/transcension-viewer/TranscensionViewer';
import { TranscensionAbout } from '@/components/tools/transcension-viewer/TranscensionAbout';
import { PageJsonLd } from '@/components/seo/PageJsonLd';
import { initLocale, pageMetadata, type LocaleParams } from '@/i18n/page';

export const generateMetadata = pageMetadata('transcensionViewer');

export default async function TranscensionViewerPage({ params }: LocaleParams) {
	const locale = await initLocale(params);

	return (
		<>
			<PageJsonLd locale={locale} page='transcensionViewer' />
			<TranscensionViewer />
			<TranscensionAbout />
		</>
	);
}
