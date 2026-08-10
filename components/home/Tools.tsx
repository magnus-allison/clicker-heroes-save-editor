import type { FC } from 'react';

import {
	ArrowRightLeft,
	Braces,
	Calculator,
	FileCode2,
	History,
	Landmark,
	SwordIcon,
	Users,
	Wrench
} from 'lucide-react';

import { LinkCard, type LinkCardItem } from '@/components/ui/LinkCard';

const tools: LinkCardItem[] = [
	{
		title: 'save editor',
		href: '/tools/save-editor',
		description: 'Decode, inspect, edit, and re-encode Clicker Heroes save files.',
		icon: FileCode2,
		tag: 'Most popular',
		tagIsShining: true
	},
	{
		title: 'instakill calculator',
		href: '/tools/instakill-calculator',
		description: 'Estimate route duration, monsters per zone, and zones per hour.',
		icon: Calculator
	},
	{
		title: 'ancients calculator',
		href: '/tools/ancients-calculator',
		description: 'Get optimal ancient levels and costs for your hero souls.',
		icon: Landmark
	},
	{
		title: 'transcension viewer',
		href: '/tools/transcension-viewer',
		description: 'Inspect transcension history and drill into ascensions from a save.',
		icon: History
	},
	{
		title: 'mercenary viewer',
		href: '/tools/mercenary-viewer',
		description: 'View your mercenary roster and lifetime mercenary stats from a save.',
		icon: Users
	},
	{
		title: 'relic viewer',
		href: '/tools/relic-viewer',
		description: 'Inspect relics, their bonuses, and rarity from a save.',
		icon: SwordIcon,
		tag: 'Coming soon',
		comingSoon: true
	},
	{
		title: 'remove clan data',
		href: '/tools/remove-clan-data',
		description: 'Remove clan, account, and login fields from a save in your browser.',
		icon: Wrench
	},
	{
		title: 'save converter',
		href: '/tools/save-converter',
		description: 'Convert Clicker Heroes saves between PC and mobile formats.',
		icon: ArrowRightLeft
	},
	{
		title: 'save json',
		href: '/tools/save-json',
		description: 'Convert saves to and from raw JSON. Built for developers.',
		icon: Braces
	}
];

export const Tools: FC = () => (
	<>
		{tools.map((tool) => (
			<LinkCard
				cta={tool.comingSoon ? 'In development' : 'Open tool'}
				description={tool.description}
				disabled={tool.comingSoon}
				href={tool.href}
				icon={tool.icon}
				key={tool.title}
				tag={tool.tag}
				tagIsShining={tool.tagIsShining}
				title={tool.title}
			/>
		))}
	</>
);
