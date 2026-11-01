'use client';

import { useMemo, useState } from 'react';

import { RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { SaveDataPanel } from '@/components/editor/SaveDataPanel';
import { Breadcrumb } from '@/components/home/Breadcrumb';
import { OutsiderGoalRow, TranscensionTableRow } from '@/components/tools/outsiders-calculator/rows';
import { Button } from '@/components/ui/Button';
import { EmptyTableRow, SettingRow, StatRow, SummaryStat } from '@/components/ui/CalculatorRows';
import { Checkbox } from '@/components/ui/Checkbox';
import { CopyButton } from '@/components/ui/CopyButton';
import {
	EditorTable,
	EditorTableBody,
	EditorTableCell,
	EditorTableHead,
	EditorTableHeaderCell,
	EditorTableRow
} from '@/components/ui/EditorTable';
import { NumberInput } from '@/components/ui/NumberInput';
import { PanelSection } from '@/components/ui/PanelSection';
import { SectionCard } from '@/components/ui/SectionCard';
import { StepTitle } from '@/components/ui/StepTitle';
import { useToast } from '@/components/ui/ToastProvider';
import { useDurationUnits } from '@/components/tools/use-duration-units';
import { useNumberFormat } from '@/components/ui/useNumberFormat';
import { outsiderFields } from '@/lib/data/editor-config';
import { examples } from '@/lib/data/example-saves';
import {
	calculateOutsiders,
	defaultOutsidersSettings,
	formatTranscendentPower,
	planOutsiderAutoLevel,
	readOutsidersSnapshot,
	simulateTranscensions,
	type OutsidersSettings
} from '@/lib/outsiders-calculator';
import { useSaveStore } from '@/lib/save-store';

const outsiderImages = new Map(outsiderFields.map((field) => [field.id, field.imageSrc] as const));

const maxZoneOverride = 5_460_000;

export const OutsidersCalculator = () => {
	const t = useTranslations('tools.outsiders');
	const format = useNumberFormat();
	const percent = (value: number) => `${format.fixed(value, 2)}%`;
	const tShared = useTranslations('tools.shared');
	const units = useDurationUnits();
	const { showToast } = useToast();
	const saveData = useSaveStore((state) => state.saveData);
	const updateValues = useSaveStore((state) => state.updateValues);
	const [settings, setSettings] = useState<OutsidersSettings>(defaultOutsidersSettings);
	const [showSimulator, setShowSimulator] = useState(true);

	const snapshot = useMemo(() => readOutsidersSnapshot(saveData), [saveData]);
	const calculation = useMemo(
		() => (snapshot ? calculateOutsiders({ ancientSouls: snapshot.ancientSoulsTotal, settings }) : null),
		[settings, snapshot]
	);
	const simulation = useMemo(
		() => (calculation && showSimulator ? simulateTranscensions({ calculation, settings }) : null),
		[calculation, settings, showSimulator]
	);

	const updateSetting = <Key extends keyof OutsidersSettings>(key: Key, value: OutsidersSettings[Key]) => {
		setSettings((currentSettings) => ({ ...currentSettings, [key]: value }));
	};

	const applyToSave = () => {
		if (!snapshot || !calculation) {
			showToast(t('toasts.noSave'));
			return;
		}

		const plan = planOutsiderAutoLevel({ calculation, snapshot });

		if (plan.blockedBy.length > 0) {
			const names = plan.blockedBy.map((definition) => definition.name).join(', ');
			showToast(t('toasts.blocked', { names }));
			return;
		}

		updateValues(plan.updates);
		showToast(t('toasts.applied'));
	};

	return (
		<>
			<Breadcrumb page='outsidersCalculator' title='tools' />

			<SaveDataPanel examples={examples} hasEditStep />

			<StepTitle step={2} title={t('steps.outsiderLevels')} />
			<PanelSection>
				<SectionCard
					defaultOpen
					description={t('settings.description')}
					title={t('settings.title')}
					actions={
						<Button
							aria-label={tShared('resetDefaults')}
							onClick={() => setSettings(defaultOutsidersSettings)}
							size='sm'
							title={tShared('resetDefaults')}
							variant='ghost'
						>
							<RotateCcw aria-hidden='true' className='h-3.5 w-3.5' />
						</Button>
					}
				>
					<div className='grid gap-3'>
						<SettingRow
							description={t('settings.zoneOverrideDescription')}
							help={<p>{t('settings.zoneOverrideHelp')}</p>}
							label={t('settings.zoneOverrideLabel')}
						>
							<NumberInput
								allowDecimal={false}
								ariaLabel={t('settings.zoneOverrideLabel')}
								compact
								onCommit={(value) => updateSetting('zoneOverride', clamp(value, 0, maxZoneOverride))}
								selectOnFocus
								value={settings.zoneOverride}
							/>
						</SettingRow>
						<SettingRow description={t('settings.orphalasDescription')} label={t('settings.orphalasLabel')}>
							<Checkbox
								ariaLabel={t('settings.orphalasLabel')}
								checked={settings.levelOrphalas}
								onCheckedChange={(checked) => updateSetting('levelOrphalas', checked)}
							/>
						</SettingRow>
						<SettingRow description={t('settings.reserveDescription')} label={t('settings.reserveLabel')}>
							<Checkbox
								ariaLabel={t('settings.reserveLabel')}
								checked={settings.reserveAncientSouls}
								onCheckedChange={(checked) => updateSetting('reserveAncientSouls', checked)}
							/>
						</SettingRow>
						<SettingRow description={t('settings.simulatorDescription')} label={t('settings.simulatorLabel')}>
							<Checkbox
								ariaLabel={t('settings.simulatorLabel')}
								checked={showSimulator}
								onCheckedChange={setShowSimulator}
							/>
						</SettingRow>
					</div>
				</SectionCard>

				<div className='grid gap-4 p-4'>
					<div className='grid gap-3 sm:grid-cols-3'>
						<SummaryStat
							label={t('summary.ancientSoulsEarned')}
							value={calculation ? format.number(calculation.ancientSouls) : '-'}
						/>
						<SummaryStat
							label={t('summary.transcendentPower')}
							value={calculation ? formatTranscendentPower(calculation.ancientSouls) : '-'}
						/>
						<SummaryStat
							label={t('summary.unspent')}
							value={calculation ? format.number(calculation.ancientSoulsUnspent) : '-'}
						/>
					</div>

					<EditorTable
						className='border-(--color-line-subtle)'
						label={t('goalsTable.label')}
						tableClassName='w-full'
					>
						<EditorTableHead>
							<tr>
								<EditorTableHeaderCell className='w-18'>{t('goalsTable.image')}</EditorTableHeaderCell>
								<EditorTableHeaderCell>{t('goalsTable.outsider')}</EditorTableHeaderCell>
								<EditorTableHeaderCell className='text-right'>
									{t('goalsTable.current')}
								</EditorTableHeaderCell>
								<EditorTableHeaderCell className='text-right'>{t('goalsTable.level')}</EditorTableHeaderCell>
								<EditorTableHeaderCell className='text-right'>{t('goalsTable.change')}</EditorTableHeaderCell>
								<EditorTableHeaderCell className='text-right'>
									{t('goalsTable.totalCost')}
								</EditorTableHeaderCell>
							</tr>
						</EditorTableHead>
						<EditorTableBody>
							{calculation ? (
								calculation.rows.map((row) => (
									<OutsiderGoalRow
										currentLevel={snapshot?.outsiderLevels[row.id] ?? null}
										imageSrc={outsiderImages.get(row.id)}
										key={row.key}
										row={row}
									/>
								))
							) : (
								<EmptyTableRow columns={6}>{t('goalsTable.empty')}</EmptyTableRow>
							)}
						</EditorTableBody>
					</EditorTable>

					{calculation ? (
						<div className='flex flex-wrap items-center gap-2'>
							<Button disabled={!saveData} onClick={applyToSave} variant='primary'>
								{t('apply')}
							</Button>
							<span className='inline-flex items-center gap-1 rounded-(--radius-control) border border-(--color-line-subtle) bg-(--color-surface-muted) py-1 pr-1 pl-3 font-mono text-[12px] text-(--color-fg-secondary)'>
								{calculation.shareString}
								<CopyButton
									idleLabel={t('copyLevels')}
									successLabel={t('copiedLevels')}
									text={calculation.shareString}
								/>
							</span>
						</div>
					) : null}

					{calculation?.ancientSoulsReserved ? (
						<p className='text-[12px] text-(--color-fg-muted)'>
							{t('reserved', { souls: format.number(calculation.ancientSoulsReserved) })}
						</p>
					) : null}

					{snapshot && !snapshot.transcendent ? (
						<p className='text-[12px] text-(--color-fg-muted)'>{t('notTranscended')}</p>
					) : null}

					<p className='text-[12px] text-(--color-fg-dim)'>
						{t('plannedFromTotal', {
							unspent: snapshot ? format.number(snapshot.ancientSoulsUnspent) : '0'
						})}
					</p>
				</div>
			</PanelSection>

			{calculation && calculation.hints.length > 0 ? (
				<PanelSection>
					<SectionCard defaultOpen description={t('guidance.description')} title={t('guidance.title')}>
						<ul className='grid list-disc gap-2 pl-5 text-[13px] leading-6 text-(--color-fg-secondary)'>
							{calculation.hints.map((hint) => (
								<li key={hint.key}>{t(`hints.${hint.key}`, hint.values)}</li>
							))}
						</ul>
					</SectionCard>
				</PanelSection>
			) : null}

			<StepTitle title={t('steps.transcensionDetails')} />
			<PanelSection>
				<SectionCard defaultOpen description={t('estimates.description')} title={t('estimates.title')}>
					<EditorTable
						className='border-(--color-line-subtle)'
						label={t('estimates.title')}
						tableClassName='w-full'
					>
						<EditorTableBody>
							<StatRow
								label={t('estimates.highestZone')}
								value={calculation ? format.number(calculation.highestZone) : '-'}
							/>
							<StatRow
								label={t('estimates.logHeroSouls')}
								value={calculation ? format.fixed(calculation.logHeroSouls, 2) : '-'}
							/>
							<StatRow
								label={t('estimates.ancientSouls')}
								value={
									calculation
										? `${format.number(calculation.nextAncientSouls)} (+${format.number(calculation.ancientSoulsGained)})`
										: '-'
								}
							/>
							<StatRow
								label={t('estimates.transcendentPower')}
								value={calculation ? formatTranscendentPower(calculation.nextAncientSouls) : '-'}
							/>
							<StatRow
								label={t('estimates.ancientLevels')}
								value={calculation ? format.number(calculation.ancientLevels) : '-'}
							/>
							<StatRow
								label='Kumawakamaru'
								value={
									calculation
										? t('estimates.kumawakamaruValue', {
												value: format.fixed(calculation.ancientEffects.kumawakamaru, 2)
											})
										: '-'
								}
							/>
							<StatRow
								label='Atman'
								value={
									calculation
										? t('estimates.atmanValue', { value: percent(calculation.ancientEffects.atman) })
										: '-'
								}
							/>
							<StatRow
								label='Bubos'
								value={
									calculation
										? t('estimates.bubosValue', { value: format.fixed(calculation.ancientEffects.bubos, 2) })
										: '-'
								}
							/>
							<StatRow
								label='Chronos'
								value={
									calculation
										? t('estimates.chronosValue', {
												value: format.fixed(calculation.ancientEffects.chronos, 2)
											})
										: '-'
								}
							/>
							<StatRow
								label='Dora'
								value={
									calculation
										? t('estimates.doraValue', { value: percent(calculation.ancientEffects.dora) })
										: '-'
								}
							/>
						</EditorTableBody>
					</EditorTable>
				</SectionCard>

				<SectionCard description={t('breakpoints.description')} title={t('breakpoints.title')}>
					<EditorTable
						className='border-(--color-line-subtle)'
						label={t('breakpoints.title')}
						tableClassName='w-full'
					>
						<EditorTableBody>
							<StatRow
								label={t('breakpoints.highMonstersPerZone')}
								value={calculation ? format.number(calculation.breakpoints.highMonstersPerZone) : '-'}
							/>
							<StatRow
								label={t('breakpoints.primalChanceFloor')}
								value={calculation ? format.number(calculation.breakpoints.primalChanceFloor) : '-'}
							/>
							<StatRow
								label={t('breakpoints.bossHealthCeiling')}
								value={calculation ? format.number(calculation.breakpoints.bossHealthCeiling) : '-'}
							/>
							<StatRow
								label={t('breakpoints.bossTimerFloor')}
								value={calculation ? format.number(calculation.breakpoints.bossTimerFloor) : '-'}
							/>
							<StatRow
								label={t('breakpoints.treasureChestCeiling')}
								value={calculation ? format.number(calculation.breakpoints.treasureChestCeiling) : '-'}
							/>
							<StatRow
								label={t('breakpoints.treasureChestFloor')}
								value={calculation ? format.number(calculation.breakpoints.treasureChestFloor) : '-'}
							/>
						</EditorTableBody>
					</EditorTable>
				</SectionCard>

				<SectionCard description={t('highestZoneStats.description')} title={t('highestZoneStats.title')}>
					<EditorTable
						className='border-(--color-line-subtle)'
						label={t('highestZoneStats.title')}
						tableClassName='w-full'
					>
						<EditorTableHead>
							<tr>
								<EditorTableHeaderCell>{t('highestZoneStats.stat')}</EditorTableHeaderCell>
								<EditorTableHeaderCell className='text-right'>
									{t('highestZoneStats.unbuffed')}
								</EditorTableHeaderCell>
								<EditorTableHeaderCell className='text-right'>
									{t('highestZoneStats.buffed')}
								</EditorTableHeaderCell>
							</tr>
						</EditorTableHead>
						<EditorTableBody>
							<ComparisonRow
								buffed={
									calculation
										? `${format.fixed(calculation.buffed.monstersPerZone, 2)}${
												calculation.buffed.monstersPerZone < 2 ? ' (2)' : ''
											}`
										: '-'
								}
								label={t('highestZoneStats.monstersPerZone')}
								unbuffed={calculation ? format.fixed(calculation.unbuffed.monstersPerZone, 2) : '-'}
							/>
							<ComparisonRow
								buffed={calculation ? `${format.fixed(calculation.buffed.treasureChestChance, 0)}%` : '-'}
								label={t('highestZoneStats.treasureChests')}
								unbuffed={calculation ? `${format.fixed(calculation.unbuffed.treasureChestChance, 6)}x` : '-'}
							/>
							<ComparisonRow
								buffed={calculation ? `${format.fixed(calculation.buffed.bossHealth, 0)}x` : '-'}
								label={t('highestZoneStats.bossHealth')}
								unbuffed={calculation ? `${format.fixed(calculation.unbuffed.bossHealth, 1)}x` : '-'}
							/>
							<ComparisonRow
								buffed={calculation ? `${format.fixed(calculation.buffed.bossTimer, 0)}s` : '-'}
								label={t('highestZoneStats.bossTimer')}
								unbuffed={calculation ? `${format.fixed(calculation.unbuffed.bossTimer, 0)}s` : '-'}
							/>
							<ComparisonRow
								buffed={calculation ? `${format.fixed(calculation.buffed.primalBossChance, 0)}%` : '-'}
								label={t('highestZoneStats.primalChance')}
								unbuffed={calculation ? `${format.fixed(calculation.unbuffed.primalBossChance, 0)}%` : '-'}
							/>
						</EditorTableBody>
					</EditorTable>
				</SectionCard>

				{showSimulator ? (
					<SectionCard description={t('simulator.description')} title={t('simulator.title')}>
						<EditorTable
							className='border-(--color-line-subtle)'
							label={t('simulator.title')}
							tableClassName='w-full'
						>
							<EditorTableHead>
								<tr>
									<EditorTableHeaderCell>{t('simulator.ancientSouls')}</EditorTableHeaderCell>
									<EditorTableHeaderCell className='text-right'>{t('simulator.borb')}</EditorTableHeaderCell>
									<EditorTableHeaderCell className='text-right'>
										{t('simulator.highestZone')}
									</EditorTableHeaderCell>
									<EditorTableHeaderCell className='text-right'>
										{t('simulator.finalMpz')}
									</EditorTableHeaderCell>
									<EditorTableHeaderCell className='text-right'>{t('simulator.time')}</EditorTableHeaderCell>
								</tr>
							</EditorTableHead>
							<EditorTableBody>
								{simulation ? (
									simulation.rows.map((row, index) => (
										// Two projected transcensions can start on the same souls
										// once the projection stops making progress.
										<TranscensionTableRow key={`${index}-${row.ancientSouls}`} row={row} units={units} />
									))
								) : (
									<EmptyTableRow columns={5}>{t('simulator.empty')}</EmptyTableRow>
								)}
							</EditorTableBody>
						</EditorTable>
						{simulation ? (
							<p className='mt-3 text-[12px] text-(--color-fg-muted)'>
								{t(simulation.truncated ? 'simulator.endsTruncated' : 'simulator.ends', {
									souls: format.number(simulation.finalAncientSouls)
								})}
							</p>
						) : null}
					</SectionCard>
				) : null}
			</PanelSection>
		</>
	);
};

type ComparisonRowProps = {
	buffed: string;
	label: string;
	unbuffed: string;
};

/** One stat before and after the outsiders in the plan are applied to it. */
const ComparisonRow = ({ buffed, label, unbuffed }: ComparisonRowProps) => (
	<EditorTableRow>
		<EditorTableCell className='text-[13px] font-semibold text-(--color-fg)'>{label}</EditorTableCell>
		<EditorTableCell className='text-right tabular-nums text-(--color-fg-muted)'>{unbuffed}</EditorTableCell>
		<EditorTableCell className='text-right tabular-nums text-(--color-fg-strong)'>{buffed}</EditorTableCell>
	</EditorTableRow>
);

function clamp(value: number, min: number, max: number) {
	if (!Number.isFinite(value)) {
		return min;
	}

	return Math.min(max, Math.max(min, value));
}
