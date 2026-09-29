import { type FC } from 'react';

import { GuideIndex, type GuideIndexPart } from '@/components/guides/GuideIndex';
import { GuideLink } from '@/components/guides/GuideLink';
import { GuideList, GuideListItem } from '@/components/guides/GuideList';
import { GuidePart } from '@/components/guides/GuidePart';
import { GuideSection } from '@/components/guides/GuideSection';

const parts = [
	{
		id: 'resets',
		title: 'Resets',
		sections: [
			{ id: 'ascend-early-and-often', title: '1. Ascend early and often' },
			{ id: 'transcend-on-time', title: '2. Transcend on time' }
		]
	},
	{
		id: 'heroes',
		title: 'Heroes',
		sections: [
			{ id: 'push-your-newest-hero', title: '3. Push your newest hero' },
			{ id: 'keep-gilds-on-one-hero', title: '4. Keep gilds on one hero' }
		]
	},
	{
		id: 'souls',
		title: 'Souls and builds',
		sections: [
			{ id: 'commit-to-a-build', title: '5. Commit to a build' },
			{ id: 'let-the-calculators-do-the-maths', title: '6. Let the calculators do the maths' }
		]
	},
	{
		id: 'skills-and-rubies',
		title: 'Skills and rubies',
		sections: [
			{ id: 'chain-your-skills', title: '7. Chain your skills' },
			{ id: 'spend-rubies-on-auto-clickers', title: '8. Spend rubies on auto-clickers' }
		]
	},
	{
		id: 'everything-else',
		title: 'Everything else',
		sections: [
			{ id: 'use-the-side-systems', title: '9. Use the side systems' },
			{ id: 'break-through-walls', title: '10. Break through walls' },
			{ id: 'where-to-go-next', title: 'Where to go next' }
		]
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

export const ProgressTipsGuide: FC = () => (
	<article className='flex flex-col gap-10'>
		<div className='flex flex-col gap-6'>
			<p className='max-w-3xl text-[14px] leading-7 text-(--color-fg-secondary)'>
				Ten habits that make the biggest difference to how fast a Clicker Heroes 1.0e12 save moves. None of
				them are secrets, but most slow saves are missing at least one. If you are starting from scratch, read
				the <GuideLink href='/guides/new-player-guide'>new player guide</GuideLink> first — this picks up
				where it leaves off.
			</p>
			<GuideIndex parts={parts} />
		</div>

		<GuidePart {...part('resets')}>
			<GuideSection
				id='ascend-early-and-often'
				summary='A short run that doubles your Hero Souls beats a long run that barely moves them.'
				title='1. Ascend early and often'
			>
				<GuideList>
					<GuideListItem>
						Progress comes from resets, not from any single run. Pushing deeper after your gains have stalled
						is time you could have spent on a faster next run.
					</GuideListItem>
					<GuideListItem>
						Early on, a good rule is to ascend once the run would at least double the Hero Souls you already
						have.
					</GuideListItem>
					<GuideListItem>
						If the next boss wall would take more than a few minutes of farming, ascending is usually the
						quicker way past it.
					</GuideListItem>
					<GuideListItem>
						Spend every Hero Soul on ancients straight after ascending, before you start the new run.
					</GuideListItem>
				</GuideList>
			</GuideSection>

			<GuideSection
				id='transcend-on-time'
				summary='Take the first one at zone 300. After that, watch your soul growth.'
				title='2. Transcend on time'
			>
				<GuideList>
					<GuideListItem>
						Transcend as soon as it unlocks at zone 300. Transcendent Power boosts every primal boss after
						that, so any souls you grind beforehand come back quickly.
					</GuideListItem>
					<GuideListItem>
						Later transcensions are about timing: when each ascension is only adding a small fraction to your
						Hero Souls, the transcension is played out.
					</GuideListItem>
					<GuideListItem>
						The <GuideLink href='/tools/transcension-viewer'>transcension viewer</GuideLink> shows Hero Souls
						and Ancient Souls per ascension straight from your save, which makes the slowdown easy to spot.
					</GuideListItem>
					<GuideListItem>
						The <GuideLink href='/tools/outsiders-calculator'>outsiders calculator</GuideLink> estimates the
						zone and Ancient Souls a transcension should end on, so you know roughly where to stop before you
						start.
					</GuideListItem>
				</GuideList>
			</GuideSection>
		</GuidePart>

		<GuidePart {...part('heroes')}>
			<GuideSection
				id='push-your-newest-hero'
				summary='Damage comes from one hero at a time. Make sure it is the right one.'
				title='3. Push your newest hero'
			>
				<GuideList>
					<GuideListItem>
						Each new hero is a tier above the last, so your gold almost always does more on the newest hero
						you can afford than on anyone behind it.
					</GuideListItem>
					<GuideListItem>
						Buy their upgrades as soon as they unlock — they are nearly always the best gold-for-damage buy
						available.
					</GuideListItem>
					<GuideListItem>
						Past level 200, level in multiples of 25. Most heroes get a damage multiplier every 25 levels, and
						stopping just short of one wastes gold.
					</GuideListItem>
					<GuideListItem>
						Older heroes stop mattering once they are left behind. Do not spread gold across the whole roster
						to keep them level.
					</GuideListItem>
				</GuideList>
			</GuideSection>

			<GuideSection
				id='keep-gilds-on-one-hero'
				summary='Spread gilds do nothing. Stacked on your main hero, they multiply everything.'
				title='4. Keep gilds on one hero'
			>
				<GuideList>
					<GuideListItem>
						Every gild adds damage to one hero only. Scattered across several heroes, most of that bonus sits
						on heroes you are not using.
					</GuideListItem>
					<GuideListItem>
						Move all of your gilds onto the hero carrying your damage, and move them again when a newer hero
						takes over.
					</GuideListItem>
					<GuideListItem>
						Regilding costs Hero Souls, so only do it when your current hero is clearly falling behind — not
						on every small change.
					</GuideListItem>
					<GuideListItem>
						The <GuideLink href='/guides/gilding-chart'>hero gilding chart</GuideLink> tells you which hero to
						gild at your current gold.
					</GuideListItem>
				</GuideList>
			</GuideSection>
		</GuidePart>

		<GuidePart {...part('souls')}>
			<GuideSection
				id='commit-to-a-build'
				summary='Idle, hybrid or active. Pick the one that matches how you actually play.'
				title='5. Commit to a build'
			>
				<GuideList>
					<GuideListItem>
						Idle suits players who check in a few times a day. Siyalatas and Libertas reward you for leaving
						the game alone.
					</GuideListItem>
					<GuideListItem>
						Active suits players who sit with the game open. Juggernaut, Fragsworth and Bhaal scale with
						clicking, and in-game auto-clickers do that clicking for you.
					</GuideListItem>
					<GuideListItem>
						Hybrid splits souls between the two and suits most players once they have a few auto-clickers.
					</GuideListItem>
					<GuideListItem>
						Half an idle build and half an active one is weaker than either done properly. Choose one and
						spend souls to match it.
					</GuideListItem>
				</GuideList>
			</GuideSection>

			<GuideSection
				id='let-the-calculators-do-the-maths'
				summary='Ancient and outsider levels are formulas. There is no reason to guess them.'
				title='6. Let the calculators do the maths'
			>
				<GuideList>
					<GuideListItem>
						Import your save into the{' '}
						<GuideLink href='/tools/ancients-calculator'>ancients calculator</GuideLink> after every
						ascension. It returns optimal ancient levels for your build, and what each level costs.
					</GuideListItem>
					<GuideListItem>
						Run the <GuideLink href='/tools/outsiders-calculator'>outsiders calculator</GuideLink> at the
						start of every transcension. Outsiders respec for free, so there is nothing to lose by following
						it.
					</GuideListItem>
					<GuideListItem>
						When the calculator and your instinct disagree, trust the calculator. Hand-levelled ancients are
						one of the most common reasons a save feels slow.
					</GuideListItem>
				</GuideList>
			</GuideSection>
		</GuidePart>

		<GuidePart {...part('skills-and-rubies')}>
			<GuideSection
				id='chain-your-skills'
				summary='Skills used together hit much harder than skills used whenever they come off cooldown.'
				title='7. Chain your skills'
			>
				<GuideList>
					<GuideListItem>
						Save your damage skills for boss fights and fire them together, so the short windows overlap.
					</GuideListItem>
					<GuideListItem>
						Energize doubles the next skill you use, and Reload cuts the cooldown of the last one. Both are
						worth far more paired with another skill than used on their own.
					</GuideListItem>
					<GuideListItem>
						Dark Ritual permanently raises your DPS for the rest of the ascension. The classic Energize, Dark
						Ritual, Reload chain early in a run pays off for every zone after it.
					</GuideListItem>
					<GuideListItem>
						Use Metal Detector and Golden Clicks together when farming gold for a big level-up.
					</GuideListItem>
				</GuideList>
			</GuideSection>

			<GuideSection
				id='spend-rubies-on-auto-clickers'
				summary='Rubies are scarce. Spend them on things that keep working.'
				title='8. Spend rubies on auto-clickers'
			>
				<GuideList>
					<GuideListItem>
						Auto-clickers are the best long-term ruby buy. They power active and hybrid builds and Nogardnit
						on idle.
					</GuideListItem>
					<GuideListItem>
						Timelapse is worth saving for later in the game, when skipping hours of progress covers a lot of
						zones.
					</GuideListItem>
					<GuideListItem>
						Skip recruiting mercenaries, buying gilds, relics and extra raid fights. They cost a lot and give
						little back.
					</GuideListItem>
					<GuideListItem>
						The <GuideLink href='/guides/new-player-guide#spending-rubies'>ruby section</GuideLink> of the new
						player guide has the full buy order.
					</GuideListItem>
				</GuideList>
			</GuideSection>
		</GuidePart>

		<GuidePart {...part('everything-else')}>
			<GuideSection
				id='use-the-side-systems'
				summary='Mercenaries, clans and backups each take a minute a day and add up over weeks.'
				title='9. Use the side systems'
			>
				<GuideList>
					<GuideListItem>
						Keep mercenaries questing at all times, and pick ruby quests whenever they are offered. The{' '}
						<GuideLink href='/tools/mercenary-viewer'>mercenary viewer</GuideLink> shows your roster and their
						lifetime stats.
					</GuideListItem>
					<GuideListItem>
						Join a clan and fight the daily raid boss. It is free Hero Souls for a few clicks.
					</GuideListItem>
					<GuideListItem>
						Back up your save regularly — export it and keep the string somewhere safe. A lost save is the
						slowest progress of all.
					</GuideListItem>
				</GuideList>
			</GuideSection>

			<GuideSection
				id='break-through-walls'
				summary='A wall means something needs to change. Waiting rarely fixes it.'
				title='10. Break through walls'
			>
				<GuideList>
					<GuideListItem>
						Stuck on a boss? Drop back a zone, farm gold, and level your main hero to its next multiple of 25
						before trying again.
					</GuideListItem>
					<GuideListItem>
						Save your skills for the boss and fire them all at once rather than on cooldown.
					</GuideListItem>
					<GuideListItem>
						Check your gilds are on the right hero and your ancients match the calculator. A wall that appears
						suddenly is often one of those two.
					</GuideListItem>
					<GuideListItem>
						Once Kumawakamaru and Borb start thinning out monster counts, the{' '}
						<GuideLink href='/tools/instakill-calculator'>instakill calculator</GuideLink> shows how fast you
						should be moving through zones.
					</GuideListItem>
					<GuideListItem>
						If none of that works, the run is probably over. Ascend and come back stronger.
					</GuideListItem>
				</GuideList>
			</GuideSection>

			<GuideSection id='where-to-go-next' summary='More detail on the topics above.' title='Where to go next'>
				<GuideList>
					<GuideListItem>
						<GuideLink href='/guides/new-player-guide'>New player guide</GuideLink> — a fresh save to your
						first transcension, step by step.
					</GuideListItem>
					<GuideListItem>
						<GuideLink href='/guides/gilding-chart'>Hero gilding chart</GuideLink> — which hero to gild, and
						when.
					</GuideListItem>
					<GuideListItem>
						<GuideLink href='https://blog.clickerheroes.com/top-10-clicker-tips-to-speed-up-progress-in-clicker-heroes/'>
							Official Clicker Heroes blog
						</GuideLink>{' '}
						— the developers&rsquo; own list of tips.
					</GuideListItem>
					<GuideListItem>
						Ask questions on the{' '}
						<GuideLink href='https://www.reddit.com/r/ClickerHeroes/'>Clicker Heroes subreddit</GuideLink> or
						the official Discord.
					</GuideListItem>
				</GuideList>
			</GuideSection>
		</GuidePart>
	</article>
);
