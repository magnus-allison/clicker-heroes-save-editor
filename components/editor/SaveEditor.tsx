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
import { useSaveStore } from '@/lib/save-store';
import { ArrowLeft } from 'lucide-react';
import { SectionHeading } from '../home/SectionHeading';
import { cn } from '@/lib/cn';

export const SaveEditor = () => {
	const { showToast } = useToast();
	const hasSave = useSaveStore((state) => state.saveData !== null);
	const step2Ref = useRef<HTMLDivElement>(null);

	const scrollToStep2 = () => {
		if (step2Ref.current) {
			step2Ref.current.scrollIntoView({ behavior: 'smooth' });
		}
	};

	return (
		<>
			<SectionHeading
				back='/'
				description=''
				icon={<ArrowLeft aria-hidden='true' className='h-4 w-4' />}
				title='Tools · Clicker Heroes Save Editor'
			/>

			<SaveDataPanel onLoadSuccess={scrollToStep2} />

			<div className={cn(!hasSave && 'pointer-events-none opacity-40 select-none')} inert={!hasSave}>
				<div ref={step2Ref} className='mb-10'>
					<StepTitle title='Edit Your Save Data' step={2} />
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
