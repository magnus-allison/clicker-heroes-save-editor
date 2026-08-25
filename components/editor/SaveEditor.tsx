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
import { PanelSection } from '../ui/PanelSection';
import { StepTitle } from '../ui/StepTitle';
import { useSaveFlowStep } from '@/lib/save-flow';
import { useSaveStore } from '@/lib/save-store';
import { Breadcrumb, homeCrumb } from '../home/Breadcrumb';
import { cn } from '@/lib/cn';
import { Pill } from '../ui/Pill';

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
			<Breadcrumb items={[homeCrumb, { label: 'Tools' }, { label: 'Save Editor' }]} />

			<SaveDataPanel hasEditStep onLoadSuccess={scrollToStep2} />

			<div className={cn(!hasSave && 'pointer-events-none opacity-40 select-none')} inert={!hasSave}>
				<div ref={step2Ref} className='mt-5 mb-10 flex flex-row items-center gap-3'>
					<Pill isShining={activeStep === 2}>Step 2</Pill>
					<span className='block text-[1.1rem] font-medium uppercase text-fg-strong'>
						Edit your save data
					</span>
				</div>
				<PanelSection>
					<SimpleFieldsSection
						defaultOpen
						description='Core currencies and ruby-shop purchases.'
						fields={shopItemFields}
						title='Shop Items'
					/>

					<SimpleFieldsSection
						defaultOpen
						description='Limited-time event items and currencies.'
						fields={seasonalItemFields}
						title='Seasonal Items'
					/>

					<SkinsSection defaultOpen showToast={showToast} />

					<SimpleFieldsSection
						defaultOpen
						description="Gold, hero souls, and the current run's zone values."
						fields={zoneItemFields}
						title='Zone Items'
					/>

					<HeroesSection defaultOpen />

					<AchievementsSection defaultOpen={false} />

					<TranscensionsSection defaultOpen={false} showToast={showToast} />

					<SimpleFieldsSection
						defaultOpen={false}
						description='Clan raid class, immortal souls, and titan damage values.'
						fields={clanFields}
						note='Raid classes map to 0 = None, 1 = Rogue, 2 = Mage, 3 = Priest.'
						title='Clan Values'
					/>

					<MercenariesSection defaultOpen={false} />

					<OutsidersSection defaultOpen={false} />

					<CustomFieldSection defaultOpen={false} />

					<FeedbackSection defaultOpen={false} />
				</PanelSection>
			</div>
		</>
	);
};
