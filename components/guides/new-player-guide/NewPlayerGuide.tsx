import { useTranslations } from 'next-intl';
import { type FC, type ReactNode } from 'react';

import type { GuideIndexPart } from '@/components/guides/GuideContents';
import { GuideLayout } from '@/components/guides/GuideLayout';
import { GuideLink } from '@/components/guides/GuideLink';
import { GuideList, GuideListItem } from '@/components/guides/GuideList';
import { GuidePart } from '@/components/guides/GuidePart';
import { GuideSection } from '@/components/guides/GuideSection';

/*
 * Structure only: `id`s are URL anchors and stay English; every title lives in
 * `messages/<locale>/newPlayerGuide.json` under the matching `key`.
 */
const parts = [
	{
		id: 'the-early-game',
		key: 'theEarlyGame',
		sections: [
			{ id: 'your-first-run', key: 'yourFirstRun' },
			{ id: 'when-to-ascend', key: 'whenToAscend' },
			{ id: 'beyond-zone-130', key: 'beyondZone130' }
		]
	},
	{
		id: 'ancients',
		key: 'ancients',
		sections: [
			{ id: 'ancients-before-transcending', key: 'ancientsBeforeTranscending' },
			{ id: 'ancients-after-transcending', key: 'ancientsAfterTranscending' }
		]
	},
	{
		id: 'transcending',
		key: 'transcending',
		sections: [
			{ id: 'your-first-transcension', key: 'yourFirstTranscension' },
			{ id: 'spending-rubies', key: 'spendingRubies' }
		]
	},
	{
		id: 'the-side-systems',
		key: 'theSideSystems',
		sections: [
			{ id: 'mercenaries', key: 'mercenaries' },
			{ id: 'clans', key: 'clans' },
			{ id: 'relics', key: 'relics' }
		]
	},
	{
		id: 'after-this-guide',
		key: 'afterThisGuide',
		sections: [{ id: 'where-to-go-next', key: 'whereToGoNext' }]
	}
] as const;

type Part = (typeof parts)[number];
type PartKey = Part['key'];
type SectionKey = Part['sections'][number]['key'];

/** Rich-text handler for a message's single `<link>` tag; the href stays in code. */
const link = (href: string) => ({
	link: (chunks: ReactNode) => <GuideLink href={href}>{chunks}</GuideLink>
});

export const NewPlayerGuide: FC = () => {
	const t = useTranslations('newPlayerGuide');

	const index: GuideIndexPart[] = parts.map((candidate) => ({
		id: candidate.id,
		title: t(`parts.${candidate.key}`),
		sections: candidate.sections.map((section) => ({
			id: section.id,
			title: t(`sections.${section.key}.title`)
		}))
	}));

	/** Pulls a part's heading props from `parts` so the contents can never drift. */
	const part = (key: PartKey) => {
		const position = parts.findIndex((candidate) => candidate.key === key);
		const match = parts[position];

		if (!match) throw new Error(`Unknown guide part: ${key}`);

		return { id: match.id, index: position + 1, title: t(`parts.${key}`) };
	};

	const section = (key: SectionKey) => {
		const match = parts
			.flatMap((candidate): readonly Part['sections'][number][] => candidate.sections)
			.find((candidate) => candidate.key === key);

		if (!match) throw new Error(`Unknown guide section: ${key}`);

		return { id: match.id, summary: t(`sections.${key}.summary`), title: t(`sections.${key}.title`) };
	};

	return (
		<GuideLayout intro={t('intro')} parts={index}>
			<GuidePart {...part('theEarlyGame')}>
				<GuideSection {...section('yourFirstRun')}>
					<GuideList>
						<GuideListItem>{t('sections.yourFirstRun.items.firstUpgrade')}</GuideListItem>
						<GuideListItem>{t('sections.yourFirstRun.items.laterUpgrades')}</GuideListItem>
						<GuideListItem>
							{t.rich(
								'sections.yourFirstRun.items.allHeroUpgrades',
								link('https://clickerheroes.fandom.com/wiki/Upgrades')
							)}
						</GuideListItem>
						<GuideListItem>{t('sections.yourFirstRun.items.lastUpgrade')}</GuideListItem>
						<GuideListItem>{t('sections.yourFirstRun.items.failedBoss')}</GuideListItem>
						<GuideListItem>{t('sections.yourFirstRun.items.longWaits')}</GuideListItem>
						<GuideListItem>{t('sections.yourFirstRun.items.skills')}</GuideListItem>
						<GuideListItem>{t('sections.yourFirstRun.items.primalBosses')}</GuideListItem>
					</GuideList>
				</GuideSection>

				<GuideSection {...section('whenToAscend')}>
					<GuideList>
						<GuideListItem>{t('sections.whenToAscend.items.moreSouls')}</GuideListItem>
						<GuideListItem>{t('sections.whenToAscend.items.zone130')}</GuideListItem>
						<GuideListItem>{t('sections.whenToAscend.items.every100th')}</GuideListItem>
						<GuideListItem>{t('sections.whenToAscend.items.keepPushing')}</GuideListItem>
						<GuideListItem>{t('sections.whenToAscend.items.spendGold')}</GuideListItem>
					</GuideList>
				</GuideSection>

				<GuideSection {...section('beyondZone130')}>
					<GuideList>
						<GuideListItem>
							{t.rich('sections.beyondZone130.items.backUp', link('/tools/save-editor'))}
						</GuideListItem>
						<GuideListItem>{t('sections.beyondZone130.items.power5')}</GuideListItem>
						<GuideListItem>{t('sections.beyondZone130.items.remainingUpgrades')}</GuideListItem>
						<GuideListItem>{t('sections.beyondZone130.items.dreadKnight')}</GuideListItem>
						<GuideListItem>{t('sections.beyondZone130.items.buy25')}</GuideListItem>
						<GuideListItem>{t('sections.beyondZone130.items.deGilding')}</GuideListItem>
					</GuideList>
				</GuideSection>
			</GuidePart>

			<GuidePart {...part('ancients')}>
				<GuideSection {...section('ancientsBeforeTranscending')}>
					<GuideList>
						<GuideListItem>{t('sections.ancientsBeforeTranscending.items.idleFirst')}</GuideListItem>
						<GuideListItem>{t('sections.ancientsBeforeTranscending.items.buyFour')}</GuideListItem>
						<GuideListItem>{t('sections.ancientsBeforeTranscending.items.keepLevel')}</GuideListItem>
						<GuideListItem>{t('sections.ancientsBeforeTranscending.items.spareSouls')}</GuideListItem>
					</GuideList>
				</GuideSection>

				<GuideSection {...section('ancientsAfterTranscending')}>
					<GuideList>
						<GuideListItem>{t('sections.ancientsAfterTranscending.items.earlyPick')}</GuideListItem>
						<GuideListItem>{t('sections.ancientsAfterTranscending.items.idleOrder')}</GuideListItem>
						<GuideListItem>{t('sections.ancientsAfterTranscending.items.activeOrder')}</GuideListItem>
						<GuideListItem>{t('sections.ancientsAfterTranscending.items.next')}</GuideListItem>
						<GuideListItem>{t('sections.ancientsAfterTranscending.items.summonAll')}</GuideListItem>
						<GuideListItem>{t('sections.ancientsAfterTranscending.items.nogardnit')}</GuideListItem>
						<GuideListItem>
							{t.rich(
								'sections.ancientsAfterTranscending.items.calculator',
								link('/tools/ancients-calculator')
							)}
						</GuideListItem>
					</GuideList>
				</GuideSection>
			</GuidePart>

			<GuidePart {...part('transcending')}>
				<GuideSection {...section('yourFirstTranscension')}>
					<GuideList>
						<GuideListItem>{t('sections.yourFirstTranscension.items.what')}</GuideListItem>
						<GuideListItem>{t('sections.yourFirstTranscension.items.lose')}</GuideListItem>
						<GuideListItem>{t('sections.yourFirstTranscension.items.keep')}</GuideListItem>
						<GuideListItem>{t('sections.yourFirstTranscension.items.outsiders')}</GuideListItem>
						<GuideListItem>{t('sections.yourFirstTranscension.items.transcendentPower')}</GuideListItem>
						<GuideListItem>
							{t.rich('sections.yourFirstTranscension.items.timing', link('/tools/transcension-viewer'))}
						</GuideListItem>
					</GuideList>
				</GuideSection>

				<GuideSection {...section('spendingRubies')}>
					<GuideList>
						<GuideListItem>{t('sections.spendingRubies.items.autoClickers')}</GuideListItem>
						<GuideListItem>{t('sections.spendingRubies.items.reserve')}</GuideListItem>
						<GuideListItem>{t('sections.spendingRubies.items.quickAscension')}</GuideListItem>
						<GuideListItem>{t('sections.spendingRubies.items.moreAutoClickers')}</GuideListItem>
						<GuideListItem>{t('sections.spendingRubies.items.timelapse')}</GuideListItem>
						<GuideListItem>{t('sections.spendingRubies.items.avoid')}</GuideListItem>
					</GuideList>
				</GuideSection>
			</GuidePart>

			<GuidePart {...part('theSideSystems')}>
				<GuideSection {...section('mercenaries')}>
					<GuideList>
						<GuideListItem>{t('sections.mercenaries.items.lifespan')}</GuideListItem>
						<GuideListItem>{t('sections.mercenaries.items.rewards')}</GuideListItem>
						<GuideListItem>{t('sections.mercenaries.items.revive')}</GuideListItem>
						<GuideListItem>{t('sections.mercenaries.items.questLength')}</GuideListItem>
						<GuideListItem>{t('sections.mercenaries.items.rubyQuests')}</GuideListItem>
						<GuideListItem>{t('sections.mercenaries.items.quality')}</GuideListItem>
					</GuideList>
				</GuideSection>

				<GuideSection {...section('clans')}>
					<GuideList>
						<GuideListItem>{t('sections.clans.items.raid')}</GuideListItem>
						<GuideListItem>{t('sections.clans.items.reward')}</GuideListItem>
						<GuideListItem>
							{t.rich('sections.clans.items.join', link('https://www.reddit.com/r/ClickerHeroesRecruit'))}
						</GuideListItem>
					</GuideList>
				</GuideSection>

				<GuideSection {...section('relics')}>
					<GuideList>
						<GuideListItem>{t('sections.relics.items.dwarfed')}</GuideListItem>
						<GuideListItem>{t('sections.relics.items.bestStats')}</GuideListItem>
						<GuideListItem>{t('sections.relics.items.activeBuilds')}</GuideListItem>
					</GuideList>
				</GuideSection>
			</GuidePart>

			<GuidePart {...part('afterThisGuide')}>
				<GuideSection {...section('whereToGoNext')}>
					<GuideList>
						<GuideListItem>
							{t.rich('sections.whereToGoNext.items.ancientsCalculator', link('/tools/ancients-calculator'))}
						</GuideListItem>
						<GuideListItem>
							{t.rich('sections.whereToGoNext.items.transcensionViewer', link('/tools/transcension-viewer'))}
						</GuideListItem>
						<GuideListItem>
							{t.rich(
								'sections.whereToGoNext.items.instakillCalculator',
								link('/tools/instakill-calculator')
							)}
						</GuideListItem>
						<GuideListItem>
							{t.rich('sections.whereToGoNext.items.gildingChart', link('/guides/gilding-chart'))}
						</GuideListItem>
						<GuideListItem>
							{t.rich(
								'sections.whereToGoNext.items.outsidersCalculator',
								link(
									'https://www.reddit.com/r/ClickerHeroes/comments/7on5it/outsiders_calculator_web_app_version/'
								)
							)}
						</GuideListItem>
						<GuideListItem>
							{t.rich(
								'sections.whereToGoNext.items.community',
								link('https://www.reddit.com/r/ClickerHeroes/')
							)}
						</GuideListItem>
					</GuideList>
				</GuideSection>
			</GuidePart>
		</GuideLayout>
	);
};
