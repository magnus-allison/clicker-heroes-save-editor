'use client';

import { useRef } from 'react';
import { SaveDataPanel } from '@/components/editor/SaveDataPanel';
import { AchievementsSection } from '@/components/editor/sections/AchievementsSection';
import { AdditionalInfoSection } from '@/components/editor/sections/AdditionalInfoSection';
import { CustomFieldSection } from '@/components/editor/sections/CustomFieldSection';
import { FeedbackSection } from '@/components/editor/sections/FeedbackSection';
import { HeroesSection } from '@/components/editor/sections/HeroesSection';
import { JsonSection } from '@/components/editor/sections/JsonSection';
import { MercenariesSection } from '@/components/editor/sections/MercenariesSection';
import { OutsidersSection } from '@/components/editor/sections/OutsidersSection';
import { SimpleFieldsSection } from '@/components/editor/sections/SimpleFieldsSection';
import { SkinsSection } from '@/components/editor/sections/SkinsSection';
import { TranscensionsSection } from '@/components/editor/sections/TranscensionsSection';
import { useToast } from '@/components/ui/ToastProvider';
import { clanFields } from '@/lib/data/editor-config';
import { shopItemFields } from '@/lib/data/shopItems';
import { zoneItemFields } from '@/lib/data/zoneItems';
import { PanelSection } from '../ui/PanelSection';
import { StepTitle } from '../ui/StepTitle';
import { useSaveStore } from '@/lib/save-store';

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
		<div className='flex min-h-screen w-full justify-center overflow-x-hidden p-10'>
			<main className='flex w-full max-w-6xl flex-col gap-3'>
				<header className='mb-4 flex flex-col gap-1.5'>
					<h1 className='text-[1.6rem] font-semibold leading-[1.2] text-(--color-text-strong)'>
						Clicker Heroes Save Editor
					</h1>
					<p className='max-w-190 text-sm text-(--color-text-muted)'>
						Import your save file, edit values, and export an updated save.
					</p>
				</header>

				<SaveDataPanel onLoadSuccess={scrollToStep2} />

				<div className='ml-2' ref={step2Ref}>
					<StepTitle title='Edit Your Save Data' step={2} />
				</div>
				<PanelSection className={!hasSave ? 'pointer-events-none opacity-40 select-none' : undefined}>
					<SimpleFieldsSection
						defaultOpen
						description='Core currencies and ruby-shop purchases.'
						fields={shopItemFields}
						title='Shop Items'
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

					<JsonSection defaultOpen={false} showToast={showToast} />

					<AdditionalInfoSection defaultOpen={false} />

					<FeedbackSection defaultOpen={false} />
				</PanelSection>
			</main>
		</div>
	);
};
