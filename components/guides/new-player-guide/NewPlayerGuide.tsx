import { type FC } from 'react';

import { GuideIndex, type GuideIndexPart } from '@/components/guides/GuideIndex';
import { GuideLink } from '@/components/guides/GuideLink';
import { GuideList, GuideListItem } from '@/components/guides/GuideList';
import { GuidePart } from '@/components/guides/GuidePart';
import { GuideSection } from '@/components/guides/GuideSection';

const parts = [
	{
		id: 'the-early-game',
		title: 'The early game',
		sections: [
			{ id: 'your-first-run', title: 'Your first run' },
			{ id: 'when-to-ascend', title: 'When to ascend' },
			{ id: 'beyond-zone-130', title: 'Beyond zone 130' }
		]
	},
	{
		id: 'ancients',
		title: 'Ancients',
		sections: [
			{ id: 'ancients-before-transcending', title: 'Before transcending' },
			{ id: 'ancients-after-transcending', title: 'After transcending' }
		]
	},
	{
		id: 'transcending',
		title: 'Transcending',
		sections: [
			{ id: 'your-first-transcension', title: 'Your first transcension' },
			{ id: 'spending-rubies', title: 'Spending rubies' }
		]
	},
	{
		id: 'the-side-systems',
		title: 'The side systems',
		sections: [
			{ id: 'mercenaries', title: 'Mercenaries' },
			{ id: 'clans', title: 'Clans' },
			{ id: 'relics', title: 'Relics' }
		]
	},
	{
		id: 'after-this-guide',
		title: 'After this guide',
		sections: [{ id: 'where-to-go-next', title: 'Where to go next' }]
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

export const NewPlayerGuide: FC = () => (
	<article className='flex flex-col gap-10'>
		<div className='flex flex-col gap-6'>
			<p className='max-w-3xl text-[14px] leading-7 text-(--color-fg-secondary)'>
				Everything you need to get from a fresh save to your first transcension in Clicker Heroes 1.0e11. It
				assumes an idle build, which is the easiest way to start: gold keeps accruing while the game is
				closed. Once you have transcended and picked up a few in-game auto-clickers, a hybrid or active build
				will take you further.
			</p>
			<GuideIndex parts={parts} />
		</div>

		<GuidePart {...part('the-early-game')}>
			<GuideSection
				id='your-first-run'
				summary='The first play-through is the slowest one you will ever do. Get to zone 130 and reset.'
				title='Your first run'
			>
				<GuideList>
					<GuideListItem>
						Level each hero to their first upgrade at level 10, then move on to the next hero.
					</GuideListItem>
					<GuideListItem>
						Further down the roster, push to the level 25 upgrade before switching — and later, level 50.
					</GuideListItem>
					<GuideListItem>
						Go back and buy the{' '}
						<GuideLink href='https://clickerheroes.fandom.com/wiki/Upgrades'>all-hero DPS upgrades</GuideLink>{' '}
						whenever you can afford them.
					</GuideListItem>
					<GuideListItem>Do not level heroes past their last upgrade yet.</GuideListItem>
					<GuideListItem>Failed a boss? Farm gold on the previous zone until you can kill it.</GuideListItem>
					<GuideListItem>
						Expect long waits early on. Gold accumulates offline, so walking away for a while is a valid
						strategy.
					</GuideListItem>
					<GuideListItem>
						Fire every skill to punch through a boss wall, roughly every half hour.
					</GuideListItem>
					<GuideListItem>
						Zones 110, 120 and 130 are all primal bosses, so each one is guaranteed Hero Souls.
					</GuideListItem>
				</GuideList>
			</GuideSection>

			<GuideSection
				id='when-to-ascend'
				summary='Ascension is the main progression loop. Each reset should be faster than the last.'
				title='When to ascend'
			>
				<GuideList>
					<GuideListItem>
						The more Hero Souls you bank before ascending, the quicker the next run goes.
					</GuideListItem>
					<GuideListItem>
						Get at least to zone 130 before your first ascension — it is a guaranteed primal boss.
					</GuideListItem>
					<GuideListItem>Every 100th zone after that is also a guaranteed primal boss.</GuideListItem>
					<GuideListItem>
						Keep pushing until you hit a boss you cannot kill. If it is primal, farm gold and try again before
						giving up on it.
					</GuideListItem>
					<GuideListItem>
						Spend leftover gold on hero levels right before you reset: every 2,000 combined hero levels is one
						extra Hero Soul. This stops mattering later, but the souls are worth having now.
					</GuideListItem>
				</GuideList>
			</GuideSection>

			<GuideSection
				id='beyond-zone-130'
				summary='From your second run onward, the Power 5 carry you.'
				title='Beyond zone 130'
			>
				<GuideList>
					<GuideListItem>
						Back up your save regularly to cloud storage, or just email the text file to yourself. You can
						pull a copy out at any time with the <GuideLink href='/tools/save-editor'>save editor</GuideLink>.
					</GuideListItem>
					<GuideListItem>
						Level Frostleaf to 150, then go back to the top and level Treebeast, Ivan, Brittany, the Seer and
						the Masked Samurai — the &ldquo;Power 5&rdquo; — in multiples of 25.
					</GuideListItem>
					<GuideListItem>You can buy all remaining hero upgrades at this point too.</GuideListItem>
					<GuideListItem>
						Ignore Dread Knight. His cost-to-DPS ratio is terrible; what you actually want is the ×10 bonus
						for taking a hero to level 1000, and the Power 5 will serve for a long while.
					</GuideListItem>
					<GuideListItem>
						After a few ascensions you will clear the early zones just by buying 25 hero levels at a time.
					</GuideListItem>
					<GuideListItem>
						Random de-gilding into the Power 5 is optional. If you do it, spend no more than 10% of your Hero
						Souls on it — and before your first transcension, do not bother moving gilds at all.
					</GuideListItem>
				</GuideList>
			</GuideSection>
		</GuidePart>

		<GuidePart {...part('ancients')}>
			<GuideSection
				id='ancients-before-transcending'
				summary='Four ancients, kept level. Nothing else until you transcend.'
				title='Before transcending'
			>
				<GuideList>
					<GuideListItem>
						Idle is the build to start with, because gold accrues while the game is closed.
					</GuideListItem>
					<GuideListItem>
						Buy Siyalatas, Libertas, Mammon and Mimzee, and no others, until your first transcension.
					</GuideListItem>
					<GuideListItem>Keep all four at the same level, or as close to it as you can manage.</GuideListItem>
					<GuideListItem>
						Hold unspent Hero Souls equal to the square of their level — level 5 ancients means keeping 25
						Hero Souls spare.
					</GuideListItem>
				</GuideList>
			</GuideSection>

			<GuideSection
				id='ancients-after-transcending'
				summary='Buy order is a rough ranking by usefulness, not a rule.'
				title='After transcending'
			>
				<GuideList>
					<GuideListItem>
						Get an idle ancient or Juggernaut as early as you can in a new transcension, depending on whether
						you are running idle or active/hybrid.
					</GuideListItem>
					<GuideListItem>Buy first as idle: Libertas, Siyalatas, Nogardnit.</GuideListItem>
					<GuideListItem>Buy first as active or hybrid: Juggernaut, Bhaal, Fragsworth.</GuideListItem>
					<GuideListItem>Buy next: Atman, Kumawakamaru, then any gold ancients.</GuideListItem>
					<GuideListItem>
						Use &ldquo;Summon All Ancients&rdquo; once you can afford the remainder in one go.
					</GuideListItem>
					<GuideListItem>
						Only level Nogardnit if you have in-game auto-clickers. Without them he does nothing.
					</GuideListItem>
					<GuideListItem>
						Work out the actual levels with the{' '}
						<GuideLink href='/tools/ancients-calculator'>ancients calculator</GuideLink> — import your save
						and it returns optimal levels and costs for idle, hybrid or active.
					</GuideListItem>
				</GuideList>
			</GuideSection>
		</GuidePart>

		<GuidePart {...part('transcending')}>
			<GuideSection
				id='your-first-transcension'
				summary='Unlocks at zone 300. Do it immediately.'
				title='Your first transcension'
			>
				<GuideList>
					<GuideListItem>
						Transcendence is a second-tier reset that gets you moving again once ascensions stop producing
						meaningful gains.
					</GuideListItem>
					<GuideListItem>
						You give up ancients, relics, Hero Souls, zone gilds and zone progress.
					</GuideListItem>
					<GuideListItem>
						You keep Ancient Souls, rubies, outsiders, mercenaries, clan progress and any gilds bought with
						rubies.
					</GuideListItem>
					<GuideListItem>
						Ancient Souls are spent on the nine outsiders — meta-ancients, each with a different bonus, and
						respeccable for free every transcension.
					</GuideListItem>
					<GuideListItem>
						You also gain Transcendent Power, which exponentially increases the Hero Souls you get from primal
						bosses. That is why it is not worth grinding before your first transcension: take it at zone 300
						and earn the souls back faster afterwards.
					</GuideListItem>
					<GuideListItem>
						To judge later transcensions, watch how fast your Hero Souls per ascension are growing. When the
						order of magnitude stops climbing, it is time to reset. The{' '}
						<GuideLink href='/tools/transcension-viewer'>transcension viewer</GuideLink> shows that history
						straight from your save.
					</GuideListItem>
				</GuideList>
			</GuideSection>

			<GuideSection
				id='spending-rubies'
				summary='Auto-clickers first, permanent damage second, everything else later.'
				title='Spending rubies'
			>
				<GuideList>
					<GuideListItem>
						Start with one or two auto-clickers, then the permanent double damage upgrade.
					</GuideListItem>
					<GuideListItem>
						Keep a small reserve for reviving mercenaries while it is still cheap.
					</GuideListItem>
					<GuideListItem>
						Quick Ascension is no longer needed at the start of a new transcension, thanks to the outsider
						Phandoryss.
					</GuideListItem>
					<GuideListItem>
						More auto-clickers come next; they scale exponentially once you have five.
					</GuideListItem>
					<GuideListItem>
						Timelapse becomes important tens of thousands of zones in. Use it at the start of a long
						ascension, with your gilds stacked and long ruby merc quests running.
					</GuideListItem>
					<GuideListItem>
						Do not spend rubies on recruiting mercenaries, gilds, relics, or extra raid boss fights. None of
						them are worth it.
					</GuideListItem>
				</GuideList>
			</GuideSection>
		</GuidePart>

		<GuidePart {...part('the-side-systems')}>
			<GuideSection
				id='mercenaries'
				summary='Free progress if you keep them questing. Ruby quests are the ones that matter.'
				title='Mercenaries'
			>
				<GuideList>
					<GuideListItem>
						Every mercenary has a predetermined time until death, and only time spent on quests counts against
						it.
					</GuideListItem>
					<GuideListItem>
						Quest rewards are multiplied by mercenary level, and 24 hours of quest time is one level.
					</GuideListItem>
					<GuideListItem>
						Revive them while it is cheap. Past level 11 or 12 the cost usually is not worth it.
					</GuideListItem>
					<GuideListItem>
						Short quests pay better per minute; long quests need less babysitting but risk a high-level merc
						dying mid-quest.
					</GuideListItem>
					<GuideListItem>
						Ruby quests are the best. Hero Soul, gold, relic and skill quests are situational at best.
					</GuideListItem>
					<GuideListItem>
						Mercenary quality is pure RNG. Questing the ones you have beats cycling through hoping for better.
					</GuideListItem>
				</GuideList>
			</GuideSection>

			<GuideSection id='clans' summary='A daily raid boss, and free Hero Souls for showing up.' title='Clans'>
				<GuideList>
					<GuideListItem>Fight a daily raid boss with up to nine other clan-mates.</GuideListItem>
					<GuideListItem>
						The minimum reward is 4 Hero Souls, and it scales up as you kill primal bosses.
					</GuideListItem>
					<GuideListItem>
						Join a clan of players at a similar stage. The{' '}
						<GuideLink href='https://www.reddit.com/r/ClickerHeroesRecruit'>
							r/ClickerHeroesRecruit subreddit
						</GuideLink>{' '}
						is the usual place to find one.
					</GuideListItem>
				</GuideList>
			</GuideSection>

			<GuideSection id='relics' summary='Helpful early, irrelevant soon after.' title='Relics'>
				<GuideList>
					<GuideListItem>
						Every relic stat is eventually dwarfed by ancient levels, but they help in the early game.
					</GuideListItem>
					<GuideListItem>Kumawakamaru is the best stat overall. Atman and Revolc are fine too.</GuideListItem>
					<GuideListItem>
						On active or hybrid builds without infinite skill uptime, a good Sniperino or Klepto relic extends
						Lucky Strikes and Golden Clicks.
					</GuideListItem>
				</GuideList>
			</GuideSection>
		</GuidePart>

		<GuidePart {...part('after-this-guide')}>
			<GuideSection
				id='where-to-go-next'
				summary='Tools and references for once you are past your first transcension.'
				title='Where to go next'
			>
				<GuideList>
					<GuideListItem>
						<GuideLink href='/tools/ancients-calculator'>Ancients calculator</GuideLink> — optimal ancient
						levels and costs from your own save.
					</GuideListItem>
					<GuideListItem>
						<GuideLink href='/tools/transcension-viewer'>Transcension viewer</GuideLink> — track Hero Soul and
						Ancient Soul gains per ascension to time your next transcension.
					</GuideListItem>
					<GuideListItem>
						<GuideLink href='/tools/instakill-calculator'>Instakill calculator</GuideLink> — zones per hour
						and monsters per zone once Kumawakamaru and Borb start mattering.
					</GuideListItem>
					<GuideListItem>
						<GuideLink href='https://www.reddit.com/r/ClickerHeroes/comments/7dvpi2/hero_gilding_chart_for_clicker_heroes_10e10/'>
							Hero gilding chart
						</GuideLink>{' '}
						— which hero to move your gilds to, and when.
					</GuideListItem>
					<GuideListItem>
						<GuideLink href='https://www.reddit.com/r/ClickerHeroes/comments/7on5it/outsiders_calculator_web_app_version/'>
							Outsiders calculator
						</GuideLink>{' '}
						— how to spend Ancient Souls after transcending.
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
