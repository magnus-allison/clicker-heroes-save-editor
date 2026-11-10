import { RelicEditor } from '@/components/tools/relic-editor/RelicEditor';
import { RelicEditorAbout } from '@/components/tools/relic-editor/RelicEditorAbout';
import { PageJsonLd } from '@/components/seo/PageJsonLd';
import { initLocale, pageMetadata, type LocaleParams } from '@/i18n/page';

export const generateMetadata = pageMetadata('relicEditor');

export default async function RelicEditorPage({ params }: LocaleParams) {
	const locale = await initLocale(params);

	return (
		<>
			<PageJsonLd locale={locale} page='relicEditor' />
			<RelicEditor />
			<RelicEditorAbout />
		</>
	);
}
