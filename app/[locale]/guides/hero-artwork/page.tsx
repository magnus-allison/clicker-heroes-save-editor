import { HeroArtworkGuide } from '@/components/guides/hero-artwork/HeroArtworkGuide';
import { Breadcrumb } from '@/components/home/Breadcrumb';
import { PageJsonLd } from '@/components/seo/PageJsonLd';
import { initLocale, pageMetadata, type LocaleParams } from '@/i18n/page';

export const generateMetadata = pageMetadata('heroArtwork');

export default async function HeroArtworkPage({ params }: LocaleParams) {
	const locale = await initLocale(params);

	return (
		<>
			<PageJsonLd locale={locale} page='heroArtwork' />
			<Breadcrumb page='heroArtwork' title='guides' />
			<HeroArtworkGuide />
		</>
	);
}
