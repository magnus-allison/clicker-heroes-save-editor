import { getTranslations } from 'next-intl/server';

import { FeedbackSection } from '@/components/editor/sections/FeedbackSection';
import { Breadcrumb } from '@/components/home/Breadcrumb';
import { PageJsonLd } from '@/components/seo/PageJsonLd';
import { initLocale, pageMetadata, type LocaleParams } from '@/i18n/page';

export const generateMetadata = pageMetadata('feedback');

export default async function FeedbackPage({ params }: LocaleParams) {
	const locale = await initLocale(params);
	const t = await getTranslations('editor.feedback.pages.feedback');

	return (
		<>
			<PageJsonLd locale={locale} page='feedback' />
			<Breadcrumb page='feedback' title='additional info' />
			<FeedbackSection defaultOpen description={t('description')} title={t('title')} />
		</>
	);
}
