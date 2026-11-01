import { ProgressTipsGuide } from '@/components/guides/progress-tips/ProgressTipsGuide';
import { Breadcrumb } from '@/components/home/Breadcrumb';
import { PageJsonLd } from '@/components/seo/PageJsonLd';
import { initLocale, pageMetadata, type LocaleParams } from '@/i18n/page';

export const generateMetadata = pageMetadata('progressTips');

export default async function ProgressTipsPage({ params }: LocaleParams) {
	const locale = await initLocale(params);

	return (
		<>
			<PageJsonLd locale={locale} page='progressTips' />
			<Breadcrumb page='progressTips' title='guides' />
			<ProgressTipsGuide />
		</>
	);
}
