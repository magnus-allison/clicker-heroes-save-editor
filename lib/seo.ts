import type { Metadata, MetadataRoute } from 'next';

export const SITE_CONFIG = {
	url: 'https://clickerheroes.dev',
	name: 'Clicker Heroes',
	title: 'Clicker Heroes Save Editor - Free Online Save File Editor',
	description:
		'Free online Clicker Heroes save editor and tools. Decode, inspect, edit, and re-encode Clicker Heroes saves in your browser.',
	author: {
		name: 'Magnus Allison',
		url: 'https://github.com/magnus-allison'
	},
	ogImage: '/opengraph.png'
} as const;

const baseKeywords = [
	'clicker heroes',
	'clicker heroes save editor',
	'clicker heroes save file editor',
	'clicker heroes save decoder',
	'clicker heroes save encoder',
	'clicker heroes tools',
	'idle game save editor'
];

export const saveEditorFaqs = [
	{
		question: 'How do I edit a Clicker Heroes save file?',
		answer: 'Paste your Clicker Heroes save string into the editor, decode it, change the fields you need, then copy the encoded result back into the game import dialog.'
	},
	{
		question: 'Can this editor change gold, rubies, Hero Souls, and Ancients?',
		answer: 'Yes. The editor includes controls for core currencies, hero levels, Hero Souls, Ancients-related progression, ascensions, achievements, skins, mercenaries, outsiders, clan values, and raw save JSON.'
	},
	{
		question: 'Is my Clicker Heroes save uploaded to a server?',
		answer: 'No. The editor runs in the browser and processes save data client-side, so editing works without uploading your save to this site.'
	}
] as const;

type SeoPage = {
	path: string;
	title: string | { absolute: string };
	metaTitle: string;
	description: string;
	keywords: string[];
	changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
	priority: number;
	schemaType?: 'CollectionPage' | 'ContactPage' | 'WebApplication';
	applicationName?: string;
	featureList?: string[];
};

export const seoPages = {
	home: {
		path: '/',
		title: { absolute: 'Clicker Heroes Free Online Tools' },
		metaTitle: 'Clicker Heroes | Free Online Tools',
		description:
			'Free browser-based utilities for editing save data, planning faster runs, guides and more.',
		keywords: [
			'clicker heroes tools',
			'clicker heroes save editor',
			'clicker heroes save tools',
			'clicker heroes cheats'
		],
		changeFrequency: 'weekly',
		priority: 1,
		schemaType: 'CollectionPage'
	},
	saveEditor: {
		path: '/tools/save-editor',
		title: 'Save Editor',
		metaTitle: 'Clicker Heroes | Save Editor',
		description:
			'Free online Clicker Heroes save editor for decoding, inspecting, editing, and re-encoding save files. Edit gold, rubies, Hero Souls, heroes, Ancients, ascensions, and more.',
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
		schemaType: 'WebApplication',
		applicationName: 'Clicker Heroes Save Editor',
		featureList: [
			'Decode Clicker Heroes save strings',
			'Encode edited saves for import back into the game',
			'Edit gold, rubies, Hero Souls, Ancients, and ascension data',
			'Edit heroes, achievements, skins, mercenaries, outsiders, clan values, and custom fields',
			'Inspect structured save JSON in the browser'
		]
	},
	instakillCalculator: {
		path: '/tools/instakill-calculator',
		title: 'Instakill Calculator',
		metaTitle: 'Clicker Heroes | Instakill Calculator',
		description:
			'Estimate Clicker Heroes instakill route duration, monsters per zone, and zones per hour from Kumawakamaru, Borb, zone range, and FPS.',
		keywords: [
			'clicker heroes instakill calculator',
			'clicker heroes zones per hour',
			'clicker heroes kumawakamaru',
			'clicker heroes borb',
			'clicker heroes monsters per zone'
		],
		changeFrequency: 'monthly',
		priority: 0.75,
		schemaType: 'WebApplication',
		applicationName: 'Clicker Heroes Instakill Calculator',
		featureList: [
			'Estimate route duration',
			'Calculate monsters per zone',
			'Estimate zones per hour from zone range and FPS'
		]
	},
	transcensionViewer: {
		path: '/tools/transcension-viewer',
		title: 'Transcension Viewer',
		metaTitle: 'Clicker Heroes | Transcension Viewer',
		description:
			'Import a Clicker Heroes save and inspect transcension history with ascension duration, HZE, Hero Souls, and Ancient Souls totals.',
		keywords: [
			'clicker heroes transcension viewer',
			'clicker heroes ascension history',
			'clicker heroes save viewer',
			'clicker heroes ancient souls'
		],
		changeFrequency: 'monthly',
		priority: 0.75,
		schemaType: 'WebApplication',
		applicationName: 'Clicker Heroes Transcension Viewer',
		featureList: [
			'View Clicker Heroes transcension history',
			'Inspect ascensions from imported save data',
			'Review HZE, Hero Souls, and Ancient Souls totals'
		]
	},
	removeClanData: {
		path: '/tools/remove-clan-data',
		title: 'Remove Clan Data',
		metaTitle: 'Clicker Heroes | Remove Clan Data Tool',
		description:
			'Remove Clicker Heroes clan, account, and login data from an imported save file, then re-encode the cleaned save locally in your browser.',
		keywords: [
			'clicker heroes remove clan data',
			'clicker heroes clan save data',
			'clicker heroes save cleaner',
			'clicker heroes account data'
		],
		changeFrequency: 'monthly',
		priority: 0.8,
		schemaType: 'WebApplication',
		applicationName: 'Clicker Heroes Remove Clan Data Tool',
		featureList: [
			'Remove clan fields from Clicker Heroes saves',
			'Clean account and login values',
			'Re-encode the cleaned save in the browser'
		]
	},
	saveConverter: {
		path: '/tools/save-converter',
		title: 'Save Converter',
		metaTitle: 'Clicker Heroes | Save Converter',
		description:
			'Convert Clicker Heroes save files between PC and mobile formats locally in your browser, with detected origin and patch number details.',
		keywords: [
			'clicker heroes save converter',
			'clicker heroes pc save to mobile',
			'clicker heroes mobile save to pc',
			'clicker heroes save format'
		],
		changeFrequency: 'monthly',
		priority: 0.8,
		schemaType: 'WebApplication',
		applicationName: 'Clicker Heroes Save Converter',
		featureList: [
			'Detect PC or mobile Clicker Heroes save origin',
			'Show the save patch number when available',
			'Convert saves between PC and mobile compression formats',
			'Re-encode converted saves locally in the browser'
		]
	},
	feedback: {
		path: '/feedback',
		title: 'Feedback',
		metaTitle: 'Clicker Heroes Tools Feedback',
		description:
			'Send bug reports, feature requests, missing workflow ideas, and general feedback about the Clicker Heroes save editor and tools.',
		keywords: [
			'clicker heroes tools feedback',
			'clicker heroes save editor feedback',
			'clicker heroes feature request'
		],
		changeFrequency: 'monthly',
		priority: 0.55,
		schemaType: 'ContactPage'
	}
} satisfies Record<string, SeoPage>;

export type SeoPageKey = keyof typeof seoPages;

const absoluteUrl = (path: string) => new URL(path, SITE_CONFIG.url).toString();

export const createPageMetadata = (key: SeoPageKey): Metadata => {
	const page = seoPages[key];
	const keywords = [...new Set([...baseKeywords, ...page.keywords])];

	return {
		title: page.title,
		description: page.description,
		keywords,
		alternates: {
			canonical: page.path
		},
		openGraph: {
			type: 'website',
			url: page.path,
			title: page.metaTitle,
			description: page.description,
			siteName: SITE_CONFIG.name,
			locale: 'en_US',
			images: [
				{
					url: SITE_CONFIG.ogImage,
					width: 1200,
					height: 630,
					alt: page.metaTitle
				}
			]
		},
		twitter: {
			card: 'summary_large_image',
			title: page.metaTitle,
			description: page.description,
			images: [
				{
					url: SITE_CONFIG.ogImage,
					alt: page.metaTitle
				}
			]
		}
	};
};

export const createPageJsonLd = (key: SeoPageKey) => {
	const page = seoPages[key];
	const pageUrl = absoluteUrl(page.path);
	const graph: object[] = [
		{
			'@type': 'WebSite',
			'@id': `${SITE_CONFIG.url}/#website`,
			name: SITE_CONFIG.name,
			url: SITE_CONFIG.url,
			description: SITE_CONFIG.description,
			inLanguage: 'en'
		},
		{
			'@type': page.schemaType ?? 'WebPage',
			'@id': `${pageUrl}#webpage`,
			name: page.metaTitle,
			url: pageUrl,
			description: page.description,
			isPartOf: {
				'@id': `${SITE_CONFIG.url}/#website`
			},
			inLanguage: 'en'
		},
		{
			'@type': 'BreadcrumbList',
			'@id': `${pageUrl}#breadcrumb`,
			itemListElement: [
				{
					'@type': 'ListItem',
					position: 1,
					name: 'Clicker Heroes Tools',
					item: SITE_CONFIG.url
				},
				...(page.path === '/'
					? []
					: [
							{
								'@type': 'ListItem',
								position: 2,
								name: page.metaTitle,
								item: pageUrl
							}
						])
			]
		}
	];

	if (page.schemaType === 'WebApplication') {
		graph.push({
			'@type': 'WebApplication',
			'@id': `${pageUrl}#app`,
			name: page.applicationName ?? page.metaTitle,
			url: pageUrl,
			applicationCategory: 'GameApplication',
			operatingSystem: 'Windows, macOS, Linux, iOS, Android',
			browserRequirements: 'Requires a modern web browser with JavaScript enabled.',
			isAccessibleForFree: true,
			description: page.description,
			featureList: page.featureList,
			keywords: [...new Set([...baseKeywords, ...page.keywords])].join(', '),
			author: {
				'@type': 'Person',
				name: SITE_CONFIG.author.name,
				url: SITE_CONFIG.author.url
			},
			offers: {
				'@type': 'Offer',
				price: '0',
				priceCurrency: 'USD'
			}
		});
	}

	if (key === 'saveEditor') {
		graph.push({
			'@type': 'FAQPage',
			'@id': `${pageUrl}#faq`,
			mainEntity: saveEditorFaqs.map((faq) => ({
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

export const seoSitemapEntries = Object.values(seoPages).map((page) => ({
	url: absoluteUrl(page.path),
	lastModified: new Date('2026-05-17'),
	changeFrequency: page.changeFrequency,
	priority: page.priority,
	images: [absoluteUrl(SITE_CONFIG.ogImage)]
})) satisfies MetadataRoute.Sitemap;
