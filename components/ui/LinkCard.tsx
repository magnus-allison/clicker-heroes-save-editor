import { cn } from '@/lib/cn';
import { ArrowRight, ArrowUpRight, LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { type FC } from 'react';
import { Pill } from './Pill';
import { EditorImage } from './EditorImage';

export interface CardItem {
	title: string;
	description: string;
	href: string;
	tag?: 'Most popular' | 'New' | 'Coming soon';
}

export type LinkCardItem = CardItem & {
	icon: LucideIcon;
};

export type ExternalLinkCardItem = CardItem & {
	icon: string;
};

interface Props {
	title: LinkCardItem['title'];
	description: LinkCardItem['description'];
	href: LinkCardItem['href'];
	disabled?: boolean;
	tag?: LinkCardItem['tag'];
}

export const LinkCard: FC<Props & { icon: LucideIcon }> = ({
	icon: Icon,
	title,
	description,
	href,
	disabled,
	tag
}) => {
	const className = cn(
		`group flex h-full flex-col rounded-2xl bg-card-background p-5 transition-shadow duration-300 shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-strong hover:shadow-card-hover`,
		disabled && 'opacity-50 select-none'
	);

	const content = (
		<>
			<span className='flex items-center gap-2'>
				<span className='flex items-center justify-center transition-[background-color] duration-200'>
					{Icon && <Icon aria-hidden='true' className='h-4.5 w-4.5' />}
				</span>
				{tag && (
					<Pill className='ml-auto' isShining={tag === 'Most popular'}>
						{tag}
					</Pill>
				)}
			</span>
			<CardTitle title={title} />
			{description && (
				<span className='block text-[1rem] text-fg-muted/80 items-center gap-2 font-light tracking-[0.035rem] transition-colors font-aeonik'>
					{description}
				</span>
			)}
			{!disabled && (
				<span className='mt-auto pt-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-fg-dim transition-colors font-aeonik group-hover:text-fg-strong'>
					Open
					<ArrowRight
						aria-hidden='true'
						className='h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5'
					/>
				</span>
			)}
		</>
	);

	/*
	 * A disabled card has nothing to navigate to, so it drops the anchor
	 * entirely rather than keeping one and blocking it with
	 * `pointer-events-none`: that stops the mouse but leaves the card in the tab
	 * order, still announced as a link, and still activatable with Enter.
	 */
	if (disabled) {
		return (
			<div aria-disabled='true' className={className}>
				{content}
			</div>
		);
	}

	return (
		<Link className={className} href={href}>
			{content}
		</Link>
	);
};

export const ExternalLinkCard: FC<Props & { icon: string }> = ({
	icon: Icon,
	title,
	description,
	href,
	tag
}) => {
	return (
		<a
			className={cn(
				`group flex h-full flex-col rounded-2xl bg-card-background p-5 transition-shadow duration-300 shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-strong hover:shadow-card-hover`
			)}
			href={href}
			target='_blank'
			rel='noopener noreferrer'
		>
			<span className='flex items-center gap-2'>
				<span className='flex items-center justify-center transition-[background-color] duration-200'>
					{Icon && (
						<EditorImage
							alt={`${title} icon`}
							className='h-5 w-5 shrink-0 object-contain'
							size={44}
							src={Icon}
							style={title === 'Clicker Heroes' ? undefined : { filter: 'var(--color-icon-filter)' }}
						/>
					)}
				</span>
				{tag && (
					<Pill className='ml-auto' isShining={tag === 'Most popular'}>
						{tag}
					</Pill>
				)}
			</span>
			<CardTitle title={title} />
			{description && (
				<span className='block text-[1rem] text-fg-muted/80 items-center gap-2 font-light tracking-[0.035rem] transition-colors font-aeonik'>
					{description}
				</span>
			)}
			<span
				className={cn(
					'mt-auto pt-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-fg-dim transition-colors font-aeonik group-hover:text-fg-strong'
				)}
			>
				Visit
				<ArrowUpRight
					aria-hidden='true'
					className='h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5'
				/>
			</span>
		</a>
	);
};

interface CardTitleProps {
	title: string;
	className?: string;
}

export const CardTitle: FC<CardTitleProps> = ({ title, className }) => (
	<h3
		className={cn(
			'font-aeonik mt-4 mb-6 block text-[1.24rem] tracking-wide font-semibold uppercase text-fg-strong [word-spacing:0.2em]',
			className
		)}
	>
		{title}
	</h3>
);
