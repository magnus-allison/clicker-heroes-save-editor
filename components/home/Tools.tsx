import type { FC } from 'react';

import {
	ArrowRightLeft,
	Braces,
	Calculator,
	FileCode2,
	History,
	Landmark,
	MessageCircle,
	MessageCirclePlus,
	MessageSquare,
	MessageSquarePlus,
	Orbit,
	SendIcon,
	SwordIcon,
	Users,
	Wrench
} from 'lucide-react';

import { LinkCard, type LinkCardItem } from '@/components/ui/LinkCard';

const tools: LinkCardItem[] = [
	{
		title: 'Save Editor',
		href: '/tools/save-editor',
		description: 'Decode, inspect, edit, and re-encode Clicker Heroes save files.',
		icon: FileCode2,
		tag: 'Most popular',
		tagIsShining: true
	},
	{
		title: 'Outsiders Calculator',
		href: '/tools/outsiders-calculator',
		description: 'Plan outsider levels, transcension estimates, and future transcensions.',
		icon: Orbit,
		tag: 'New'
	},
	{
		title: 'Instakill Calculator',
		href: '/tools/instakill-calculator',
		description: 'Estimate route duration, monsters per zone, and zones per hour.',
		icon: Calculator
	},
	{
		title: 'Ancients Calculator',
		href: '/tools/ancients-calculator',
		description: 'Get optimal ancient levels and costs for your hero souls.',
		icon: Landmark
	},
	{
		title: 'Transcension Viewer',
		href: '/tools/transcension-viewer',
		description: 'Inspect transcension history and drill into ascensions from a save.',
		icon: History
	},
	{
		title: 'Mercenary Viewer',
		href: '/tools/mercenary-viewer',
		description: 'View your mercenary roster and lifetime mercenary stats from a save.',
		icon: Users
	},
	{
		title: 'Relic Viewer',
		href: '/tools/relic-viewer',
		description: 'Inspect relics, their bonuses, and rarity from a save.',
		icon: SwordIcon,
		tag: 'Coming soon',
		comingSoon: true
	},
	{
		title: 'Remove Clan Data',
		href: '/tools/remove-clan-data',
		description: 'Remove clan, account, and login fields from a save in your browser.',
		icon: Wrench
	},
	{
		title: 'Save Converter',
		href: '/tools/save-converter',
		description: 'Convert Clicker Heroes saves between PC and mobile formats.',
		icon: ArrowRightLeft
	},
	{
		title: 'Save JSON',
		href: '/tools/save-json',
		description: 'Convert saves to and from raw JSON. Built for developers.',
		icon: Braces
	},
	{
		title: 'Request New Tool',
		href: '/tools/request-tool',
		description: "Make a suggestion for a new tool you'd like to see.",
		icon: MessageCirclePlus
	}
];

export const Tools: FC = () => (
	<>
		{tools.map((tool) => (
			<LinkCard
				cta={tool.comingSoon ? 'In development' : 'Open'}
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
