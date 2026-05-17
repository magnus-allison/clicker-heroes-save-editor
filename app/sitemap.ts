import type { MetadataRoute } from 'next';

import { seoSitemapEntries } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
	return seoSitemapEntries;
}
