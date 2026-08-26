'use client';

import { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';

import { SaveDataPanel } from '@/components/editor/SaveDataPanel';
import { Breadcrumb } from '@/components/home/Breadcrumb';
import { AncientGoalRow, OutsiderLevelRow, PlannerRow } from '@/components/tools/ancients-calculator/rows';
import { Button } from '@/components/ui/Button';
import { EmptyTableRow, SettingRow, StatRow, SummaryStat } from '@/components/ui/CalculatorRows';
import { Checkbox } from '@/components/ui/Checkbox';
import { Dropdown } from '@/components/ui/Dropdown';
import {
	EditorTable,
	EditorTableBody,
	EditorTableHead,
	EditorTableHeaderCell
} from '@/components/ui/EditorTable';
import { NumberInput } from '@/components/ui/NumberInput';
import { PanelSection } from '@/components/ui/PanelSection';
import { SectionCard } from '@/components/ui/SectionCard';
import { StepTitle } from '@/components/ui/StepTitle';
import { TextInput } from '@/components/ui/TextInput';
import {
	buildModeOptions,
	calculateAncients,
	defaultAncientsSettings,
	formatHeroSouls,
	heroTierOptions,
	planAncientSouls,
	readAncientsSnapshot,
	type AncientsSettings,
	type BuildMode,
	type HeroTier
} from '@/lib/ancients-calculator';
import { outsiderFields } from '@/lib/data/editor-config';
import { examples } from '@/lib/data/example-saves';
import { useSaveStore } from '@/lib/save-store';

const plannerRowCount = 20;

export const AncientsCalculator = () => {
	const saveData = useSaveStore((state) => state.saveData);
	const [settings, setSettings] = useState<AncientsSettings>(defaultAncientsSettings);
	const [heroSoulsOverride, setHeroSoulsOverride] = useState('');

	const snapshot = useMemo(() => readAncientsSnapshot(saveData), [saveData]);
	const calculation = useMemo(
		() => (snapshot ? calculateAncients({ heroSoulsOverride, settings, snapshot }) : null),
		[heroSoulsOverride, settings, snapshot]
	);
	const plannerRows = useMemo(
		() => (snapshot ? planAncientSouls({ count: plannerRowCount, settings, snapshot }) : []),
		[settings, snapshot]
	);

	const updateSetting = <Key extends keyof AncientsSettings>(key: Key, value: AncientsSettings[Key]) => {
		setSettings((currentSettings) => ({ ...currentSettings, [key]: value }));
	};

	const resetSettings = () => {
		setSettings(defaultAncientsSettings);
		setHeroSoulsOverride('');
	};

	const availableSoulsLabel = calculation ? formatHeroSouls(calculation.heroSoulsAvailable) : '0';

	return (
		<>
			<Breadcrumb subtitle='Ancients Calculator' title='tools' />

			<SaveDataPanel examples={examples} />

			<StepTitle step={2} title='Settings' />
			<PanelSection>
				<SectionCard
					defaultOpen
					description='Build, best hero, and the souls to distribute.'
					title='Build'
					actions={
						<Button
							aria-label='Reset defaults'
							onClick={resetSettings}
							size='sm'
							title='Reset defaults'
							variant='ghost'
						>
							<RotateCcw aria-hidden='true' className='h-3.5 w-3.5' />
						</Button>
					}
				>
					<div className='grid gap-3'>
						<SettingRow
							description='Assumes you own Siyalatas for idle and hybrid, and Fragsworth for active.'
							label='Build'
						>
							<Dropdown
								aria-label='Build'
								onChange={(event) => updateSetting('buildMode', event.target.value as BuildMode)}
								options={buildModeOptions}
								value={settings.buildMode}
							/>
						</SettingRow>
						{settings.buildMode === 'hybrid' ? (
							<SettingRow
								description='Fragsworth levels per Siyalatas level. 20 favours active heavily.'
								help={
									<p>
										Hybrid builds are mostly used for timelapses at zones 50k - 250k and 1m+. Past that, idle
										damage is negligible next to active, so a high ratio is usually better.
									</p>
								}
								label='Fragsworth / Siyalatas ratio'
							>
								<NumberInput
									ariaLabel='Fragsworth to Siyalatas ratio'
									compact
									onCommit={(value) => updateSetting('hybridRatio', clamp(value, 0.05, 100))}
									selectOnFocus
									value={settings.hybridRatio}
								/>
							</SettingRow>
						) : null}
						<SettingRow
							description='Damage-to-gold ratios differ per hero, which shifts how far the gold ancients are levelled.'
							label='Best hero this transcension'
						>
							<Dropdown
								aria-label='Best hero this transcension'
								onChange={(event) => updateSetting('heroTier', event.target.value as HeroTier)}
								options={heroTierOptions}
								value={settings.heroTier}
							/>
						</SettingRow>
						<SettingRow
							description={`Leave empty to use the save (${availableSoulsLabel} HS).`}
							label='Hero souls to spend'
						>
							<TextInput
								ariaLabel='Hero souls to spend'
								onCommit={setHeroSoulsOverride}
								placeholder={availableSoulsLabel}
								selectOnFocus
								value={heroSoulsOverride}
							/>
						</SettingRow>
						<SettingRow
							description='Adds the souls your next ascension would hand over to the pool.'
							label='Include souls gained after ascension'
						>
							<Checkbox
								ariaLabel='Include souls gained after ascension'
								checked={settings.includeSoulsAfterAscension}
								onCheckedChange={(checked) => updateSetting('includeSoulsAfterAscension', checked)}
							/>
						</SettingRow>
					</div>
				</SectionCard>

				<SectionCard
					description='Auxiliary ancients, reserved souls, and solver precision.'
					title='Advanced configuration'
				>
					<div className='grid gap-3'>
						<SettingRow
							description='0 = never level it, 1 = level it as hard as the rules allow.'
							label='Level Revolc'
						>
							<NumberInput
								ariaLabel='Revolc level rate'
								compact
								onCommit={(value) => updateSetting('revolcRate', clamp(value, 0, 1))}
								selectOnFocus
								value={settings.revolcRate}
							/>
						</SettingRow>
						<SettingRow
							description='Same scale, applied to Vaagur and the skill duration ancients.'
							label='Level skill ancients'
						>
							<NumberInput
								ariaLabel='Skill ancients level rate'
								compact
								onCommit={(value) => updateSetting('skillAncientsRate', clamp(value, 0, 1))}
								selectOnFocus
								value={settings.skillAncientsRate}
							/>
						</SettingRow>
						<SettingRow
							description='Significant digits the solver converges to. Low is quicker, high is more accurate.'
							label='Calculator precision'
						>
							<NumberInput
								allowDecimal={false}
								ariaLabel='Calculator precision'
								compact
								onCommit={(value) => updateSetting('precision', clamp(value, 4, 35))}
								selectOnFocus
								value={settings.precision}
							/>
						</SettingRow>
						<SettingRow
							description={
								snapshot
									? `Holds back 80 HS per gild, and you have ${formatHeroSouls(snapshot.gilds)}.`
									: 'Holds back 80 hero souls per gild.'
							}
							label='Reserve hero souls for regilding'
						>
							<Checkbox
								ariaLabel='Reserve hero souls for regilding'
								checked={settings.keepSoulsForRegilding}
								onCheckedChange={(checked) => updateSetting('keepSoulsForRegilding', checked)}
							/>
						</SettingRow>
						<SettingRow
							description='Skips any ancient whose in-game card you have collapsed.'
							label='Ignore ancients minimized in-game'
						>
							<Checkbox
								ariaLabel='Ignore ancients minimized in-game'
								checked={settings.ignoreMinimizedAncients}
								onCheckedChange={(checked) => updateSetting('ignoreMinimizedAncients', checked)}
							/>
						</SettingRow>
					</div>
				</SectionCard>
			</PanelSection>

			<StepTitle step={3} title='Ancient levels' />
			<PanelSection>
				<div className='grid gap-4 p-4'>
					<div className='grid gap-3 sm:grid-cols-3'>
						<SummaryStat
							label='Souls to spend'
							value={calculation ? formatHeroSouls(calculation.heroSoulsForLeveling) : '-'}
						/>
						<SummaryStat
							label='Souls spent'
							value={calculation ? formatHeroSouls(calculation.heroSoulsSpent) : '-'}
						/>
						<SummaryStat
							label='Souls left over'
							value={calculation ? formatHeroSouls(calculation.heroSoulsRemaining.floor()) : '-'}
						/>
					</div>

					<EditorTable
						className='border-(--color-line-subtle)'
						label='Recommended ancient levels'
						tableClassName='w-full'
					>
						<EditorTableHead>
							<tr>
								<EditorTableHeaderCell>Ancient</EditorTableHeaderCell>
								<EditorTableHeaderCell className='text-right'>Current</EditorTableHeaderCell>
								<EditorTableHeaderCell className='text-right'>Goal</EditorTableHeaderCell>
								<EditorTableHeaderCell className='text-right'>Change</EditorTableHeaderCell>
								<EditorTableHeaderCell className='text-right'>Cost (HS)</EditorTableHeaderCell>
							</tr>
						</EditorTableHead>
						<EditorTableBody>
							{calculation && calculation.rows.length > 0 ? (
								calculation.rows.map((row) => <AncientGoalRow key={row.key} row={row} />)
							) : (
								<EmptyTableRow columns={5}>
									{snapshot
										? 'No owned ancients found in this save.'
										: 'Load a save to see recommended ancient levels.'}
								</EmptyTableRow>
							)}
						</EditorTableBody>
					</EditorTable>

					{calculation?.soulBankLevel ? (
						<p className='text-[12px] text-(--color-fg-muted)'>
							Soul bank: keep {formatHeroSouls(calculation.soulBankLevel)} HS unspent. You do not own
							Morgulis, so leftover souls are worth more banked than invested.
						</p>
					) : null}

					{calculation ? (
						<p className='text-[12px] text-(--color-fg-dim)'>
							Tuned against {calculation.tuningAncientName}, calculated in{' '}
							{(calculation.durationMs / 1000).toFixed(2)}s.
						</p>
					) : null}
				</div>
			</PanelSection>

			<StepTitle step={4} title='Transcension details' />
			<PanelSection>
				<SectionCard defaultOpen description='Values read from your save.' title='Stats'>
					<EditorTable className='border-(--color-line-subtle)' label='Save stats' tableClassName='w-full'>
						<EditorTableBody>
							<StatRow
								label='Transcendent Power'
								value={calculation ? `${calculation.transcendentPower.toFixed(2)}%` : '-'}
							/>
							<StatRow
								label='Highest Zone Reached'
								value={snapshot ? formatHeroSouls(snapshot.ascensionZone) : '-'}
							/>
							<StatRow
								label='Ancient Souls Total'
								value={snapshot ? formatHeroSouls(snapshot.ancientSoulsTotal) : '-'}
							/>
							<StatRow label='Gilds' value={snapshot ? formatHeroSouls(snapshot.gilds) : '-'} />
							<StatRow
								label='Souls gained after ascension'
								value={snapshot ? formatHeroSouls(snapshot.ascensionSouls) : '-'}
							/>
						</EditorTableBody>
					</EditorTable>
				</SectionCard>

				<SectionCard description='Current outsider levels.' title='Outsiders'>
					<EditorTable
						className='border-(--color-line-subtle)'
						label='Outsider levels'
						tableClassName='w-full'
					>
						<EditorTableHead>
							<tr>
								<EditorTableHeaderCell className='w-18'>Image</EditorTableHeaderCell>
								<EditorTableHeaderCell>Outsider</EditorTableHeaderCell>
								<EditorTableHeaderCell className='text-right'>Level</EditorTableHeaderCell>
							</tr>
						</EditorTableHead>
						<EditorTableBody>
							{outsiderFields.map((outsider) => (
								<OutsiderLevelRow
									description={outsider.description}
									imageSrc={outsider.imageSrc}
									key={outsider.id}
									level={snapshot ? formatHeroSouls(snapshot.outsiderLevels[outsider.id]) : '-'}
									name={outsider.name}
								/>
							))}
						</EditorTableBody>
					</EditorTable>
				</SectionCard>

				<SectionCard
					description='Hero souls to sacrifice for your next ancient souls.'
					title='Ancient soul planner'
				>
					<EditorTable
						className='border-(--color-line-subtle)'
						label='Ancient soul planner'
						tableClassName='w-full'
					>
						<EditorTableHead>
							<tr>
								<EditorTableHeaderCell>Gain</EditorTableHeaderCell>
								<EditorTableHeaderCell className='text-right'>
									By sacrificing a total of
								</EditorTableHeaderCell>
								<EditorTableHeaderCell className='text-right'>Change</EditorTableHeaderCell>
							</tr>
						</EditorTableHead>
						<EditorTableBody>
							{plannerRows.length > 0 ? (
								plannerRows.map((row) => (
									<PlannerRow
										change={formatHeroSouls(row.heroSoulsFromPrevious)}
										gain={`+${formatHeroSouls(row.ancientSoulsGained)} AS`}
										key={row.ancientSoulsGained.toString()}
										required={`${formatHeroSouls(row.heroSoulsRequired)} HS`}
									/>
								))
							) : (
								<EmptyTableRow columns={3}>Load a save to plan your next ancient souls.</EmptyTableRow>
							)}
						</EditorTableBody>
					</EditorTable>
				</SectionCard>
			</PanelSection>
		</>
	);
};

function clamp(value: number, min: number, max: number) {
	if (!Number.isFinite(value)) {
		return min;
	}

	return Math.min(max, Math.max(min, value));
}
