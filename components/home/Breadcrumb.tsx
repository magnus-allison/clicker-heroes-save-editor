import { type FC } from 'react';
import Link from 'next/link';
import { BookOpen, BoxIcon, ChevronRight, Info, type LucideIcon } from 'lucide-react';

interface Props {
	/** The group the page sits in — matches the home page section headings. */
	title: 'tools' | 'guides' | 'additional info';
	/** The page itself: a tool, guide, or info page. Omitted on the home page. */
	subtitle?: string;
}

const groups: Record<Props['title'], { icon: LucideIcon; href: string }> = {
	tools: { icon: BoxIcon, href: '/#tools' },
	guides: { icon: BookOpen, href: '/#guides' },
	'additional info': { icon: Info, href: '/#additional-info' }
};

export const Breadcrumb: FC<Props> = ({ title, subtitle }) => {
	const { icon: Icon, href } = groups[title];
	const id = `${title.replace(/\s+/g, '-')}-heading`;

	return (
		<div className='flex flex-col'>
			<div className='flex flex-row items-center'>
				<span className='flex h-10 w-10 shrink-0 items-center justify-center text-fg-strong'>
					<Icon aria-hidden='true' className='h-5 w-5' />
				</span>
				<h2
					className='flex flex-row items-center text-lg font-semibold leading-tight text-fg-strong font-aeonik [word-spacing:0.2em] uppercase tracking-wide'
					id={id}
				>
					{subtitle ? (
						<>
							<Link
								className='rounded-radius-control text-fg-dim transition-colors hover:text-fg-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring'
								href={href}
							>
								{title}
							</Link>
							<ChevronRight aria-hidden='true' className='mx-1.5 h-4 w-4 shrink-0 text-fg-dim' />
							<span>{subtitle}</span>
						</>
					) : (
						title
					)}
				</h2>
			</div>
		</div>
	);
};
