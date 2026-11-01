import { FeedbackSection } from '@/components/editor/sections/FeedbackSection';
import { Breadcrumb } from '@/components/home/Breadcrumb';
import { PageJsonLd } from '@/components/seo/PageJsonLd';
import { initLocale, pageMetadata, type LocaleParams } from '@/i18n/page';

export const generateMetadata = pageMetadata('requestTool');

export default async function RequestToolPage({ params }: LocaleParams) {
	const locale = await initLocale(params);

	return (
		<>
			<PageJsonLd locale={locale} page='requestTool' />
			<Breadcrumb page='requestTool' title='tools' />
			<FeedbackSection
				defaultOpen
				description='Describe the tool you want, what it should work out, and how you would use it.'
				emptyMessageError='Describe the tool before sending your request.'
				messageLabel='Your tool request'
				messagePlaceholder='What should the tool do? What would you put in, and what should it tell you?'
				submitLabel='Send request'
				successMessage='Tool request sent.'
				title='Request a Tool'
				topic='tool-request'
			/>
		</>
	);
}
