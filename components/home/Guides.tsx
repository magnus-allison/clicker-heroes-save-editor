import type { FC } from 'react';

import { BookOpenTextIcon, CoinsIcon } from 'lucide-react';

import { LinkCard, type LinkCardItem } from '@/components/ui/LinkCard';

const guides: LinkCardItem[] = [
	{
		title: 'new-player-guide',
		href: '/guides/new-player-guide',
		description: 'Fresh save to first transcension: ascending, ancients, rubies, mercs, and clans.',
		icon: BookOpenTextIcon
	},
	{
		title: 'gilding-chart',
		href: '/guides/gilding-chart',
		description: 'Which hero to gild at every gold threshold, from Samurai through to the Ace Scouts.',
		icon: CoinsIcon,
		tag: 'New'
	}
];

export const Guides: FC = () => (
	<>
		{guides.map((guide) => (
			<LinkCard
				cta='Read guide'
				description={guide.description}
				href={guide.href}
				icon={guide.icon}
				key={guide.title}
				tag={guide.tag}
				title={guide.title}
			/>
		))}
	</>
);
