import type { FC } from 'react';
import type { LucideIcon } from 'lucide-react';

import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { EditorImage } from '@/components/ui/EditorImage';
import { Pill } from '@/components/ui/Pill';
import { cn } from '@/lib/cn';

export type LinkCardItem = {
	title: string;
	href: string;
	description: string;
	icon: LucideIcon;
	tag?: string;
	tagIsShining?: boolean;
	comingSoon?: boolean;
};

type Props = {
	href: string;
	title: string;
	description?: string;
	layout?: 'vertical' | 'horizontal';
	/** Lucide glyph, for vertical tiles. */
	icon?: LucideIcon;
	/** Image asset, for horizontal rows. Takes precedence over `icon`. */
	iconSrc?: string;
	/** Image icons are inverted in dark mode unless this is explicitly `false`. */
	invertIcon?: boolean;
	tag?: string;
	/** Gives the tag pill the gold spinning border. */
	tagIsShining?: boolean;
	/** Footer text. Omit on horizontal rows to show the arrow alone. */
	cta?: string;
	/** Opens in a new tab and swaps the chevron for the outbound arrow. */
	external?: boolean;
	/** Renders inert markup: no link, no arrow, dimmed. */
	disabled?: boolean;
};

const layoutClassName = {
	vertical: 'flex min-h-46 flex-col justify-between text-(--color-fg)',
	horizontal: 'flex items-center gap-4'
} as const;

const interactiveClassName =
	'hover:border-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-strong';

export const LinkCard: FC<Props> = ({
	cta,
	description,
	disabled = false,
	external = false,
	href,
	icon: Icon,
	iconSrc,
	invertIcon,
	layout = 'vertical',
	tag,
	tagIsShining = false,
	title
}) => {
	const arrow = external ? (
		<ArrowUpRight
			aria-hidden='true'
			className='h-3.5 w-3.5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5'
		/>
	) : (
		<ArrowRight
			aria-hidden='true'
			className='h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5'
		/>
	);

	const body =
		layout === 'vertical' ? (
			<>
				<span className='flex items-center gap-2'>
					{Icon && (
						<span className='flex items-center justify-center transition-[background-color] duration-200'>
							<Icon aria-hidden='true' className='h-5 w-5' />
						</span>
					)}
					{tag && (
						<Pill className='ml-auto' isShining={tagIsShining}>
							{tag}
						</Pill>
					)}
				</span>
				<span className='mt-5 block text-[1.1rem] font-medium text-fg-strong mb-7 uppercase'>{title}</span>
				{description && <span className='block text-sm text-(--color-fg-muted)'>{description}</span>}
				<span className='mt-5 inline-flex items-center gap-2 text-[12px] font-semibold'>
					{cta}
					{!disabled && arrow}
				</span>
			</>
		) : (
			<>
				{iconSrc && (
					<EditorImage
						alt={`${title} icon`}
						className='h-11 w-11 shrink-0 object-contain'
						size={44}
						src={iconSrc}
						style={invertIcon === false ? undefined : { filter: 'var(--color-icon-filter)' }}
					/>
				)}
				<span className='min-w-0'>
					<span className='block text-sm font-medium text-fg-strong'>{title}</span>
					{description && <span className='mt-1 block text-sm text-(--color-fg-muted)'>{description}</span>}
				</span>
				<span className='ml-auto inline-flex shrink-0 items-center gap-2 text-[12px] font-semibold'>
					{cta}
					{!disabled && arrow}
				</span>
			</>
		);

	const className = cn(
		`group rounded-card bg-card-background p-5 shadow-(--shadow-card)`,
		layoutClassName[layout],
		!disabled && interactiveClassName
	);

	if (disabled) {
		return (
			<div aria-disabled='true' className={cn(className, 'cursor-default opacity-60')}>
				{body}
			</div>
		);
	}

	if (external) {
		return (
			<a className={className} href={href} rel='noreferrer' target='_blank'>
				{body}
			</a>
		);
	}

	return (
		<Link className={className} href={href}>
			{body}
		</Link>
	);
};
