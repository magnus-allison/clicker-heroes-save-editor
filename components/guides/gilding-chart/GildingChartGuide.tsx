import { type FC, type ReactNode } from 'react';
import { type Messages, useLocale, useTranslations } from 'next-intl';

import { GildingLookup } from '@/components/guides/gilding-chart/GildingLookup';
import { GildingTable, useGildingPhaseRange } from '@/components/guides/gilding-chart/GildingTable';
import type { GuideIndexPart } from '@/components/guides/GuideContents';
import { GuideLayout } from '@/components/guides/GuideLayout';
import { GuideLink } from '@/components/guides/GuideLink';
import { GuideList, GuideListItem } from '@/components/guides/GuideList';
import { GuidePart } from '@/components/guides/GuidePart';
import { GuideSection } from '@/components/guides/GuideSection';
import { gildingPhases } from '@/lib/gilding-chart';
import { gildingChartFaqs } from '@/lib/seo';

type Sections = Messages['guides']['gildingChart']['sections'];
type SectionKey = keyof Sections;

/** Sections whose body is a plain list of translated items. */
type ListSectionKey = { [K in SectionKey]: Sections[K] extends { items: object } ? K : never }[SectionKey];

/** Every list item key, e.g. `sections.whatAGildDoes.items.1`. */
type ItemKey = {
	[K in ListSectionKey]: `sections.${K}.items.${keyof Sections[K]['items'] & string}`;
}[ListSectionKey];

/*
 * Structure only: ids are URL anchors and stay English; titles come from
 * `guides.gildingChart` in the messages.
 */
const structure = [
	{ id: 'find-your-hero', key: 'findYourHero', sections: [{ id: 'gold-lookup', key: 'goldLookup' }] },
	{
		id: 'how-gilding-works',
		key: 'howGildingWorks',
		sections: [
			{ id: 'what-a-gild-does', key: 'whatAGildDoes' },
			{ id: 'when-to-regild', key: 'whenToRegild' },
			{ id: 'ascending-and-transcending', key: 'ascendingAndTranscending' }
		]
	},
	{
		id: 'reading-the-chart',
		key: 'readingTheChart',
		sections: [
			{ id: 'the-columns', key: 'theColumns' },
			{ id: 'skipping-rows', key: 'skippingRows' },
			{ id: 'the-phases', key: 'thePhases' }
		]
	},
	{ id: 'the-chart', key: 'theChart', sections: [{ id: 'full-chart', key: 'fullChart' }] },
	{ id: 'common-questions', key: 'commonQuestions', sections: [{ id: 'faq', key: 'faq' }] }
] as const satisfies readonly {
	id: string;
	key: keyof Messages['guides']['gildingChart']['parts'];
	sections: readonly { id: string; key: SectionKey }[];
}[];

type PartId = (typeof structure)[number]['id'];
type SectionId = (typeof structure)[number]['sections'][number]['id'];

const sectionKey = (id: SectionId): SectionKey => {
	for (const part of structure) {
		for (const section of part.sections) {
			if (section.id === id) return section.key;
		}
	}

	throw new Error(`Unknown guide section: ${id}`);
};

const link = (href: string) => (chunks: ReactNode) => <GuideLink href={href}>{chunks}</GuideLink>;

/** Tags the prose may use. Each link tag maps to one destination, so translations never carry URLs. */
const richTags = {
	newPlayerGuide: link('/guides/new-player-guide'),
	ancientsCalculator: link('/tools/ancients-calculator'),
	transcensionViewer: link('/tools/transcension-viewer'),
	strong: (chunks: ReactNode) => <span className='font-medium text-fg-strong'>{chunks}</span>
};

export const GildingChartGuide: FC = () => {
	const t = useTranslations('guides.gildingChart');
	const tUi = useTranslations('guidesUi.gildingChart');
	const locale = useLocale();
	const phaseRange = useGildingPhaseRange();

	const parts = structure.map((part) => ({
		id: part.id,
		title: t(`parts.${part.key}`),
		sections: part.sections.map((section) => ({ id: section.id, title: t(`sections.${section.key}.title`) }))
	})) satisfies GuideIndexPart[];

	/** Heading props for a part, pulled from `structure` so the contents can never drift. */
	const part = (id: PartId) => {
		const index = structure.findIndex((candidate) => candidate.id === id);

		return { id, index: index + 1, title: parts[index]!.title };
	};

	const section = (id: SectionId, children: ReactNode) => {
		const key = sectionKey(id);

		return (
			<GuideSection id={id} summary={t(`sections.${key}.summary`)} title={t(`sections.${key}.title`)}>
				{children}
			</GuideSection>
		);
	};

	const list = <K extends ListSectionKey>(
		key: K,
		items: readonly (keyof Sections[K]['items'] & string)[]
	) => (
		<GuideList>
			{items.map((item) => (
				<GuideListItem key={item}>
					{t.rich(`sections.${key}.items.${item}` as ItemKey, richTags)}
				</GuideListItem>
			))}
		</GuideList>
	);

	return (
		<GuideLayout intro={t('intro')} parts={parts}>
			<GuidePart {...part('find-your-hero')}>{section('gold-lookup', <GildingLookup />)}</GuidePart>

			<GuidePart {...part('how-gilding-works')}>
				{section('what-a-gild-does', list('whatAGildDoes', ['1', '2', '3', '4']))}
				{section('when-to-regild', list('whenToRegild', ['1', '2', '3']))}
				{section('ascending-and-transcending', list('ascendingAndTranscending', ['1', '2', '3', '4']))}
			</GuidePart>

			<GuidePart {...part('reading-the-chart')}>
				{section('the-columns', list('theColumns', ['1', '2', '3', '4']))}
				{section('skipping-rows', list('skippingRows', ['1', '2', '3']))}
				{section(
					'the-phases',
					<div className='grid gap-3 sm:grid-cols-2'>
						{gildingPhases.map((phase) => (
							<div
								className='rounded-(--radius-card) border border-(--color-line-subtle) bg-(--color-surface-muted) p-4'
								key={phase.id}
							>
								<p className='flex items-baseline gap-2 font-aeonik text-[13px] font-semibold uppercase tracking-[0.06em] text-fg-strong [word-spacing:0.12em]'>
									<span
										aria-hidden='true'
										className='font-mono font-normal tracking-normal text-(--color-fg-dim)'
									>
										{String(phase.id).padStart(2, '0')}
									</span>
									{tUi(`phases.${phase.id}`)}
								</p>
								<p className='mt-1.5 text-[13px] leading-6 text-(--color-fg-muted)'>
									{t(`phaseSummaries.${phase.id}`)}
								</p>
								<p className='mt-3 inline-flex rounded-full border border-(--color-gilded-line) bg-(--color-gilded-surface) px-2.5 py-0.5 font-mono text-[11px] text-(--color-gold)'>
									{phaseRange(phase)}
								</p>
							</div>
						))}
					</div>
				)}
			</GuidePart>

			<GuidePart {...part('the-chart')}>
				{section(
					'full-chart',
					// Bleeds to the panel's edges: the chart is the widest thing in any guide.
					<div className='-mx-5 sm:-mx-7'>
						<GildingTable />
					</div>
				)}
			</GuidePart>

			<GuidePart {...part('common-questions')}>
				{section(
					'faq',
					<dl className='flex max-w-3xl flex-col gap-3'>
						{gildingChartFaqs(locale).map((faq) => (
							<div
								className='rounded-(--radius-card) border border-(--color-line-subtle) bg-(--color-surface-muted)/50 px-4 py-3.5'
								key={faq.question}
							>
								<dt className='font-aeonik text-[0.95rem] font-semibold leading-snug text-fg-strong'>
									{faq.question}
								</dt>
								<dd className='mt-1.5 text-[13px] leading-6 text-(--color-fg-secondary)'>{faq.answer}</dd>
							</div>
						))}
					</dl>
				)}
			</GuidePart>
		</GuideLayout>
	);
};
