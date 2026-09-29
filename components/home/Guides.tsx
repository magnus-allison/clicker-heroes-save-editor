import type { FC } from 'react';

import { BookOpenTextIcon, CoinsIcon, MessageCirclePlus, RocketIcon } from 'lucide-react';

import { LinkCard, type LinkCardItem } from '@/components/ui/LinkCard';

const guides: LinkCardItem[] = [
	{
		title: 'New Player Guide',
		href: '/guides/new-player-guide',
		description: 'Fresh save to first transcension: ascending, ancients, rubies, mercs, and clans',
		icon: BookOpenTextIcon
	},
	{
		title: 'Gilding Chart',
		href: '/guides/gilding-chart',
		description: 'Which hero to gild at every gold threshold, from Samurai through to the Ace Scouts',
		icon: CoinsIcon,
		tag: 'New'
	},
	{
		title: '10 Tips to Progress Faster',
		href: '/guides/progress-tips',
		description: 'Ascending, gilding, builds, skill combos, rubies, and getting past walls',
		icon: RocketIcon,
		tag: 'New'
	},
	{
		title: 'Request New Guide',
		href: '/guides/request-guide',
		description: 'Suggest a new guide you would like to see, or contribute to an existing one',
		icon: MessageCirclePlus
	}
];

export const Guides: FC = () =>
	guides.map((guide) => (
		<LinkCard
			description={guide.description}
			href={guide.href}
			icon={guide.icon}
			key={guide.title}
			tag={guide.tag}
			title={guide.title}
		/>
	));
