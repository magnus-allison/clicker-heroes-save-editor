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
		answer:
			'Paste your Clicker Heroes save string into the editor, decode it, change the fields you need, then copy the encoded result back into the game import dialog.'
	},
	{
		question: 'Can this editor change gold, rubies, Hero Souls, and Ancients?',
		answer:
			'Yes. The editor includes controls for core currencies, hero levels, Hero Souls, Ancients-related progression, ascensions, achievements, skins, mercenaries, outsiders, clan values, and custom save fields. Raw JSON editing lives in the separate save-json tool.'
	},
	{
		question: 'Is my Clicker Heroes save uploaded to a server?',
		answer:
			'No. The editor runs in the browser and processes save data client-side, so editing works without uploading your save to this site.'
	}
] as const;

export const gildingChartFaqs = [
	{
		question: 'Do I need to re-gild on every row of the gilding chart?',
		answer: 'No. Re-gilding costs Hero Souls, and while you are instakilling, extra damage does nothing. Skip rows freely and only re-gild when monsters start surviving your hits. The chart maps what is optimal, not a checklist you have to complete.'
	},
	{
		question: 'Why does the same hero appear more than once in the gilding chart?',
		answer: 'Heroes gain 10x damage multipliers at level milestones, and leveling costs scale as you go. So Wepwawet at 5,000 can fall behind Gog, then overtake it again at 6,000 once Wep picks up its next multiplier. Between e383 and e500 the two leapfrog every 500 levels or so.'
	},
	{
		question: 'Should I gild Dread Knight in Clicker Heroes?',
		answer: 'No. Dread Knight is never optimal to gild at any point in the game. Skip it.'
	},
	{
		question: 'Why do Wepwawet and Gog stop alternating after e442?',
		answer: 'Gog receives no further 10x multipliers after level 8,000, so it cannot leapfrog Wepwawet again. Stay on Wepwawet from e442 until Tsuchi at e500.'
	},
	{
		question: 'Why is Tsuchi at level 1 better than Wepwawet at level 9,000?',
		answer: 'Hiring Tsuchi costs less than buying 25 more levels of Wepwawet at that point, and its base damage is on a different tier entirely. The same pattern repeats at The Maw, which at level 1 deals roughly 1e6750x the damage of Cadu at 680,625.'
	},
	{
		question: 'Why do Cadu and Ceus alternate in the gilding chart?',
		answer: 'The Tomb Guardians buff each other: Cadu unlocks an upgrade for Ceus, Ceus unlocks one for Cadu, and so on. You push whichever one is next in line. Either is a fine starting point at e25,500, and after the last Ceus upgrade at 588,000 you stay on Cadu until The Maw.'
	},
	{
		question: 'Why does Yachiyl start at level 157,500 instead of level 1?',
		answer: 'Yachiyl only overtakes The Maw once it reaches its first upgrade at level 157,500. Rose has the same problem against Yachiyl and needs level 9,700 first.'
	},
	{
		question: 'Why is Dorothy skipped so often in the Ace Scouts rotation?',
		answer: 'Several of her upgrade tiers cost more gold than the equivalent Rose upgrade while dealing less damage, so Dorothy 1, 2 and 4 are worse buys than simply pushing Rose. She still appears three times in the rotation, so follow the rows as listed rather than writing her off.'
	},
	{
		question: 'How many Ancient Souls do I need to reach a hero in the gilding chart?',
		answer: 'The Ancient Souls column is a rough guide through Xavira at about 6,000. Past that it is not meaningfully tabulated, since progression depends heavily on your outsider allocation and transcension count.'
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
	schemaType?: 'Article' | 'CollectionPage' | 'ContactPage' | 'WebApplication';
	applicationName?: string;
	featureList?: string[];
	/** ISO date. Required by `Article` schema; ignored by every other page type. */
	datePublished?: string;
	dateModified?: string;
};

export const seoPages = {
	home: {
		path: '/',
		title: { absolute: 'Clicker Heroes Free Online Tools' },
		metaTitle: 'Clicker Heroes | Free Online Tools',
		description: 'Free browser-based utilities for editing save data, planning faster runs, guides and more.',
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
			'Write any save field directly with a custom field path'
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
	ancientsCalculator: {
		path: '/tools/ancients-calculator',
		title: 'Ancients Calculator',
		metaTitle: 'Clicker Heroes | Ancients Calculator',
		description:
			'Free Clicker Heroes ancients calculator. Import a save to get optimal ancient levels, level-up costs, and an ancient soul planner for idle, hybrid, and active builds.',
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
		schemaType: 'WebApplication',
		applicationName: 'Clicker Heroes Ancients Calculator',
		featureList: [
			'Calculate optimal ancient levels from an imported save',
			'Support idle, hybrid, and active builds with an adjustable hybrid ratio',
			'Show hero soul cost per ancient and souls left over',
			'Plan the hero souls needed for the next ancient souls'
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
	mercenaryViewer: {
		path: '/tools/mercenary-viewer',
		title: 'Mercenary Viewer',
		metaTitle: 'Clicker Heroes | Mercenary Viewer',
		description:
			'Import a Clicker Heroes save and view your mercenary roster and lifetime mercenary stats, including levels, time to die, bonus lives, and completed quests.',
		keywords: [
			'clicker heroes mercenary viewer',
			'clicker heroes mercenaries',
			'clicker heroes mercenary quests',
			'clicker heroes save viewer'
		],
		changeFrequency: 'monthly',
		priority: 0.7,
		schemaType: 'WebApplication',
		applicationName: 'Clicker Heroes Mercenary Viewer',
		featureList: [
			'View the Clicker Heroes mercenary roster from a save',
			'Inspect mercenary level, time to die, and bonus lives',
			'Review lifetime mercenary and quest totals'
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
	saveJson: {
		path: '/tools/save-json',
		title: 'Save JSON',
		metaTitle: 'Clicker Heroes | Save JSON Tool',
		description:
			'Developer tool that decodes a Clicker Heroes save into raw JSON, lets you edit any field by hand, and re-encodes the JSON back into a save string in your browser.',
		keywords: [
			'clicker heroes save json',
			'clicker heroes save to json',
			'clicker heroes json to save',
			'clicker heroes raw save data',
			'clicker heroes save format json'
		],
		changeFrequency: 'monthly',
		priority: 0.75,
		schemaType: 'WebApplication',
		applicationName: 'Clicker Heroes Save JSON Tool',
		featureList: [
			'Decode Clicker Heroes saves into formatted JSON',
			'Edit any raw save field by hand',
			'Convert edited JSON back into an encoded save string',
			'Format and copy raw save JSON in the browser'
		]
	},
	newPlayerGuide: {
		path: '/guides/new-player-guide',
		title: 'New Player Guide',
		metaTitle: 'Clicker Heroes | New Player Guide',
		description:
			'A beginner guide to Clicker Heroes 1.0e11: your first run, when to ascend, gilding the Power 5, which ancients to buy, your first transcension, rubies, mercenaries, clans, and relics.',
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
		schemaType: 'Article',
		datePublished: '2026-07-28',
		dateModified: '2026-07-28'
	},
	gildingChart: {
		path: '/guides/gilding-chart',
		title: 'Hero Gilding Chart',
		metaTitle: 'Clicker Heroes | Hero Gilding Chart',
		description:
			'The Clicker Heroes 1.0e11 hero gilding chart: which hero to gild at every gold threshold, from The Masked Samurai through Wepwawet, Xavira, the Tomb Guardians, The Maw, Yachiyl and the Ace Scouts. Enter your gold to find your optimal hero.',
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
		schemaType: 'Article',
		datePublished: '2026-08-07',
		dateModified: '2026-08-07'
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
			// `Article` describes the content, not the page, so it gets its own
			// node below and this one stays a plain `WebPage`.
			'@type': page.schemaType === 'Article' ? 'WebPage' : (page.schemaType ?? 'WebPage'),
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

	if (page.schemaType === 'Article') {
		graph.push({
			'@type': 'Article',
			'@id': `${pageUrl}#article`,
			headline: page.metaTitle,
			description: page.description,
			url: pageUrl,
			inLanguage: 'en',
			datePublished: page.datePublished,
			dateModified: page.dateModified ?? page.datePublished,
			keywords: [...new Set([...baseKeywords, ...page.keywords])].join(', '),
			author: {
				'@type': 'Person',
				name: SITE_CONFIG.author.name,
				url: SITE_CONFIG.author.url
			},
			publisher: {
				'@type': 'Person',
				name: SITE_CONFIG.author.name,
				url: SITE_CONFIG.author.url
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

	const faqs = key === 'saveEditor' ? saveEditorFaqs : key === 'gildingChart' ? gildingChartFaqs : null;

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

export const seoSitemapEntries = Object.values(seoPages).map((page) => ({
	url: absoluteUrl(page.path),
	lastModified: new Date('2026-05-17'),
	changeFrequency: page.changeFrequency,
	priority: page.priority,
	images: [absoluteUrl(SITE_CONFIG.ogImage)]
})) satisfies MetadataRoute.Sitemap;
