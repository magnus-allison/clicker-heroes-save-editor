import { getTranslations } from 'next-intl/server';

import { FeedbackSection } from '@/components/editor/sections/FeedbackSection';
import { Breadcrumb } from '@/components/home/Breadcrumb';
import { PageJsonLd } from '@/components/seo/PageJsonLd';
import { initLocale, pageMetadata, type LocaleParams } from '@/i18n/page';

export const generateMetadata = pageMetadata('requestTool');

export default async function RequestToolPage({ params }: LocaleParams) {
	const locale = await initLocale(params);
	const t = await getTranslations('editor.feedback.pages.requestTool');

	return (
		<>
			<PageJsonLd locale={locale} page='requestTool' />
			<Breadcrumb page='requestTool' title='tools' />
			<FeedbackSection
				defaultOpen
				description={t('description')}
				emptyMessageError={t('emptyMessage')}
				messageLabel={t('messageLabel')}
				messagePlaceholder={t('messagePlaceholder')}
				submitLabel={t('submit')}
				successMessage={t('success')}
				title={t('title')}
				topic='tool-request'
			/>
		</>
	);
}
