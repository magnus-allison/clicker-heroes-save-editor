import { type FC, type ReactNode } from 'react';
import { type Messages, useTranslations } from 'next-intl';

import { GuideIndex, type GuideIndexPart } from '@/components/guides/GuideIndex';
import { GuideLink } from '@/components/guides/GuideLink';
import { GuideList, GuideListItem } from '@/components/guides/GuideList';
import { GuidePart } from '@/components/guides/GuidePart';
import { GuideSection } from '@/components/guides/GuideSection';

type Sections = Messages['guides']['progressTips']['sections'];
type SectionKey = keyof Sections;

/** Every list item key, e.g. `sections.ascend.items.1`. */
type ItemKey = {
	[K in SectionKey]: `sections.${K}.items.${keyof Sections[K]['items'] & string}`;
}[SectionKey];

/** A section's `items` may only name items that exist in its messages. */
type SectionSpec = {
	[K in SectionKey]: { id: string; key: K; items: readonly (keyof Sections[K]['items'])[] };
}[SectionKey];

/*
 * Structure only: ids are URL anchors and stay English; every title, summary
 * and list item comes from `guides.progressTips` in the messages.
 */
const structure = [
	{
		id: 'resets',
		key: 'resets',
		sections: [
			{ id: 'ascend-early-and-often', key: 'ascend', items: ['1', '2', '3', '4'] },
			{ id: 'transcend-on-time', key: 'transcend', items: ['1', '2', '3', '4'] }
		]
	},
	{
		id: 'heroes',
		key: 'heroes',
		sections: [
			{ id: 'push-your-newest-hero', key: 'newestHero', items: ['1', '2', '3', '4'] },
			{ id: 'keep-gilds-on-one-hero', key: 'gilds', items: ['1', '2', '3', '4'] }
		]
	},
	{
		id: 'souls',
		key: 'souls',
		sections: [
			{ id: 'commit-to-a-build', key: 'build', items: ['1', '2', '3', '4'] },
			{ id: 'let-the-calculators-do-the-maths', key: 'calculators', items: ['1', '2', '3'] }
		]
	},
	{
		id: 'skills-and-rubies',
		key: 'skillsAndRubies',
		sections: [
			{ id: 'chain-your-skills', key: 'skills', items: ['1', '2', '3', '4'] },
			{ id: 'spend-rubies-on-auto-clickers', key: 'rubies', items: ['1', '2', '3', '4'] }
		]
	},
	{
		id: 'everything-else',
		key: 'everythingElse',
		sections: [
			{ id: 'use-the-side-systems', key: 'sideSystems', items: ['1', '2', '3'] },
			{ id: 'break-through-walls', key: 'walls', items: ['1', '2', '3', '4', '5'] },
			{ id: 'where-to-go-next', key: 'whereNext', items: ['1', '2', '3', '4'] }
		]
	}
] as const satisfies readonly {
	id: string;
	key: keyof Messages['guides']['progressTips']['parts'];
	sections: readonly SectionSpec[];
}[];

type Section = (typeof structure)[number]['sections'][number];

/** Each `<tag>` in the prose maps to one destination, so translations never carry URLs. */
const link = (href: string) => (chunks: ReactNode) => <GuideLink href={href}>{chunks}</GuideLink>;

const links = {
	newPlayerGuide: link('/guides/new-player-guide'),
	gildingChart: link('/guides/gilding-chart'),
	rubySection: link('/guides/new-player-guide#spending-rubies'),
	transcensionViewer: link('/tools/transcension-viewer'),
	outsidersCalculator: link('/tools/outsiders-calculator'),
	ancientsCalculator: link('/tools/ancients-calculator'),
	mercenaryViewer: link('/tools/mercenary-viewer'),
	instakillCalculator: link('/tools/instakill-calculator'),
	blog: link('https://blog.clickerheroes.com/top-10-clicker-tips-to-speed-up-progress-in-clicker-heroes/'),
	subreddit: link('https://www.reddit.com/r/ClickerHeroes/')
};

export const ProgressTipsGuide: FC = () => {
	const t = useTranslations('guides.progressTips');

	const parts = structure.map((part) => ({
		id: part.id,
		title: t(`parts.${part.key}`),
		sections: part.sections.map((section) => ({ id: section.id, title: t(`sections.${section.key}.title`) }))
	})) satisfies GuideIndexPart[];

	const renderSection = ({ id, items, key }: Section) => (
		<GuideSection id={id} key={id} summary={t(`sections.${key}.summary`)} title={t(`sections.${key}.title`)}>
			<GuideList>
				{items.map((item) => (
					<GuideListItem key={item}>
						{t.rich(`sections.${key}.items.${item}` as ItemKey, links)}
					</GuideListItem>
				))}
			</GuideList>
		</GuideSection>
	);

	return (
		<article className='flex flex-col gap-10'>
			<div className='flex flex-col gap-6'>
				<p className='max-w-3xl text-[14px] leading-7 text-(--color-fg-secondary)'>
					{t.rich('intro', links)}
				</p>
				<GuideIndex parts={parts} />
			</div>

			{structure.map((part, index) => (
				<GuidePart id={part.id} index={index + 1} key={part.id} title={t(`parts.${part.key}`)}>
					{part.sections.map(renderSection)}
				</GuidePart>
			))}
		</article>
	);
};
