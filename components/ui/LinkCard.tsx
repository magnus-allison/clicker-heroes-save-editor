import { cn } from 'cn';
import { ArrowRight, ArrowUpRight, Crown, LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type CSSProperties, type FC } from 'react';

import { Link } from '@/i18n/navigation';
import { Pill } from './Pill';
import { EditorImage } from './EditorImage';

/** Message key under `common.cards.tags`. */
export type CardTag = 'mostPopular' | 'new' | 'comingSoon';

/** A card in a home page list. `key` names its title and description in `common.cards`. */
export type LinkCardItem<Key extends string = string> = {
	key: Key;
	href: string;
	icon: LucideIcon;
	tag?: CardTag;
};

interface Props {
	title: string;
	description: string;
	href: string;
	disabled?: boolean;
	tag?: CardTag;
	/** Position in the entrance stagger; set it to fade the card in on page load. */
	fadeIndex?: number;
}

/** Stagger position for the `fade-in-on-load` entrance (see globals.css). */
const fadeStyle = (fadeIndex?: number) =>
	fadeIndex === undefined ? undefined : ({ '--fade-index': fadeIndex } as CSSProperties);

export const LinkCard: FC<Props & { icon: LucideIcon }> = ({
	icon: Icon,
	title,
	description,
	href,
	disabled,
	fadeIndex,
	tag
}) => {
	const t = useTranslations('common.cards');
	const className = cn(
		`group flex h-full flex-col glass-card rounded-2xl p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-info`,
		disabled && 'opacity-50 select-none',
		fadeIndex !== undefined && 'fade-in-on-load'
	);
	const style = fadeStyle(fadeIndex);

	const content = (
		<>
			<span className='flex items-center gap-2'>
				<span className='flex items-center justify-center transition-[background-color] duration-200'>
					{Icon && <Icon aria-hidden='true' className='h-4.5 w-4.5' />}
				</span>
				{tag && (
					<Pill className='ml-auto' isShining={tag === 'mostPopular'}>
						{tag === 'mostPopular' && <Crown aria-hidden='true' className='h-3 w-3 shrink-0 text-cyan-400' />}
						{t(`tags.${tag}`)}
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
					{t('open')}
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
			<div aria-disabled='true' className={className} style={style}>
				{content}
			</div>
		);
	}

	return (
		<Link className={className} href={href} style={style}>
			{content}
		</Link>
	);
};

/** `tintIcon` recolours monochrome icons for the theme; leave it off for full-colour logos. */
export const ExternalLinkCard: FC<Props & { icon: string; tintIcon?: boolean }> = ({
	icon: Icon,
	tintIcon = true,
	title,
	description,
	fadeIndex,
	href,
	tag
}) => {
	const t = useTranslations('common.cards');

	return (
		<a
			className={cn(
				`group flex h-full flex-col glass-card rounded-2xl p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-info`,
				fadeIndex !== undefined && 'fade-in-on-load'
			)}
			href={href}
			style={fadeStyle(fadeIndex)}
			target='_blank'
			rel='noopener noreferrer'
		>
			<span className='flex items-center gap-2'>
				<span className='flex items-center justify-center transition-[background-color] duration-200'>
					{Icon && (
						<EditorImage
							alt={t('iconAlt', { title })}
							className='h-5 w-5 shrink-0 object-contain'
							size={44}
							src={Icon}
							style={tintIcon ? { filter: 'var(--color-icon-filter)' } : undefined}
						/>
					)}
				</span>
				{tag && (
					<Pill className='ml-auto' isShining={tag === 'mostPopular'}>
						{tag === 'mostPopular' && <Crown aria-hidden='true' className='h-3 w-3 shrink-0 text-cyan-400' />}
						{t(`tags.${tag}`)}
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
				{t('visit')}
				<ArrowUpRight
					aria-hidden='true'
					className='h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
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
			'font-aeonik mt-4 mb-6 block text-[1.24rem] tracking-wide font-semibold uppercase text-balance text-fg-strong [word-spacing:0.2em]',
			className
		)}
	>
		{title}
	</h3>
);
