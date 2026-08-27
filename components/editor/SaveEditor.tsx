'use client';

import { useRef } from 'react';
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
import { cn } from '@/lib/cn';
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
			<Breadcrumb subtitle='Save Editor' title='tools' />

			<SaveDataPanel hasEditStep onLoadSuccess={scrollToStep2} />

			<div className={cn(!hasSave && 'pointer-events-none opacity-40 select-none')} inert={!hasSave}>
				<div ref={step2Ref} className='mt-5 mb-10 flex scroll-mt-8 flex-row items-center gap-3'>
					<Pill isShining={activeStep === 2}>Step 2</Pill>
					<CardTitle title={'Edit your save data'} className='pt-1' />
				</div>
				<div className='flex flex-col gap-5'>
					<SimpleFieldsSection title='Shop Items' icon={StoreIcon} fields={shopItemFields} />

					<SimpleFieldsSection
						defaultOpen
						icon={CandyCaneIcon}
						fields={seasonalItemFields}
						title='Seasonal Items'
					/>

					<SkinsSection defaultOpen showToast={showToast} icon={PointerIcon} />

					<SimpleFieldsSection
						defaultOpen
						icon={CircleDollarSign}
						fields={zoneItemFields}
						title='Zone Items'
					/>

					<HeroesSection icon={UsersIcon} title='Heroes' />

					<AchievementsSection icon={TrophyIcon} title='Achievements' />

					<TranscensionsSection icon={SparklesIcon} showToast={showToast} />

					<SimpleFieldsSection
						description='Raid classes map to 0 = None, 1 = Rogue, 2 = Mage, 3 = Priest.'
						fields={clanFields}
						icon={ShieldIcon}
						title='Clan Values'
					/>

					<MercenariesSection icon={SwordsIcon} />

					<OutsidersSection icon={GhostIcon} />

					<CustomFieldSection icon={SearchIcon} />
				</div>
			</div>
		</>
	);
};
