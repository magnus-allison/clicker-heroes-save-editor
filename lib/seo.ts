import type { Metadata, MetadataRoute } from 'next';

import { localizedPath, routing, type Locale } from '@/i18n/routing';
import enSeo from '@/messages/en/seo.json';
import esSeo from '@/messages/es/seo.json';
import deSeo from '@/messages/de/seo.json';

export const SITE_CONFIG = {
	url: 'https://clickerheroes.dev',
	siteName: 'clickerheroes.dev',
	alternateName: 'Clicker Heroes Tools',
	author: {
		name: 'Magnus Allison',
		url: 'https://github.com/magnus-allison'
	},
	ogImage: '/opengraph.png'
} as const;

/*
 * Page titles, descriptions, and FAQs live in `messages/<locale>/seo.json`, so
 * every language has the same shape. It is read directly rather than through
 * next-intl because metadata, JSON-LD and the sitemap are plain functions.
 */
const seoText: Record<Locale, typeof enSeo> = { en: enSeo, es: esSeo, de: deSeo };

/** Open Graph wants a territory; hreflang does not. */
const ogLocales: Record<Locale, string> = { en: 'en_US', es: 'es_ES', de: 'de_DE' };

const baseKeywords = [
	'clicker heroes',
	'clicker heroes save editor',
	'clicker heroes save file editor',
	'clicker heroes save decoder',
	'clicker heroes save encoder',
	'clicker heroes tools',
	'idle game save editor'
];

export type Faq = {
	question: string;
	answer: string;
};

export const siteDescription = (locale: Locale) => seoText[locale].site.description;

/** The fallback `<title>`, used by pages without their own (the 404 page). */
export const siteTitle = (locale: Locale) => seoText[locale].pages.home.metaTitle;

export const saveEditorFaqs = (locale: Locale): readonly Faq[] => seoText[locale].faqs.saveEditor;

export const gildingChartFaqs = (locale: Locale): readonly Faq[] => seoText[locale].faqs.gildingChart;

/**
 * The `/faq` page. Grouped for the page itself; `FAQPage` structured data
 * flattens the same entries, so the two can never drift.
 */
export const siteFaqSections = (locale: Locale) => seoText[locale].faqs.site;

type SeoPage = {
	path: string;
	keywords: string[];
	changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
	priority: number;
	schemaType?: 'Article' | 'CollectionPage' | 'ContactPage' | 'WebApplication';
	/**
	 * ISO date the page's content last meaningfully changed. Feeds the sitemap
	 * and, for articles, `dateModified` — bump it when you edit the page.
	 */
	lastModified: string;
	/** ISO date. Required by `Article` schema; ignored by every other page type. */
	datePublished?: string;
};

export const seoPages = {
	home: {
		path: '/',
		keywords: [
			'clicker heroes tools',
			'clicker heroes save editor',
			'clicker heroes calculator',
			'clicker heroes save tools'
		],
		changeFrequency: 'weekly',
		priority: 1,
		schemaType: 'CollectionPage',
		lastModified: '2026-09-29'
	},
	saveEditor: {
		path: '/tools/save-editor',
		keywords: [
			'clicker heroes save editor',
			'clicker heroes save file editor',
			'clicker heroes gold editor',
			'clicker heroes rubies editor',
			'clicker heroes hero souls editor',
			'clicker heroes ancients editor',
			'clicker heroes achievements editor'
		],
		changeFrequency: 'weekly',
		priority: 0.95,
		lastModified: '2026-09-14',
		schemaType: 'WebApplication'
	},
	instakillCalculator: {
		path: '/tools/instakill-calculator',
		keywords: [
			'clicker heroes instakill calculator',
			'clicker heroes zones per hour',
			'clicker heroes kumawakamaru',
			'clicker heroes borb',
			'clicker heroes monsters per zone'
		],
		changeFrequency: 'monthly',
		priority: 0.75,
		lastModified: '2026-08-26',
		schemaType: 'WebApplication'
	},
	ancientsCalculator: {
		path: '/tools/ancients-calculator',
		keywords: [
			'clicker heroes ancients calculator',
			'clicker heroes ancient optimizer',
			'clicker heroes rules of thumb',
			'clicker heroes idle build',
			'clicker heroes hybrid build',
			'clicker heroes ancient souls planner',
			'clicker heroes hero souls calculator'
		],
		changeFrequency: 'monthly',
		priority: 0.85,
		lastModified: '2026-08-26',
		schemaType: 'WebApplication'
	},
	outsidersCalculator: {
		path: '/tools/outsiders-calculator',
		keywords: [
			'clicker heroes outsiders calculator',
			'clicker heroes outsider levels',
			'clicker heroes borb calculator',
			'clicker heroes phandoryss',
			'clicker heroes ponyboy',
			'clicker heroes chorgorloth',
			'clicker heroes ancient souls calculator',
			'clicker heroes transcension simulator'
		],
		changeFrequency: 'monthly',
		priority: 0.85,
		lastModified: '2026-08-26',
		schemaType: 'WebApplication'
	},
	transcensionViewer: {
		path: '/tools/transcension-viewer',
		keywords: [
			'clicker heroes transcension viewer',
			'clicker heroes ascension history',
			'clicker heroes save viewer',
			'clicker heroes ancient souls'
		],
		changeFrequency: 'monthly',
		priority: 0.75,
		lastModified: '2026-09-14',
		schemaType: 'WebApplication'
	},
	mercenaryViewer: {
		path: '/tools/mercenary-viewer',
		keywords: [
			'clicker heroes mercenary viewer',
			'clicker heroes mercenaries',
			'clicker heroes mercenary quests',
			'clicker heroes save viewer'
		],
		changeFrequency: 'monthly',
		priority: 0.7,
		lastModified: '2026-09-14',
		schemaType: 'WebApplication'
	},
	removeClanData: {
		path: '/tools/remove-clan-data',
		keywords: [
			'clicker heroes remove clan data',
			'clicker heroes clan save data',
			'clicker heroes save cleaner',
			'clicker heroes account data'
		],
		changeFrequency: 'monthly',
		priority: 0.8,
		lastModified: '2026-08-26',
		schemaType: 'WebApplication'
	},
	saveConverter: {
		path: '/tools/save-converter',
		keywords: [
			'clicker heroes save converter',
			'clicker heroes pc save to mobile',
			'clicker heroes mobile save to pc',
			'clicker heroes save format'
		],
		changeFrequency: 'monthly',
		priority: 0.8,
		lastModified: '2026-08-27',
		schemaType: 'WebApplication'
	},
	saveJson: {
		path: '/tools/save-json',
		keywords: [
			'clicker heroes save json',
			'clicker heroes save to json',
			'clicker heroes json to save',
			'clicker heroes raw save data',
			'clicker heroes save format json'
		],
		changeFrequency: 'monthly',
		priority: 0.75,
		lastModified: '2026-08-27',
		schemaType: 'WebApplication'
	},
	newPlayerGuide: {
		path: '/guides/new-player-guide',
		keywords: [
			'clicker heroes new player guide',
			'clicker heroes beginner guide',
			'clicker heroes guide',
			'clicker heroes when to ascend',
			'clicker heroes first transcension',
			'clicker heroes idle build',
			'clicker heroes which ancients to buy',
			'clicker heroes ruby spending'
		],
		changeFrequency: 'monthly',
		priority: 0.8,
		lastModified: '2026-09-29',
		schemaType: 'Article',
		datePublished: '2026-07-28'
	},
	gildingChart: {
		path: '/guides/gilding-chart',
		keywords: [
			'clicker heroes gilding chart',
			'clicker heroes hero gilding chart',
			'clicker heroes which hero to gild',
			'clicker heroes gilding guide',
			'clicker heroes regilding',
			'clicker heroes optimal hero',
			'clicker heroes gilding e11',
			'clicker heroes ace scouts',
			'clicker heroes yachiyl',
			'clicker heroes tomb guardians'
		],
		changeFrequency: 'monthly',
		priority: 0.85,
		lastModified: '2026-09-29',
		schemaType: 'Article',
		datePublished: '2026-08-07'
	},
	progressTips: {
		path: '/guides/progress-tips',
		keywords: [
			'clicker heroes tips',
			'clicker heroes progress faster',
			'clicker heroes how to progress',
			'clicker heroes stuck',
			'clicker heroes skill combo',
			'clicker heroes edr combo',
			'clicker heroes when to ascend',
			'clicker heroes when to transcend'
		],
		changeFrequency: 'monthly',
		priority: 0.8,
		lastModified: '2026-09-29',
		schemaType: 'Article',
		datePublished: '2026-09-29'
	},
	requestTool: {
		path: '/tools/request-tool',
		keywords: [
			'clicker heroes tool request',
			'clicker heroes new tool',
			'clicker heroes calculator request',
			'clicker heroes tool suggestion'
		],
		changeFrequency: 'monthly',
		priority: 0.5,
		lastModified: '2026-08-27',
		schemaType: 'ContactPage'
	},
	requestGuide: {
		path: '/guides/request-guide',
		keywords: [
			'clicker heroes guide request',
			'clicker heroes new guide',
			'clicker heroes guide suggestion',
			'clicker heroes help'
		],
		changeFrequency: 'monthly',
		priority: 0.5,
		lastModified: '2026-08-27',
		schemaType: 'ContactPage'
	},
	faq: {
		path: '/faq',
		keywords: [
			'clicker heroes save editor faq',
			'clicker heroes save file location',
			'clicker heroes how to edit save',
			'clicker heroes import save',
			'clicker heroes save not working',
			'is clicker heroes save editor safe'
		],
		changeFrequency: 'monthly',
		priority: 0.7,
		lastModified: '2026-08-26'
	},
	feedback: {
		path: '/feedback',
		keywords: [
			'clicker heroes tools feedback',
			'clicker heroes save editor feedback',
			'clicker heroes feature request'
		],
		changeFrequency: 'monthly',
		priority: 0.55,
		lastModified: '2026-08-27',
		schemaType: 'ContactPage'
	}
} satisfies Record<string, SeoPage>;

export type SeoPageKey = keyof typeof seoPages;

type PageText = {
	/**
	 * The full `<title>`, OG and Twitter title. Leads with the query the page
	 * targets and stays under ~60 characters so results do not truncate it.
	 */
	metaTitle: string;
	description: string;
	applicationName?: string;
	featureList?: readonly string[];
};

const pageText = (key: SeoPageKey, locale: Locale): PageText => seoText[locale].pages[key];

const absoluteUrl = (path: string) => new URL(path, SITE_CONFIG.url).toString();

/** hreflang alternates: every locale, plus `x-default` on the English page. */
const languageAlternates = (path: string, toUrl: (path: string) => string = (value) => value) => ({
	...Object.fromEntries(routing.locales.map((locale) => [locale, toUrl(localizedPath(path, locale))])),
	'x-default': toUrl(localizedPath(path, routing.defaultLocale))
});

const authorId = `${SITE_CONFIG.url}/#author`;

export const createPageMetadata = (key: SeoPageKey, locale: Locale): Metadata => {
	const page: SeoPage = seoPages[key];
	const text = pageText(key, locale);
	const path = localizedPath(page.path, locale);

	return {
		title: { absolute: text.metaTitle },
		description: text.description,
		// The keyword lists are English search terms.
		...(locale === 'en' ? { keywords: [...new Set([...baseKeywords, ...page.keywords])] } : {}),
		alternates: {
			canonical: path,
			languages: languageAlternates(page.path)
		},
		openGraph: {
			...(page.schemaType === 'Article'
				? {
						type: 'article',
						publishedTime: page.datePublished,
						modifiedTime: page.lastModified
					}
				: { type: 'website' }),
			url: path,
			title: text.metaTitle,
			description: text.description,
			siteName: SITE_CONFIG.siteName,
			locale: ogLocales[locale],
			alternateLocale: routing.locales.filter((other) => other !== locale).map((other) => ogLocales[other]),
			images: [
				{
					url: SITE_CONFIG.ogImage,
					width: 1200,
					height: 630,
					alt: text.metaTitle
				}
			]
		},
		twitter: {
			card: 'summary_large_image',
			title: text.metaTitle,
			description: text.description,
			images: [
				{
					url: SITE_CONFIG.ogImage,
					alt: text.metaTitle
				}
			]
		}
	};
};

/** Pages that carry `FAQPage` structured data, and the questions they answer. */
const faqsFor = (key: SeoPageKey, locale: Locale): readonly Faq[] | undefined => {
	if (key === 'saveEditor') return saveEditorFaqs(locale);
	if (key === 'gildingChart') return gildingChartFaqs(locale);
	if (key === 'faq') return siteFaqSections(locale).flatMap((section): readonly Faq[] => section.faqs);

	return undefined;
};

/** The home page section a page belongs to, mirroring the on-page `Breadcrumb`. */
const sectionFor = (path: string, locale: Locale) => {
	const labels = seoText[locale].breadcrumb;
	const home = localizedPath('/', locale);

	if (path.startsWith('/tools/')) return { name: labels.tools, url: absoluteUrl(`${home}#tools`) };
	if (path.startsWith('/guides/')) return { name: labels.guides, url: absoluteUrl(`${home}#guides`) };

	return null;
};

export const createPageJsonLd = (key: SeoPageKey, locale: Locale, pageName: string) => {
	const page: SeoPage = seoPages[key];
	const text = pageText(key, locale);
	const pageUrl = absoluteUrl(localizedPath(page.path, locale));
	const section = sectionFor(page.path, locale);
	const crumbs = [
		{ name: seoText[locale].breadcrumb.home, url: absoluteUrl(localizedPath('/', locale)) },
		...(section ? [section] : []),
		...(page.path === '/' ? [] : [{ name: pageName, url: pageUrl }])
	];
	const keywords =
		locale === 'en' ? { keywords: [...new Set([...baseKeywords, ...page.keywords])].join(', ') } : {};
	const graph: object[] = [
		{
			'@type': 'WebSite',
			'@id': `${SITE_CONFIG.url}/#website`,
			name: SITE_CONFIG.siteName,
			alternateName: SITE_CONFIG.alternateName,
			url: SITE_CONFIG.url,
			description: siteDescription(locale),
			inLanguage: [...routing.locales],
			publisher: {
				'@id': authorId
			}
		},
		{
			// The one person behind the site. Every author and publisher reference
			// points here, so search engines see a single, consistent entity.
			'@type': 'Person',
			'@id': authorId,
			name: SITE_CONFIG.author.name,
			url: SITE_CONFIG.author.url,
			sameAs: [SITE_CONFIG.author.url]
		},
		{
			// The page itself. Tools and articles describe their content in
			// their own `WebApplication` / `Article` node below, so this stays a
			// `WebPage` rather than duplicating that entity.
			'@type':
				page.schemaType === 'CollectionPage' || page.schemaType === 'ContactPage'
					? page.schemaType
					: 'WebPage',
			'@id': `${pageUrl}#webpage`,
			name: text.metaTitle,
			url: pageUrl,
			description: text.description,
			dateModified: page.lastModified,
			isPartOf: {
				'@id': `${SITE_CONFIG.url}/#website`
			},
			breadcrumb: {
				'@id': `${pageUrl}#breadcrumb`
			},
			inLanguage: locale
		},
		{
			'@type': 'BreadcrumbList',
			'@id': `${pageUrl}#breadcrumb`,
			itemListElement: crumbs.map((crumb, index) => ({
				'@type': 'ListItem',
				position: index + 1,
				name: crumb.name,
				item: crumb.url
			}))
		}
	];

	if (page.schemaType === 'WebApplication') {
		graph.push({
			'@type': 'WebApplication',
			'@id': `${pageUrl}#app`,
			name: text.applicationName ?? text.metaTitle,
			url: pageUrl,
			mainEntityOfPage: {
				'@id': `${pageUrl}#webpage`
			},
			applicationCategory: 'GameApplication',
			operatingSystem: 'Windows, macOS, Linux, iOS, Android',
			browserRequirements: 'Requires a modern web browser with JavaScript enabled.',
			isAccessibleForFree: true,
			description: text.description,
			featureList: text.featureList,
			inLanguage: locale,
			...keywords,
			author: {
				'@id': authorId
			},
			offers: {
				'@type': 'Offer',
				price: '0',
				priceCurrency: 'USD'
			}
		});
	}

	if (page.schemaType === 'Article') {
		graph.push({
			'@type': 'Article',
			'@id': `${pageUrl}#article`,
			headline: text.metaTitle,
			description: text.description,
			url: pageUrl,
			inLanguage: locale,
			datePublished: page.datePublished,
			dateModified: page.lastModified,
			...keywords,
			author: {
				'@id': authorId
			},
			publisher: {
				'@id': authorId
			},
			image: absoluteUrl(SITE_CONFIG.ogImage),
			mainEntityOfPage: {
				'@id': `${pageUrl}#webpage`
			},
			isPartOf: {
				'@id': `${SITE_CONFIG.url}/#website`
			}
		});
	}

	const faqs = faqsFor(key, locale);

	if (faqs) {
		graph.push({
			'@type': 'FAQPage',
			'@id': `${pageUrl}#faq`,
			mainEntity: faqs.map((faq) => ({
				'@type': 'Question',
				name: faq.question,
				acceptedAnswer: {
					'@type': 'Answer',
					text: faq.answer
				}
			}))
		});
	}

	return {
		'@context': 'https://schema.org',
		'@graph': graph
	};
};

/**
 * `JSON.stringify` for a `<script type='application/ld+json'>` body. Escaping
 * `<` keeps a stray `</script>` in any string from closing the tag early, as
 * the Next.js JSON-LD guide recommends.
 */
export const serializeJsonLd = (data: object) => JSON.stringify(data).replace(/</g, '\\u003c');

/** One entry per page per locale, each listing every language version. */
export const seoSitemapEntries = Object.values(seoPages).flatMap((page: SeoPage) =>
	routing.locales.map((locale) => ({
		url: absoluteUrl(localizedPath(page.path, locale)),
		lastModified: new Date(page.lastModified),
		changeFrequency: page.changeFrequency,
		priority: page.priority,
		alternates: { languages: languageAlternates(page.path, absoluteUrl) }
	}))
) satisfies MetadataRoute.Sitemap;
