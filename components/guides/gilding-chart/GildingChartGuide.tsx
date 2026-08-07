import { type FC } from 'react';

import { GildingLookup } from '@/components/guides/gilding-chart/GildingLookup';
import { GildingTable } from '@/components/guides/gilding-chart/GildingTable';
import { GuideIndex, type GuideIndexPart } from '@/components/guides/GuideIndex';
import { GuideLink } from '@/components/guides/GuideLink';
import { GuideList, GuideListItem } from '@/components/guides/GuideList';
import { GuidePart } from '@/components/guides/GuidePart';
import { GuideSection } from '@/components/guides/GuideSection';
import { gildingPhases } from '@/lib/gilding-chart';
import { gildingChartFaqs } from '@/lib/seo';

const parts = [
	{
		id: 'find-your-hero',
		title: 'Find your hero',
		sections: [{ id: 'gold-lookup', title: 'Gold lookup' }]
	},
	{
		id: 'how-gilding-works',
		title: 'How gilding works',
		sections: [
			{ id: 'what-a-gild-does', title: 'What a gild does' },
			{ id: 'when-to-regild', title: 'When to re-gild' },
			{ id: 'ascending-and-transcending', title: 'Ascending and transcending' }
		]
	},
	{
		id: 'reading-the-chart',
		title: 'Reading the chart',
		sections: [
			{ id: 'the-columns', title: 'The columns' },
			{ id: 'skipping-rows', title: 'Skipping rows' },
			{ id: 'the-phases', title: 'The six phases' }
		]
	},
	{
		id: 'the-chart',
		title: 'The chart',
		sections: [{ id: 'full-chart', title: 'Full gilding chart' }]
	},
	{
		id: 'common-questions',
		title: 'Common questions',
		sections: [{ id: 'faq', title: 'Frequently asked' }]
	}
] as const satisfies readonly GuideIndexPart[];

type PartId = (typeof parts)[number]['id'];

/** Pulls a part's heading props from `parts` so the contents can never drift. */
const part = (id: PartId) => {
	const index = parts.findIndex((candidate) => candidate.id === id);
	const match = parts[index];

	if (!match) throw new Error(`Unknown guide part: ${id}`);

	return { id, index: index + 1, title: match.title };
};

export const GildingChartGuide: FC = () => (
	<article className='flex flex-col gap-10'>
		<div className='flex flex-col gap-6'>
			<p className='max-w-3xl text-[14px] leading-7 text-(--color-fg-secondary)'>
				Which hero to put every gild into, at every point in Clicker Heroes 1.0e11, from your first
				transcension through to the Ace Scouts. Enter your gold below and the chart tells you where you should
				be. Adapted from the community e10 chart and extended past Yachiyl.
			</p>
			<GuideIndex parts={parts} />
		</div>

		<GuidePart {...part('find-your-hero')}>
			<GuideSection
				id='gold-lookup'
				summary='Enter your current gold to jump straight to the row that applies to you.'
				title='Gold lookup'
			>
				<GildingLookup />
			</GuideSection>
		</GuidePart>

		<GuidePart {...part('how-gilding-works')}>
			<GuideSection
				id='what-a-gild-does'
				summary='A permanent +50% damage bonus attached to one specific hero.'
				title='What a gild does'
			>
				<GuideList>
					<GuideListItem>
						Gilds drop from zone bosses every 10 zones past 100, and they stack: 200 gilds on one hero is
						+100x that hero&apos;s damage.
					</GuideListItem>
					<GuideListItem>
						A gild only helps the hero it is sitting on, and moving one costs Hero Souls.
					</GuideListItem>
					<GuideListItem>
						So the whole game of gilding is this: exactly one hero is your damage dealer at any moment, and
						every gild you own should be on it.
					</GuideListItem>
					<GuideListItem>
						Before your first <GuideLink href='/guides/new-player-guide'>transcension</GuideLink> you will not
						have the Hero Souls to move gilds around freely. Get lucky gilds on one of the Power 5 (Treebeast,
						Ivan, Brittany, Samurai, Seer) and level that hero instead.
					</GuideListItem>
				</GuideList>
			</GuideSection>

			<GuideSection
				id='when-to-regild'
				summary='Only when you can see monster health bars.'
				title='When to re-gild'
			>
				<GuideList>
					<GuideListItem>
						While you are instakilling, extra damage does nothing at all. Re-gilding during that stretch
						spends Hero Souls on damage you cannot use.
					</GuideListItem>
					<GuideListItem>
						Once monsters start surviving your hits, switch to the optimal hero for your gold and move your
						gilds across.
					</GuideListItem>
					<GuideListItem>
						The <GuideLink href='/tools/ancients-calculator'>ancients calculator</GuideLink> can hold back 80
						Hero Souls per gild so a re-gild does not eat the souls you were saving for ancients.
					</GuideListItem>
				</GuideList>
			</GuideSection>

			<GuideSection
				id='ascending-and-transcending'
				summary='What to do once even the optimal hero cannot keep up.'
				title='Ascending and transcending'
			>
				<GuideList>
					<GuideListItem>
						When you cannot keep instakilling even after switching heroes, re-gilding and burning cooldowns,
						it is time to ascend.
					</GuideListItem>
					<GuideListItem>
						When ascending no longer earns new Ancient Souls, check &quot;Next AS&quot; on the last tab, it is
						time to transcend.
					</GuideListItem>
					<GuideListItem>
						Always ascend before you transcend. Any Hero Souls gained during your final ascension are lost
						otherwise.
					</GuideListItem>
					<GuideListItem>
						The <GuideLink href='/tools/transcension-viewer'>transcension viewer</GuideLink> shows Hero Soul
						and Ancient Soul gains per ascension, which makes that call easier.
					</GuideListItem>
				</GuideList>
			</GuideSection>
		</GuidePart>

		<GuidePart {...part('reading-the-chart')}>
			<GuideSection id='the-columns' summary='Four columns and one rule.' title='The columns'>
				<GuideList>
					<GuideListItem>
						<span className='font-medium text-fg-strong'>Gold</span> is log10, so the column shows exponents
						rather than amounts. A row listed at e442 needs 1e442 gold, which is the number after the
						&quot;e&quot; in your gold display.
					</GuideListItem>
					<GuideListItem>
						<span className='font-medium text-fg-strong'>From and To level</span> are where to start and stop
						leveling that hero. Past the target, the next row is more damage per gold.
					</GuideListItem>
					<GuideListItem>
						<span className='font-medium text-fg-strong'>Approx. AS</span> is roughly the Ancient Souls you
						would have on arrival. A sanity check rather than a gate, and it stops being listed past Xavira.
					</GuideListItem>
					<GuideListItem>
						<span className='font-medium text-fg-strong'>The rule:</span> find the last row whose gold
						requirement you have met. That hero gets every gild you own.
					</GuideListItem>
				</GuideList>
			</GuideSection>

			<GuideSection
				id='skipping-rows'
				summary='Skipping is expected. Two upgrades are worth backtracking for.'
				title='Skipping rows'
			>
				<GuideList>
					<GuideListItem>
						If your damage is high enough that you are still instakilling, blow straight past rows. Nothing is
						lost.
					</GuideListItem>
					<GuideListItem>
						Two upgrades are worth going back for regardless, and both are flagged in the chart:{' '}
						<span className='font-medium text-fg-strong'>Bomber Max at level 100</span> for +50% gold found,
						and <span className='font-medium text-fg-strong'>Gog at level 100</span> for +50% DPS on all
						heroes.
					</GuideListItem>
					<GuideListItem>
						Heroes reappearing later in the chart is not a mistake. Heroes gain 10x multipliers at level
						milestones and costs scale, so a hero that fell off can become the cheapest damage again.
					</GuideListItem>
				</GuideList>
			</GuideSection>

			<GuideSection
				id='the-phases'
				summary='The chart looks like 59 arbitrary rows. It is really six patterns.'
				title='The six phases'
			>
				<div className='grid gap-3 sm:grid-cols-2'>
					{gildingPhases.map((phase) => (
						<div
							className='rounded-(--radius-card) border border-(--color-line-subtle) bg-(--color-surface-muted) p-4'
							key={phase.id}
						>
							<p className='text-[13px] font-semibold text-fg-strong'>
								{phase.id}. {phase.title}
							</p>
							<p className='mt-1.5 text-[13px] leading-6 text-(--color-fg-muted)'>{phase.summary}</p>
							<p className='mt-2 font-mono text-[12px] text-(--color-gold)'>{phase.range}</p>
						</div>
					))}
				</div>
			</GuideSection>
		</GuidePart>

		<GuidePart {...part('the-chart')}>
			<GuideSection
				id='full-chart'
				summary='Grouped by phase. Flagged notes are the two upgrades worth backtracking for.'
				title='Full gilding chart'
			>
				<GildingTable />
			</GuideSection>
		</GuidePart>

		<GuidePart {...part('common-questions')}>
			<GuideSection
				id='faq'
				summary='The questions that come up every time this chart is posted.'
				title='Frequently asked'
			>
				<dl className='flex max-w-3xl flex-col gap-4'>
					{gildingChartFaqs.map((faq) => (
						<div key={faq.question}>
							<dt className='text-[13px] font-semibold text-fg-strong'>{faq.question}</dt>
							<dd className='mt-1 text-[13px] leading-6 text-(--color-fg-secondary)'>{faq.answer}</dd>
						</div>
					))}
				</dl>
			</GuideSection>
		</GuidePart>
	</article>
);
