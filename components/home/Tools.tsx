import type { FC } from 'react';

import {
	ArrowRightLeft,
	Braces,
	Calculator,
	FileCode2,
	Hammer,
	History,
	Landmark,
	MessageCirclePlus,
	Orbit,
	SaveCheckIcon,
	SwordIcon,
	SwordsIcon,
	Users,
	Wrench
} from 'lucide-react';

import { useTranslations } from 'next-intl';

import { LinkCard, type LinkCardItem } from '@/components/ui/LinkCard';
import type { messages } from '@/messages';

type ToolCardKey = keyof (typeof messages)['en']['common']['cards']['tools'];

export const tools: LinkCardItem<ToolCardKey>[] = [
	{
		key: 'saveEditor',
		href: '/tools/save-editor',
		icon: SaveCheckIcon,
		tag: 'mostPopular'
	},
	{
		key: 'outsidersCalculator',
		href: '/tools/outsiders-calculator',
		icon: Orbit,
		tag: 'new'
	},
	{
		key: 'instakillCalculator',
		href: '/tools/instakill-calculator',
		icon: SwordsIcon
	},
	{
		key: 'ancientsCalculator',
		href: '/tools/ancients-calculator',
		icon: Landmark
	},
	{
		key: 'transcensionViewer',
		href: '/tools/transcension-viewer',
		icon: History
	},
	{
		key: 'mercenaryViewer',
		href: '/tools/mercenary-viewer',
		icon: Users
	},
	{
		key: 'relicViewer',
		href: '/tools/relic-viewer',
		icon: SwordIcon,
		tag: 'new'
	},
	{
		key: 'relicEditor',
		href: '/tools/relic-editor',
		icon: Hammer,
		tag: 'new'
	},
	{
		key: 'removeClanData',
		href: '/tools/remove-clan-data',
		icon: Wrench
	},
	{
		key: 'saveConverter',
		href: '/tools/save-converter',
		icon: ArrowRightLeft
	},
	{
		key: 'saveJson',
		href: '/tools/save-json',
		icon: Braces
	},
	{
		key: 'requestTool',
		href: '/tools/request-tool',
		icon: MessageCirclePlus
	}
];

export const Tools: FC = () => {
	const t = useTranslations('common.cards.tools');

	return tools.map((tool, index) => (
		<LinkCard
			description={t(`${tool.key}.description`)}
			disabled={tool.tag === 'comingSoon'}
			fadeIndex={index}
			href={tool.href}
			icon={tool.icon}
			key={tool.key}
			tag={tool.tag}
			title={t(`${tool.key}.title`)}
		/>
	));
};
