import { FeedbackSection } from '@/components/editor/sections/FeedbackSection';
import { Breadcrumb } from '@/components/home/Breadcrumb';
import { PageJsonLd } from '@/components/seo/PageJsonLd';
import { initLocale, pageMetadata, type LocaleParams } from '@/i18n/page';

export const generateMetadata = pageMetadata('requestGuide');

export default async function RequestGuidePage({ params }: LocaleParams) {
	const locale = await initLocale(params);

	return (
		<>
			<PageJsonLd locale={locale} page='requestGuide' />
			<Breadcrumb page='requestGuide' title='guides' />
			<FeedbackSection
				defaultOpen
				description='Tell us the topic you are stuck on and what an ideal guide would cover.'
				emptyMessageError='Describe the guide before sending your request.'
				messageLabel='Your guide request'
				messagePlaceholder='What topic should the guide cover, and where are you getting stuck?'
				submitLabel='Send request'
				successMessage='Guide request sent.'
				title='Request a Guide'
				topic='guide-request'
			/>
		</>
	);
}
