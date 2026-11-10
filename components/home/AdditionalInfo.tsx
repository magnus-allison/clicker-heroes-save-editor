import type { FC } from 'react';

import { MessageCircle, MessageCircleQuestionIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ExternalLinkCard, LinkCard } from '@/components/ui/LinkCard';

const externalLinks = [
	{
		key: 'github',
		icon: '/assets/icons/github.svg',
		href: 'https://github.com/magnus-allison/clicker-heroes-save-editor'
	},
	{
		key: 'coffee',
		icon: '/assets/icons/buymeacoffee.svg',
		href: 'https://buymeacoffee.com/magnus.allison'
	},
	{
		key: 'game',
		icon: '/assets/icons/clicker-heroes.png',
		href: 'https://clickerheroes.com/',
		// The game's logo is full colour, so it is not tinted for the theme.
		tintIcon: false
	},
	{
		key: 'steam',
		icon: '/assets/icons/steam.svg',
		href: 'https://store.steampowered.com/app/363970/Clicker_Heroes/'
	}
] as const;

type Props = {
	/** Where this grid's entrance stagger starts, so it follows the guides above. */
	fadeOffset?: number;
};

export const AdditionalInfo: FC<Props> = ({ fadeOffset = 0 }) => {
	const t = useTranslations('common.cards.additional');

	return (
		<>
			<LinkCard
				description={t('feedback.description')}
				fadeIndex={fadeOffset}
				href='/feedback'
				icon={MessageCircle}
				title={t('feedback.title')}
			/>
			<LinkCard
				description={t('faq.description')}
				fadeIndex={fadeOffset + 1}
				href='/faq'
				icon={MessageCircleQuestionIcon}
				title={t('faq.title')}
			/>
			{externalLinks.map((link, index) => (
				<ExternalLinkCard
					description={t(`${link.key}.description`)}
					fadeIndex={fadeOffset + 2 + index}
					href={link.href}
					icon={link.icon}
					key={link.href}
					tintIcon={'tintIcon' in link ? link.tintIcon : true}
					title={t(`${link.key}.title`)}
				/>
			))}
		</>
	);
};
