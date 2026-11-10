/**
 * Cross-links for the `ToolAbout` "See also" rows. Titles live in the
 * `toolAbout.links` messages under the same keys, so they read the same
 * everywhere.
 */
export const toolLinks = {
	saveEditor: '/tools/save-editor',
	ancientsCalculator: '/tools/ancients-calculator',
	outsidersCalculator: '/tools/outsiders-calculator',
	instakillCalculator: '/tools/instakill-calculator',
	transcensionViewer: '/tools/transcension-viewer',
	mercenaryViewer: '/tools/mercenary-viewer',
	relicViewer: '/tools/relic-viewer',
	relicEditor: '/tools/relic-editor',
	saveConverter: '/tools/save-converter',
	removeClanData: '/tools/remove-clan-data',
	saveJson: '/tools/save-json',
	newPlayerGuide: '/guides/new-player-guide',
	gildingChart: '/guides/gilding-chart',
	progressTips: '/guides/progress-tips',
	faq: '/faq'
} as const satisfies Record<string, string>;

export type ToolLinkKey = keyof typeof toolLinks;
