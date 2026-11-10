'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { SaveDataPanel } from '@/components/editor/SaveDataPanel';
import { AchievementsSection } from '@/components/editor/sections/AchievementsSection';
import { CustomFieldSection } from '@/components/editor/sections/CustomFieldSection';
import { FeedbackSection } from '@/components/editor/sections/FeedbackSection';
import { HeroesSection } from '@/components/editor/sections/HeroesSection';
import { MercenariesSection } from '@/components/editor/sections/MercenariesSection';
import { OutsidersSection } from '@/components/editor/sections/OutsidersSection';
import { SimpleFieldsSection } from '@/components/editor/sections/SimpleFieldsSection';
import { SkinsSection } from '@/components/editor/sections/SkinsSection';
import { TranscensionsSection } from '@/components/editor/sections/TranscensionsSection';
import { useToast } from '@/components/ui/ToastProvider';
import { clanFields } from '@/lib/data/editor-config';
import { seasonalItemFields } from '@/lib/data/seasonalItems';
import { shopItemFields } from '@/lib/data/shopItems';
import { zoneItemFields } from '@/lib/data/zoneItems';
import { useSaveFlowStep } from '@/lib/save-flow';
import { useSaveStore } from '@/lib/save-store';
import { Breadcrumb } from '../home/Breadcrumb';
import { cn } from 'cn';
import { Pill } from '../ui/Pill';
import {
	CandyCaneIcon,
	CircleDollarSign,
	GhostIcon,
	MessageSquareIcon,
	PointerIcon,
	SearchIcon,
	ShieldIcon,
	SparklesIcon,
	StoreIcon,
	SwordsIcon,
	TrophyIcon,
	UsersIcon
} from 'lucide-react';
import { CardTitle } from '../ui/LinkCard';

export const SaveEditor = () => {
	const { showToast } = useToast();
	const t = useTranslations('editor.saveEditor');
	const tCommon = useTranslations('common.ui');
	const hasSave = useSaveStore((state) => state.saveData !== null);
	const activeStep = useSaveFlowStep({ hasEditStep: true });
	const step2Ref = useRef<HTMLDivElement>(null);

	const scrollToStep2 = () => {
		if (step2Ref.current) {
			step2Ref.current.scrollIntoView({ behavior: 'smooth' });
		}
	};

	return (
		<>
			<Breadcrumb page='saveEditor' title='tools' />

			<SaveDataPanel hasEditStep onLoadSuccess={scrollToStep2} />

			<div className={cn(!hasSave && 'pointer-events-none opacity-40 select-none')} inert={!hasSave}>
				<div ref={step2Ref} className='mt-5 mb-10 flex scroll-mt-8 flex-row items-center gap-3'>
					<Pill isShining={activeStep === 2}>{tCommon('step', { number: 2 })}</Pill>
					<CardTitle title={t('editTitle')} className='pt-1' />
				</div>
				<div className='flex flex-col gap-5'>
					<SimpleFieldsSection
						anchor='shop-items'
						title={t('sections.shopItems')}
						icon={StoreIcon}
						fields={shopItemFields}
					/>

					<SimpleFieldsSection
						anchor='seasonal-items'
						defaultOpen
						icon={CandyCaneIcon}
						fields={seasonalItemFields}
						title={t('sections.seasonalItems')}
					/>

					<SkinsSection anchor='skins' defaultOpen showToast={showToast} icon={PointerIcon} />

					<SimpleFieldsSection
						anchor='zone-items'
						defaultOpen
						icon={CircleDollarSign}
						fields={zoneItemFields}
						title={t('sections.zoneItems')}
					/>

					<HeroesSection anchor='heroes' icon={UsersIcon} title={t('sections.heroes')} />

					<AchievementsSection anchor='achievements' icon={TrophyIcon} title={t('sections.achievements')} />

					<TranscensionsSection anchor='transcensions' icon={SparklesIcon} showToast={showToast} />

					<SimpleFieldsSection
						anchor='clan'
						description={t('clanDescription')}
						fields={clanFields}
						icon={ShieldIcon}
						title={t('sections.clanValues')}
					/>

					<MercenariesSection anchor='mercenaries' icon={SwordsIcon} />

					<OutsidersSection anchor='outsiders' icon={GhostIcon} />

					<CustomFieldSection anchor='custom-field' icon={SearchIcon} />
				</div>
			</div>
		</>
	);
};
