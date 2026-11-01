import { GildingChartGuide } from '@/components/guides/gilding-chart/GildingChartGuide';
import { Breadcrumb } from '@/components/home/Breadcrumb';
import { PageJsonLd } from '@/components/seo/PageJsonLd';
import { initLocale, pageMetadata, type LocaleParams } from '@/i18n/page';

export const generateMetadata = pageMetadata('gildingChart');

export default async function GildingChartPage({ params }: LocaleParams) {
	const locale = await initLocale(params);

	return (
		<>
			<PageJsonLd locale={locale} page='gildingChart' />
			<Breadcrumb page='gildingChart' title='guides' />
			<GildingChartGuide />
		</>
	);
}
