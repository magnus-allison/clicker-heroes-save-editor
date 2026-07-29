import { ArrowRight, BookOpenTextIcon, type LucideIcon } from 'lucide-react';
import { type FC } from 'react';
import Link from 'next/link';

type GuideCard = {
	title: string;
	href: string;
	description: string;
	icon: LucideIcon;
	tag?: string;
};

const guides: GuideCard[] = [
	{
		title: 'new-player-guide',
		href: '/guides/new-player-guide',
		description: 'Fresh save to first transcension: ascending, ancients, rubies, mercs, and clans.',
		icon: BookOpenTextIcon,
		tag: 'New'
	}
];

interface Props {
	guide: GuideCard;
}

export const Guides: FC = () => (
	<>
		{guides.map((guide) => (
			<GuideCard guide={guide} key={guide.title} />
		))}
	</>
);

const GuideCard: FC<Props> = ({ guide }) => {
	const Icon = guide.icon;
	return (
		<Link
			className='group flex min-h-46 flex-col justify-between rounded-(--radius-panel) border border-(--color-line) bg-(--color-surface-raised) bg-[image:var(--gradient-raised)] p-5 text-(--color-fg) shadow-[var(--shadow-card)] hover:border-(--color-primary-line) hover:shadow-[var(--shadow-card-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)'
			href={guide.href}
		>
			<span>
				<span className='flex items-center gap-2'>
					<span className='flex items-center justify-center rounded-(--radius-card) text-primary-text transition-[background-color,border-color,color] duration-200 ease-snap group-hover:border-(--color-primary-line) group-hover:bg-(--color-primary-surface)'>
						<Icon aria-hidden='true' className='h-6 w-6' />
					</span>
					{guide.tag ? (
						<span className='ml-auto inline-flex h-6 items-center rounded-full border border-(--color-primary-line) bg-(--color-primary-soft) px-2 text-[10px] font-bold tracking-wide text-fg-strong shadow-[var(--shadow-raised)]'>
							{guide.tag}
						</span>
					) : null}
				</span>
				<span className='mt-6 block text-lg font-medium text-fg-strong'>{guide.title}</span>
				<span className='mt-2 block text-sm text-(--color-fg-muted)'>{guide.description}</span>
			</span>
			<span className='mt-5 inline-flex items-center gap-2 text-[12px] font-semibold text-(--color-primary-text)'>
				Read guide
				<ArrowRight
					aria-hidden='true'
					className='h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5'
				/>
			</span>
		</Link>
	);
};
