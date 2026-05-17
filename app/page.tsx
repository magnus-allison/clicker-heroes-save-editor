import type { Metadata } from 'next';
import Link from 'next/link';
import {
	ArrowRight,
	BookOpen,
	Calculator,
	FileCode2,
	History,
	MessageSquare,
	Wrench,
	type LucideIcon
} from 'lucide-react';

import { createPageJsonLd, createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata('home');

const structuredData = createPageJsonLd('home');

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
	}
] as const;

const Page = () => (
	<>
		<script
			type='application/ld+json'
			dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
		/>
		<div className='flex min-h-screen w-full justify-center overflow-x-hidden p-5 sm:p-10'>
		<main className='flex w-full max-w-6xl flex-col gap-10'>
			<section className='grid gap-6 rounded-2xl border border-(--color-border) bg-(--color-bg-alt) p-5 shadow-[0_2px_8px_var(--color-shadow)] md:grid-cols-[auto_minmax(0,1fr)] md:items-center md:p-7'>
				<div className='flex h-20 w-20 items-center justify-center rounded-(--input-radius) border border-(--color-border-subtle) bg-(--color-bg-elevated) p-3'>
					<img
						alt='Clicker Heroes'
						className='h-14 w-14 object-contain'
						src='/assets/icons/clicker-heroes.png'
					/>
				</div>
				<div>
					<p className='mb-2 text-[11px] font-semibold uppercase tracking-normal text-(--color-primary)'>
						Clicker Heroes
					</p>
					<h1 className='text-[1.75rem] font-semibold leading-[1.2] text-(--color-text-strong)'>
						Save tools and calculators
					</h1>
					<p className='mt-3 max-w-3xl text-sm text-(--color-text-muted)'>
						Browser-based utilities for editing save data, planning faster runs, and cleaning up
						problematic account or clan fields.
					</p>
				</div>
			</section>

			<section aria-labelledby='guides-heading' className='flex flex-col gap-3'>
				<SectionHeading
					description='Short walkthroughs for common save editing and route planning tasks.'
					icon={<BookOpen aria-hidden='true' className='h-4 w-4' />}
					title='Guides'
				/>
				<div className='rounded-2xl border border-dashed border-(--color-border) bg-(--color-bg-alt) p-5 text-sm text-(--color-text-muted) shadow-[0_2px_8px_var(--color-shadow)]'>
					<span className='font-semibold text-(--color-text-strong)'>Coming soon.</span> Guides are
					being written for the most common Clicker Heroes save workflows.
				</div>
			</section>

			<section aria-labelledby='tools-heading' className='flex flex-col gap-3'>
				<SectionHeading
					description='Pick the utility you need and keep everything local in your browser.'
					icon={<Wrench aria-hidden='true' className='h-4 w-4' />}
					title='Tools'
				/>
				<div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
					{tools.map((tool) => {
						const Icon = tool.icon;

						return (
							<Link
								className='group flex min-h-46 flex-col justify-between rounded-2xl border border-(--color-border) bg-(--color-bg-alt) p-5 text-(--color-text) shadow-[0_2px_8px_var(--color-shadow)] transition hover:border-(--color-border-hover) hover:bg-(--color-bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)'
								href={tool.href}
								key={tool.href}
							>
								<span>
									<span className='flex items-center gap-2'>
										<span className='flex h-10 w-10 items-center justify-center rounded-(--input-radius) border border-(--color-border-subtle) bg-(--color-bg-elevated) text-(--color-primary)'>
											<Icon aria-hidden='true' className='h-4 w-4' />
										</span>
										{tool.tag ? (
											<span className='ml-auto inline-flex h-6 items-center rounded-full border border-(--color-primary-border) bg-(--color-primary-dim) px-2 text-[10px] font-bold tracking-wide text-(--color-primary)'>
												{tool.tag}
											</span>
										) : null}
									</span>
									<span className='mt-6 block text-base font-semibold text-(--color-text-strong)'>
										{tool.title}
									</span>
									<span className='mt-2 block text-sm text-(--color-text-muted)'>
										{tool.description}
									</span>
								</span>
								<span className='mt-5 inline-flex items-center gap-2 text-[12px] font-semibold text-(--color-primary)'>
									Open tool
									<ArrowRight
										aria-hidden='true'
										className='h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5'
									/>
								</span>
							</Link>
						);
					})}
				</div>
			</section>

			<section aria-labelledby='feedback-heading' className='flex flex-col gap-3'>
				<SectionHeading
					description='Send general feedback, report issues, or request features and guides.'
					icon={<MessageSquare aria-hidden='true' className='h-4 w-4' />}
					title='Feedback'
				/>
				<Link
					className='group rounded-2xl border border-(--color-border) bg-(--color-bg-alt) p-5 shadow-[0_2px_8px_var(--color-shadow)] transition hover:border-(--color-border-hover) hover:bg-(--color-bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)'
					href='/feedback'
				>
					<div className='grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center'>
						<div>
							<p className='text-[11px] font-semibold uppercase tracking-normal text-(--color-primary)'>
								General feedback
							</p>
							<h3 className='mt-2 text-[1.1rem] font-semibold text-(--color-text-strong)'>
								Report bugs, request features, or suggest a guide
							</h3>
							<p className='mt-2 max-w-3xl text-sm text-(--color-text-muted)'>
								Use the feedback page for editor issues, calculator edge cases, missing
								workflows, or anything else that would make the site more useful.
							</p>
							<div className='mt-4 flex flex-wrap gap-2'>
								{['Bug report', 'Feature request', 'Guide idea'].map((label) => (
									<span
										className='inline-flex h-7 items-center rounded-full border border-(--color-border-soft) bg-(--color-bg-soft) px-3 text-[11px] text-(--color-text-secondary)'
										key={label}
									>
										{label}
									</span>
								))}
							</div>
						</div>
						<span className='inline-flex items-center gap-2 text-[12px] font-semibold text-(--color-primary)'>
							Open feedback page
							<ArrowRight
								aria-hidden='true'
								className='h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5'
							/>
						</span>
					</div>
				</Link>
			</section>
		</main>
		</div>
	</>
);

type SectionHeadingProps = {
	description: string;
	icon: React.ReactNode;
	title: string;
};

const SectionHeading = ({ description, icon, title }: SectionHeadingProps) => (
	<div className='grid gap-3 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start'>
		<span className='flex h-9 w-9 items-center justify-center rounded-(--input-radius) border border-(--color-border-soft) bg-(--color-bg-soft) text-(--color-text-secondary)'>
			{icon}
		</span>
		<div>
			<h2
				className='text-[1.25rem] font-semibold leading-tight text-(--color-text-strong)'
				id={`${title.toLowerCase()}-heading`}
			>
				{title}
			</h2>
			<p className='mt-1 max-w-3xl text-sm text-(--color-text-muted)'>{description}</p>
		</div>
	</div>
);

export default Page;
