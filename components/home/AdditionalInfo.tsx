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

export const AdditionalInfo: FC = () => {
	const t = useTranslations('common.cards.additional');

	return (
		<>
			<LinkCard
				description={t('feedback.description')}
				href='/feedback'
				icon={MessageCircle}
				title={t('feedback.title')}
			/>
			<LinkCard
				description={t('faq.description')}
				href='/faq'
				icon={MessageCircleQuestionIcon}
				title={t('faq.title')}
			/>
			{externalLinks.map((link) => (
				<ExternalLinkCard
					description={t(`${link.key}.description`)}
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
