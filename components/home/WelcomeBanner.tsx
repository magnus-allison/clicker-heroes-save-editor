'use client';

import { useLayoutEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpenTextIcon, FileCode2, Orbit, X, type LucideIcon } from 'lucide-react';

import {
	WELCOME_BANNER_ATTRIBUTE as ATTRIBUTE,
	WELCOME_BANNER_STORAGE_KEY as STORAGE_KEY
} from '@/lib/welcome-banner';
import { Button, buttonClassName } from '@/components/ui/Button';
import welcomeImage from '@/public/assets/home/clicker-heroes-welcome.webp';

type StartingPoint = {
	href: string;
	question: string;
	answer: string;
	icon: LucideIcon;
};

/** One entry per kind of first-time visitor, so everyone has an obvious first click. */
const startingPoints: StartingPoint[] = [
	{
		href: '/guides/new-player-guide',
		question: 'New to the game?',
		answer: 'New player guide',
		icon: BookOpenTextIcon
	},
	{
		href: '/tools/save-editor',
		question: 'Want to change your save?',
		answer: 'Save editor',
		icon: FileCode2
	},
	{
		href: '/tools/outsiders-calculator',
		question: 'Planning your next run?',
		answer: 'Outsiders calculator',
		icon: Orbit
	}
];

/** The home page's `<h1>` and welcome, in a card the visitor can dismiss for good. */
export const WelcomeBanner = () => {
	// Strict Mode's development remount resets attributes on <html> that React
	// does not manage, discarding what the inline script set. Re-applying
	// restores it; in production this is a no-op.
	useLayoutEffect(() => {
		try {
			if (localStorage.getItem(STORAGE_KEY) === '1') {
				document.documentElement.dataset[ATTRIBUTE] = '';
			}
		} catch {
			// Storage is unavailable in some privacy modes; the banner just stays.
		}
	}, []);

	const dismiss = () => {
		document.documentElement.dataset[ATTRIBUTE] = '';

		try {
			localStorage.setItem(STORAGE_KEY, '1');
		} catch {
			// Persistence is best-effort; the banner is already hidden.
		}
	};

	return (
		<section
			aria-labelledby='home-heading'
			className='relative grid overflow-hidden rounded-2xl bg-card-background shadow-card md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] [html[data-welcome-dismissed]_&]:hidden'
		>
			{/* Stacked above the text on phones; beside it from `md`, filling the card's height. */}
			<div className='relative aspect-[2/1] w-full md:aspect-auto md:h-full md:min-h-56'>
				<Image
					alt='Clicker Heroes artwork showing the game logo surrounded by its heroes and monsters'
					className='object-cover object-center brightness-75'
					fetchPriority='high'
					fill
					loading='eager'
					placeholder='blur'
					sizes='(min-width: 1220px) 540px, (min-width: 768px) 45vw, 100vw'
					src={welcomeImage}
				/>
				{/* Fades the art into the card: along the bottom when stacked, the right edge when side by side. */}
				<div
					aria-hidden='true'
					className='absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-card-background to-transparent md:inset-y-0 md:left-auto md:h-auto md:w-1/5 md:bg-linear-to-l'
				/>
			</div>

			<Button
				aria-label='Dismiss welcome message'
				className='absolute top-3 right-3 z-10 h-8 w-8 p-0'
				onClick={dismiss}
				size='sm'
				title='Dismiss'
				variant='subtle'
			>
				<X aria-hidden='true' className='h-4 w-4' />
			</Button>

			<div className='flex flex-col justify-center gap-4 p-5 pt-1 md:py-7 md:pr-14 md:pl-7'>
				<div className='flex flex-col gap-1.5'>
					<p className='font-aeonik text-[10px] font-medium uppercase tracking-[0.11em] text-[#C840BE] dark:text-[#FF57F9] md:text-[11px] md:tracking-[0.13em]'>
						Welcome to clickerheroes.dev
					</p>
					<h1
						className='font-aeonik text-xl font-bold tracking-wide text-fg-strong lg:text-2xl'
						id='home-heading'
					>
						Clicker Heroes Save Editor, Calculators &amp; Guides
					</h1>
					<p className='font-aeonik text-[15px] font-light tracking-[0.035rem] text-fg-muted/80'>
						Free tools for every stage of the game, from your first clicks to deep transcensions. It all runs
						in your browser, with nothing to install and no account needed.
					</p>
				</div>

				<ul className='flex flex-col gap-2'>
					{startingPoints.map(({ answer, href, icon: Icon, question }) => (
						<li key={href}>
							<Link
								className={buttonClassName({
									variant: 'subtle',
									fullWidth: true,
									// Two short lines on narrow screens, so the fixed button
									// height gives way to padding.
									className: 'group h-auto min-h-10 justify-start gap-3 py-2 text-left leading-snug'
								})}
								href={href}
							>
								<Icon aria-hidden='true' className='h-4 w-4 shrink-0' />
								<span className='flex min-w-0 flex-wrap items-baseline gap-x-2'>
									<span className='text-(--color-fg-dim)'>{question}</span>
									<span className='font-semibold'>{answer}</span>
								</span>
								<ArrowRight
									aria-hidden='true'
									className='ml-auto h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5'
								/>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
};
