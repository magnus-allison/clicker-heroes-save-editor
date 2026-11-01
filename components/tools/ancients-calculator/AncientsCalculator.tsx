'use client';

import { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
import { useNumberFormat } from '@/components/ui/useNumberFormat';
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

/** Outsider config ids to the keys their effects are translated under. */
const outsiderKeys = {
	1: 'xyliqil',
	2: 'chorgorloth',
	3: 'phandoryss',
	5: 'ponyboy',
	6: 'borb',
	7: 'rhageist',
	8: 'kariqua',
	9: 'orphalas',
	10: 'senakhan'
} as const;

const isOutsiderKeyId = (id: number): id is keyof typeof outsiderKeys => id in outsiderKeys;

export const AncientsCalculator = () => {
	const t = useTranslations('tools.ancients');
	const format = useNumberFormat();
	const tShared = useTranslations('tools.shared');
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

	const availableSoulsLabel = calculation
		? formatHeroSouls(calculation.heroSoulsAvailable, format.locale)
		: '0';
	const buildOptions = buildModeOptions.map((option) => ({
		label: t(`buildModes.${option.value}`),
		value: option.value
	}));
	const heroOptions = heroTierOptions.map((option) => ({
		label: t(`heroTiers.${option.value}`),
		value: option.value
	}));

	return (
		<>
			<Breadcrumb page='ancientsCalculator' title='tools' />

			<SaveDataPanel examples={examples} />

			<StepTitle step={2} title={t('steps.settings')} />
			<PanelSection>
				<SectionCard
					defaultOpen
					description={t('build.description')}
					title={t('build.title')}
					actions={
						<Button
							aria-label={tShared('resetDefaults')}
							onClick={resetSettings}
							size='sm'
							title={tShared('resetDefaults')}
							variant='ghost'
						>
							<RotateCcw aria-hidden='true' className='h-3.5 w-3.5' />
						</Button>
					}
				>
					<div className='grid gap-3'>
						<SettingRow description={t('settings.buildDescription')} label={t('settings.buildLabel')}>
							<Dropdown
								aria-label={t('settings.buildLabel')}
								onChange={(event) => updateSetting('buildMode', event.target.value as BuildMode)}
								options={buildOptions}
								value={settings.buildMode}
							/>
						</SettingRow>
						{settings.buildMode === 'hybrid' ? (
							<SettingRow
								description={t('settings.ratioDescription')}
								help={<p>{t('settings.ratioHelp')}</p>}
								label={t('settings.ratioLabel')}
							>
								<NumberInput
									ariaLabel={t('settings.ratioAriaLabel')}
									compact
									onCommit={(value) => updateSetting('hybridRatio', clamp(value, 0.05, 100))}
									selectOnFocus
									value={settings.hybridRatio}
								/>
							</SettingRow>
						) : null}
						<SettingRow description={t('settings.heroTierDescription')} label={t('settings.heroTierLabel')}>
							<Dropdown
								aria-label={t('settings.heroTierLabel')}
								onChange={(event) => updateSetting('heroTier', event.target.value as HeroTier)}
								options={heroOptions}
								value={settings.heroTier}
							/>
						</SettingRow>
						<SettingRow
							description={t('settings.heroSoulsDescription', { souls: availableSoulsLabel })}
							label={t('settings.heroSoulsLabel')}
						>
							<TextInput
								ariaLabel={t('settings.heroSoulsLabel')}
								onCommit={setHeroSoulsOverride}
								placeholder={availableSoulsLabel}
								selectOnFocus
								value={heroSoulsOverride}
							/>
						</SettingRow>
						<SettingRow
							description={t('settings.includeAscensionSoulsDescription')}
							label={t('settings.includeAscensionSoulsLabel')}
						>
							<Checkbox
								ariaLabel={t('settings.includeAscensionSoulsLabel')}
								checked={settings.includeSoulsAfterAscension}
								onCheckedChange={(checked) => updateSetting('includeSoulsAfterAscension', checked)}
							/>
						</SettingRow>
					</div>
				</SectionCard>

				<SectionCard description={t('advanced.description')} title={t('advanced.title')}>
					<div className='grid gap-3'>
						<SettingRow description={t('advanced.revolcDescription')} label={t('advanced.revolcLabel')}>
							<NumberInput
								ariaLabel={t('advanced.revolcAriaLabel')}
								compact
								onCommit={(value) => updateSetting('revolcRate', clamp(value, 0, 1))}
								selectOnFocus
								value={settings.revolcRate}
							/>
						</SettingRow>
						<SettingRow
							description={t('advanced.skillAncientsDescription')}
							label={t('advanced.skillAncientsLabel')}
						>
							<NumberInput
								ariaLabel={t('advanced.skillAncientsAriaLabel')}
								compact
								onCommit={(value) => updateSetting('skillAncientsRate', clamp(value, 0, 1))}
								selectOnFocus
								value={settings.skillAncientsRate}
							/>
						</SettingRow>
						<SettingRow description={t('advanced.precisionDescription')} label={t('advanced.precisionLabel')}>
							<NumberInput
								allowDecimal={false}
								ariaLabel={t('advanced.precisionLabel')}
								compact
								onCommit={(value) => updateSetting('precision', clamp(value, 4, 35))}
								selectOnFocus
								value={settings.precision}
							/>
						</SettingRow>
						<SettingRow
							description={
								snapshot
									? t('advanced.regildingDescription', {
											gilds: formatHeroSouls(snapshot.gilds, format.locale)
										})
									: t('advanced.regildingDescriptionEmpty')
							}
							label={t('advanced.regildingLabel')}
						>
							<Checkbox
								ariaLabel={t('advanced.regildingLabel')}
								checked={settings.keepSoulsForRegilding}
								onCheckedChange={(checked) => updateSetting('keepSoulsForRegilding', checked)}
							/>
						</SettingRow>
						<SettingRow
							description={t('advanced.ignoreMinimizedDescription')}
							label={t('advanced.ignoreMinimizedLabel')}
						>
							<Checkbox
								ariaLabel={t('advanced.ignoreMinimizedLabel')}
								checked={settings.ignoreMinimizedAncients}
								onCheckedChange={(checked) => updateSetting('ignoreMinimizedAncients', checked)}
							/>
						</SettingRow>
					</div>
				</SectionCard>
			</PanelSection>

			<StepTitle step={3} title={t('steps.ancientLevels')} />
			<PanelSection>
				<div className='grid gap-4 p-4'>
					<div className='grid gap-3 sm:grid-cols-3'>
						<SummaryStat
							label={t('summary.soulsToSpend')}
							value={calculation ? formatHeroSouls(calculation.heroSoulsForLeveling, format.locale) : '-'}
						/>
						<SummaryStat
							label={t('summary.soulsSpent')}
							value={calculation ? formatHeroSouls(calculation.heroSoulsSpent, format.locale) : '-'}
						/>
						<SummaryStat
							label={t('summary.soulsLeftOver')}
							value={
								calculation ? formatHeroSouls(calculation.heroSoulsRemaining.floor(), format.locale) : '-'
							}
						/>
					</div>

					<EditorTable
						className='border-(--color-line-subtle)'
						label={t('goalsTable.label')}
						tableClassName='w-full'
					>
						<EditorTableHead>
							<tr>
								<EditorTableHeaderCell>{t('goalsTable.ancient')}</EditorTableHeaderCell>
								<EditorTableHeaderCell className='text-right'>
									{t('goalsTable.current')}
								</EditorTableHeaderCell>
								<EditorTableHeaderCell className='text-right'>{t('goalsTable.goal')}</EditorTableHeaderCell>
								<EditorTableHeaderCell className='text-right'>{t('goalsTable.change')}</EditorTableHeaderCell>
								<EditorTableHeaderCell className='text-right'>{t('goalsTable.cost')}</EditorTableHeaderCell>
							</tr>
						</EditorTableHead>
						<EditorTableBody>
							{calculation && calculation.rows.length > 0 ? (
								calculation.rows.map((row) => <AncientGoalRow key={row.key} row={row} />)
							) : (
								<EmptyTableRow columns={5}>
									{snapshot ? t('goalsTable.noAncients') : t('goalsTable.empty')}
								</EmptyTableRow>
							)}
						</EditorTableBody>
					</EditorTable>

					{calculation?.soulBankLevel ? (
						<p className='text-[12px] text-(--color-fg-muted)'>
							{t('soulBank', { souls: formatHeroSouls(calculation.soulBankLevel, format.locale) })}
						</p>
					) : null}

					{calculation ? (
						<p className='text-[12px] text-(--color-fg-dim)'>
							{t('tunedAgainst', {
								ancient: calculation.tuningAncientName,
								seconds: format.fixed(calculation.durationMs / 1000, 2)
							})}
						</p>
					) : null}
				</div>
			</PanelSection>

			<StepTitle step={4} title={t('steps.transcensionDetails')} />
			<PanelSection>
				<SectionCard defaultOpen description={t('stats.description')} title={t('stats.title')}>
					<EditorTable
						className='border-(--color-line-subtle)'
						label={t('stats.label')}
						tableClassName='w-full'
					>
						<EditorTableBody>
							<StatRow
								label={t('stats.transcendentPower')}
								value={calculation ? `${format.fixed(calculation.transcendentPower, 2)}%` : '-'}
							/>
							<StatRow
								label={t('stats.highestZone')}
								value={snapshot ? formatHeroSouls(snapshot.ascensionZone, format.locale) : '-'}
							/>
							<StatRow
								label={t('stats.ancientSoulsTotal')}
								value={snapshot ? formatHeroSouls(snapshot.ancientSoulsTotal, format.locale) : '-'}
							/>
							<StatRow
								label={t('stats.gilds')}
								value={snapshot ? formatHeroSouls(snapshot.gilds, format.locale) : '-'}
							/>
							<StatRow
								label={t('stats.ascensionSouls')}
								value={snapshot ? formatHeroSouls(snapshot.ascensionSouls, format.locale) : '-'}
							/>
						</EditorTableBody>
					</EditorTable>
				</SectionCard>

				<SectionCard description={t('outsiders.description')} title={t('outsiders.title')}>
					<EditorTable
						className='border-(--color-line-subtle)'
						label={t('outsiders.label')}
						tableClassName='w-full'
					>
						<EditorTableHead>
							<tr>
								<EditorTableHeaderCell className='w-18'>{t('outsiders.image')}</EditorTableHeaderCell>
								<EditorTableHeaderCell>{t('outsiders.outsider')}</EditorTableHeaderCell>
								<EditorTableHeaderCell className='text-right'>{t('outsiders.level')}</EditorTableHeaderCell>
							</tr>
						</EditorTableHead>
						<EditorTableBody>
							{outsiderFields.map((outsider) => (
								<OutsiderLevelRow
									description={
										isOutsiderKeyId(outsider.id)
											? t(`outsiderEffects.${outsiderKeys[outsider.id]}`)
											: outsider.description
									}
									imageSrc={outsider.imageSrc}
									key={outsider.id}
									level={
										snapshot ? formatHeroSouls(snapshot.outsiderLevels[outsider.id], format.locale) : '-'
									}
									name={outsider.name}
								/>
							))}
						</EditorTableBody>
					</EditorTable>
				</SectionCard>

				<SectionCard description={t('planner.description')} title={t('planner.title')}>
					<EditorTable
						className='border-(--color-line-subtle)'
						label={t('planner.title')}
						tableClassName='w-full'
					>
						<EditorTableHead>
							<tr>
								<EditorTableHeaderCell>{t('planner.gain')}</EditorTableHeaderCell>
								<EditorTableHeaderCell className='text-right'>{t('planner.required')}</EditorTableHeaderCell>
								<EditorTableHeaderCell className='text-right'>{t('planner.change')}</EditorTableHeaderCell>
							</tr>
						</EditorTableHead>
						<EditorTableBody>
							{plannerRows.length > 0 ? (
								plannerRows.map((row) => (
									<PlannerRow
										change={formatHeroSouls(row.heroSoulsFromPrevious, format.locale)}
										gain={`+${formatHeroSouls(row.ancientSoulsGained, format.locale)} AS`}
										key={row.ancientSoulsGained.toString()}
										required={`${formatHeroSouls(row.heroSoulsRequired, format.locale)} HS`}
									/>
								))
							) : (
								<EmptyTableRow columns={3}>{t('planner.empty')}</EmptyTableRow>
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
