import type { MetadataRoute } from 'next';

const siteUrl = 'https://clickerheroes.dev';

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: siteUrl,
			lastModified: new Date('2026-05-10'),
			changeFrequency: 'weekly',
			priority: 1,
			images: [`${siteUrl}/assets/opengraph/opengraph-image.png`]
		}
	];
}
