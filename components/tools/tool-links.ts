import type { ToolAboutLink } from '@/components/tools/ToolAbout';

/** Cross-links for the `ToolAbout` "See also" rows, named the same everywhere. */
export const toolLinks = {
	saveEditor: { href: '/tools/save-editor', title: 'Save editor' },
	ancientsCalculator: { href: '/tools/ancients-calculator', title: 'Ancients calculator' },
	outsidersCalculator: { href: '/tools/outsiders-calculator', title: 'Outsiders calculator' },
	instakillCalculator: { href: '/tools/instakill-calculator', title: 'Instakill calculator' },
	transcensionViewer: { href: '/tools/transcension-viewer', title: 'Transcension viewer' },
	mercenaryViewer: { href: '/tools/mercenary-viewer', title: 'Mercenary viewer' },
	saveConverter: { href: '/tools/save-converter', title: 'Save converter' },
	removeClanData: { href: '/tools/remove-clan-data', title: 'Remove clan data' },
	saveJson: { href: '/tools/save-json', title: 'Save JSON' },
	newPlayerGuide: { href: '/guides/new-player-guide', title: 'New player guide' },
	gildingChart: { href: '/guides/gilding-chart', title: 'Gilding chart' },
	progressTips: { href: '/guides/progress-tips', title: 'Progress tips' },
	faq: { href: '/faq', title: 'FAQ' }
} as const satisfies Record<string, ToolAboutLink>;
