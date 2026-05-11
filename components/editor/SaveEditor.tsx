'use client';

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

export const SaveEditor = () => {
	const { showToast } = useToast();

	return (
		<div className='flex min-h-screen w-full justify-center overflow-x-hidden p-10'>
			<main className='flex w-full max-w-6xl flex-col gap-3'>
				<header className='mb-2 flex flex-col gap-1.5'>
					<h1 className='text-2xl font-semibold leading-[1.2] text-(--color-text-strong)'>
						Clicker Heroes Save Editor
					</h1>
					<p className='max-w-190 text-sm text-(--color-text-muted)'>
						Import your save file, edit values, and export an updated save.
					</p>
				</header>

				<SaveDataPanel />

				<PanelSection>
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
