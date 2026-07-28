import {
	Calculator,
	FileCode2,
	LucideIcon,
	Landmark,
	History,
	Wrench,
	ArrowRightLeft,
	ArrowRight
} from 'lucide-react';
import { type FC } from 'react';
import Link from 'next/link';

type ToolCard = {
	title: string;
	href: string;
	description: string;
	icon: LucideIcon;
	tag?: string;
};

const tools: ToolCard[] = [
	{
		title: 'save-editor',
		href: '/tools/save-editor',
		description: 'Decode, inspect, edit, and re-encode Clicker Heroes save files.',
		icon: FileCode2,
		tag: 'Most popular'
	},
	{
		title: 'instakill-calculator',
		href: '/tools/instakill-calculator',
		description: 'Estimate route duration, monsters per zone, and zones per hour.',
		icon: Calculator
	},
	{
		title: 'ancients-calculator',
		href: '/tools/ancients-calculator',
		description: 'Get optimal ancient levels and costs for your hero souls.',
		icon: Landmark
	},
	{
		title: 'transcension-viewer',
		href: '/tools/transcension-viewer',
		description: 'Inspect transcension history and drill into ascensions from a save.',
		icon: History
	},
	{
		title: 'remove-clan-data',
		href: '/tools/remove-clan-data',
		description: 'Remove clan, account, and login fields from a save in your browser.',
		icon: Wrench
	},
	{
		title: 'save-converter',
		href: '/tools/save-converter',
		description: 'Convert Clicker Heroes saves between PC and mobile formats.',
		icon: ArrowRightLeft
	}
] as const;

interface Props {
	tool: ToolCard;
}

export const Tools: FC = () => (
	<>
		{tools.map((tool) => (
			<ToolCard tool={tool} key={tool.title} />
		))}
	</>
);

const ToolCard: FC<Props> = ({ tool }) => {
	const Icon = tool.icon;
	return (
		<Link
			className='group flex min-h-46 flex-col justify-between rounded-(--radius-panel) border border-(--color-line) bg-(--color-surface-raised) bg-[image:var(--gradient-raised)] p-5 text-(--color-fg) shadow-[var(--shadow-card)] hover:border-(--color-primary-line) hover:shadow-[var(--shadow-card-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)'
			href={tool.href}
			key={tool.href}
		>
			<span>
				<span className='flex items-center gap-2'>
					<span className='flex items-center justify-center rounded-(--radius-card) text-primary-text transition-[background-color,border-color,color] duration-200 ease-snap group-hover:border-(--color-primary-line) group-hover:bg-(--color-primary-surface)'>
						<Icon aria-hidden='true' className='h-6 w-6' />
					</span>
					{tool.tag ? (
						<span className='ml-auto inline-flex h-6 items-center rounded-full border border-(--color-primary-line) bg-(--color-primary-soft) px-2 text-[10px] font-bold tracking-wide text-fg-strong shadow-[var(--shadow-raised)]'>
							{tool.tag}
						</span>
					) : null}
				</span>
				<span className='mt-6 block text-lg font-medium text-fg-strong'>{tool.title}</span>
				<span className='mt-2 block text-sm text-(--color-fg-muted)'>{tool.description}</span>
			</span>
			<span className='mt-5 inline-flex items-center gap-2 text-[12px] font-semibold text-(--color-primary-text)'>
				Open tool
				<ArrowRight
					aria-hidden='true'
					className='h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5'
				/>
			</span>
		</Link>
	);
};
