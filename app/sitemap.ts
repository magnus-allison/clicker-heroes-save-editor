import type { MetadataRoute } from 'next';

const siteUrl = 'https://clickerheroes.dev';

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: siteUrl,
			lastModified: new Date('2026-05-08'),
			changeFrequency: 'weekly',
			priority: 1,
			images: [`${siteUrl}/assets/icons/clicker-heroes.png`]
		}
	];
}
