import type { FC } from 'react';

import { ExternalLinkCard, ExternalLinkCardItem, LinkCard } from '@/components/ui/LinkCard';
import { Link, MessageCircle, MessageCircleQuestionIcon } from 'lucide-react';

export const additionalLinks: ExternalLinkCardItem[] = [
	{
		icon: '/assets/icons/github.svg',
		title: 'GitHub Repository',
		href: 'https://github.com/magnus-allison/clicker-heroes-save-editor',
		description: 'magnus-allison/clicker-heroes-save-editor'
	},
	{
		icon: '/assets/icons/buymeacoffee.svg',
		title: 'Buy Me a Coffee',
		href: 'https://buymeacoffee.com/magnus.allison',
		description: 'Help keep the editor free and updated by making a small contribution'
	},
	{
		icon: '/assets/icons/clicker-heroes.png',
		href: 'https://clickerheroes.com/',
		title: 'Clicker Heroes',
		description: 'Link to the games official website'
	}
	// {
	// 	icon: '/assets/icons/steam.svg',
	// 	title: 'Clicker Heroes on Steam',
	// 	href: 'https://store.steampowered.com/app/363970/Clicker_Heroes/',
	// 	description: 'Link to the games official steam listing page'
	// }
];

export const AdditionalInfo: FC = () => (
	<>
		<LinkCard
			icon={MessageCircle}
			title='Submit Feedback'
			href='/feedback'
			description='Help us improve the quality of the site by submitting your thoughts'
		/>
		<LinkCard
			icon={MessageCircleQuestionIcon}
			title='FAQ'
			href='/faq'
			description='Answers to common questions about the editor, save files, and more'
		/>
		<LinkCard
			icon={MessageCircleQuestionIcon}
			title='Changelog'
			href='/changelog'
			description='View the latest updates and improvements to the editor'
		/>
		{additionalLinks.map((link) => (
			<ExternalLinkCard
				description={link.description}
				href={link.href}
				key={link.href}
				title={link.title}
				icon={link.icon}
			/>
		))}
	</>
);
