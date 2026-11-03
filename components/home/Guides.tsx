import type { FC } from 'react';

import { BookOpenTextIcon, CoinsIcon, ImageIcon, MessageCirclePlus, RocketIcon } from 'lucide-react';

import { useTranslations } from 'next-intl';

import { LinkCard, type LinkCardItem } from '@/components/ui/LinkCard';
import type { messages } from '@/messages';

type GuideCardKey = keyof (typeof messages)['en']['common']['cards']['guides'];

export const guides: LinkCardItem<GuideCardKey>[] = [
	{
		key: 'newPlayerGuide',
		href: '/guides/new-player-guide',
		icon: BookOpenTextIcon
	},
	{
		key: 'gildingChart',
		href: '/guides/gilding-chart',
		icon: CoinsIcon,
		tag: 'new'
	},
	{
		key: 'progressTips',
		href: '/guides/progress-tips',
		icon: RocketIcon,
		tag: 'new'
	},
	{
		key: 'heroArtwork',
		href: '/guides/hero-artwork',
		icon: ImageIcon,
		tag: 'new'
	},
	{
		key: 'requestGuide',
		href: '/guides/request-guide',
		icon: MessageCirclePlus
	}
];

export const Guides: FC = () => {
	const t = useTranslations('common.cards.guides');

	return guides.map((guide) => (
		<LinkCard
			description={t(`${guide.key}.description`)}
			href={guide.href}
			icon={guide.icon}
			key={guide.key}
			tag={guide.tag}
			title={t(`${guide.key}.title`)}
		/>
	));
};
