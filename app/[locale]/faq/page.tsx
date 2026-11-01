import { FaqContent } from '@/components/faq/FaqContent';
import { Breadcrumb } from '@/components/home/Breadcrumb';
import { PageJsonLd } from '@/components/seo/PageJsonLd';
import { initLocale, pageMetadata, type LocaleParams } from '@/i18n/page';

export const generateMetadata = pageMetadata('faq');

export default async function FaqPage({ params }: LocaleParams) {
	const locale = await initLocale(params);

	return (
		<>
			<PageJsonLd locale={locale} page='faq' />
			<Breadcrumb page='faq' title='additional info' />
			<FaqContent locale={locale} />
		</>
	);
}
