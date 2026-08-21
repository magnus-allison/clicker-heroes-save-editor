'use client';

import { useMemo, useState } from 'react';

import posthog from 'posthog-js';
import { ArrowLeft, RotateCcw } from 'lucide-react';

import { SaveDataPanel } from '@/components/editor/SaveDataPanel';
import { SectionHeading } from '@/components/home/SectionHeading';
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
import { outsiderFields } from '@/lib/data/editor-config';
import { examples } from '@/lib/data/example-saves';
import { formatNumber } from '@/lib/format';
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

const percent = (value: number) => `${value.toFixed(2)}%`;

export const OutsidersCalculator = () => {
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
			showToast('Load a save before applying outsider levels.');
			return;
		}

		const plan = planOutsiderAutoLevel({ calculation, snapshot });

		if (plan.blockedBy.length > 0) {
			const names = plan.blockedBy.map((definition) => definition.name).join(', ');
			showToast(`${names} already sit above the recommendation. Respec in game, then try again.`);
			return;
		}

		updateValues(plan.updates);
		showToast('Outsider levels written to the save.');
		posthog.capture('outsiders_applied_to_save');
	};

	return (
		<>
			<SectionHeading
				back='/'
				description=''
				icon={<ArrowLeft aria-hidden='true' className='h-5 w-5' />}
				title='Tools · Clicker Heroes Outsiders Calculator'
			/>

			<SaveDataPanel examples={examples} hasEditStep />

			<StepTitle step={2} title='Outsider levels' />
			<PanelSection>
				<SectionCard
					defaultOpen
					description='Target zone, Orphalas, and the ancient soul reserve.'
					title='Settings'
					actions={
						<Button
							aria-label='Reset defaults'
							onClick={() => setSettings(defaultOutsidersSettings)}
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
							description='Plan for a zone you pick instead of the one your ancient souls suggest. 0 uses the estimate.'
							help={
								<p>
									The estimate assumes you push actively and ascend until the run stops paying off. Pin a zone
									here if you already know where you intend to stop, or to see what a shorter run would want.
								</p>
							}
							label='Zone override'
						>
							<NumberInput
								allowDecimal={false}
								ariaLabel='Zone override'
								compact
								onCommit={(value) => updateSetting('zoneOverride', clamp(value, 0, maxZoneOverride))}
								selectOnFocus
								value={settings.zoneOverride}
							/>
						</SettingRow>
						<SettingRow
							description='Orphalas only buys boss fight timer, which active pushing rarely needs.'
							label='Level Orphalas'
						>
							<Checkbox
								ariaLabel='Level Orphalas'
								checked={settings.levelOrphalas}
								onCheckedChange={(checked) => updateSetting('levelOrphalas', checked)}
							/>
						</SettingRow>
						<SettingRow
							description='Holds back a tenth of what is left after Borb instead of spending it.'
							label='Reserve ancient souls'
						>
							<Checkbox
								ariaLabel='Reserve ancient souls'
								checked={settings.reserveAncientSouls}
								onCheckedChange={(checked) => updateSetting('reserveAncientSouls', checked)}
							/>
						</SettingRow>
						<SettingRow
							description='Projects every transcension between here and the end of the game.'
							label='Transcension simulator'
						>
							<Checkbox
								ariaLabel='Transcension simulator'
								checked={showSimulator}
								onCheckedChange={setShowSimulator}
							/>
						</SettingRow>
					</div>
				</SectionCard>

				<div className='grid gap-4 p-4'>
					<div className='grid gap-3 sm:grid-cols-3'>
						<SummaryStat
							label='Ancient souls earned'
							value={calculation ? formatNumber(calculation.ancientSouls) : '-'}
						/>
						<SummaryStat
							label='Transcendent Power'
							value={calculation ? formatTranscendentPower(calculation.ancientSouls) : '-'}
						/>
						<SummaryStat
							label='Unspent after this plan'
							value={calculation ? formatNumber(calculation.ancientSoulsUnspent) : '-'}
						/>
					</div>

					<EditorTable
						className='border-(--color-line-subtle)'
						label='Recommended outsider levels'
						tableClassName='w-full'
					>
						<EditorTableHead>
							<tr>
								<EditorTableHeaderCell className='w-18'>Image</EditorTableHeaderCell>
								<EditorTableHeaderCell>Outsider</EditorTableHeaderCell>
								<EditorTableHeaderCell className='text-right'>Current</EditorTableHeaderCell>
								<EditorTableHeaderCell className='text-right'>Level</EditorTableHeaderCell>
								<EditorTableHeaderCell className='text-right'>Change</EditorTableHeaderCell>
								<EditorTableHeaderCell className='text-right'>Total cost</EditorTableHeaderCell>
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
								<EmptyTableRow columns={6}>Load a save to see recommended outsider levels.</EmptyTableRow>
							)}
						</EditorTableBody>
					</EditorTable>

					{calculation ? (
						<div className='flex flex-wrap items-center gap-2'>
							<Button disabled={!saveData} onClick={applyToSave} variant='primary'>
								Apply Levels To Save
							</Button>
							<span className='inline-flex items-center gap-1 rounded-(--radius-control) border border-(--color-line-subtle) bg-(--color-surface-muted) py-1 pr-1 pl-3 font-mono text-[12px] text-(--color-fg-secondary)'>
								{calculation.shareString}
								<CopyButton
									idleLabel='Copy outsider levels'
									successLabel='Copied outsider levels'
									text={calculation.shareString}
								/>
							</span>
						</div>
					) : null}

					{calculation?.ancientSoulsReserved ? (
						<p className='text-[12px] text-(--color-fg-muted)'>
							Holding back {formatNumber(calculation.ancientSoulsReserved)} ancient souls, as the reserve
							setting asks.
						</p>
					) : null}

					{snapshot && !snapshot.transcendent ? (
						<p className='text-[12px] text-(--color-fg-muted)'>
							This save has never transcended, so it has no outsiders to level yet. Transcend at zone 300
							first — the plan below is what to do once you have.
						</p>
					) : null}

					<p className='text-[12px] text-(--color-fg-dim)'>
						Planned from every ancient soul the save has earned, not the{' '}
						{snapshot ? formatNumber(snapshot.ancientSoulsUnspent) : '0'} it currently has unspent, so respec
						in game before applying these levels.
					</p>
				</div>
			</PanelSection>

			{calculation && calculation.hints.length > 0 ? (
				<PanelSection>
					<SectionCard defaultOpen description='What to do with this run.' title='Guidance'>
						<ul className='grid list-disc gap-2 pl-5 text-[13px] leading-6 text-(--color-fg-secondary)'>
							{calculation.hints.map((hint) => (
								<li key={hint}>{hint}</li>
							))}
						</ul>
					</SectionCard>
				</PanelSection>
			) : null}

			<StepTitle title='Transcension details' />
			<PanelSection>
				<SectionCard
					defaultOpen
					description='Where this transcension ends if you follow the plan.'
					title='End of transcension estimates'
				>
					<EditorTable
						className='border-(--color-line-subtle)'
						label='End of transcension estimates'
						tableClassName='w-full'
					>
						<EditorTableBody>
							<StatRow
								label='Highest zone'
								value={calculation ? formatNumber(calculation.highestZone) : '-'}
							/>
							<StatRow
								label='Hero souls (log10)'
								value={calculation ? calculation.logHeroSouls.toFixed(2) : '-'}
							/>
							<StatRow
								label='Ancient souls'
								value={
									calculation
										? `${formatNumber(calculation.nextAncientSouls)} (+${formatNumber(calculation.ancientSoulsGained)})`
										: '-'
								}
							/>
							<StatRow
								label='Transcendent Power'
								value={calculation ? formatTranscendentPower(calculation.nextAncientSouls) : '-'}
							/>
							<StatRow
								label='Ancient levels'
								value={calculation ? formatNumber(calculation.ancientLevels) : '-'}
							/>
							<StatRow
								label='Kumawakamaru'
								value={
									calculation
										? `${calculation.ancientEffects.kumawakamaru.toFixed(2)} monsters per zone`
										: '-'
								}
							/>
							<StatRow
								label='Atman'
								value={calculation ? `${percent(calculation.ancientEffects.atman)} chance of primal` : '-'}
							/>
							<StatRow
								label='Bubos'
								value={calculation ? `${calculation.ancientEffects.bubos.toFixed(2)} boss life` : '-'}
							/>
							<StatRow
								label='Chronos'
								value={
									calculation ? `${calculation.ancientEffects.chronos.toFixed(2)}s boss fight timer` : '-'
								}
							/>
							<StatRow
								label='Dora'
								value={calculation ? `${percent(calculation.ancientEffects.dora)} treasure chests` : '-'}
							/>
						</EditorTableBody>
					</EditorTable>
				</SectionCard>

				<SectionCard
					description='Zones at which each buffed stat reaches its limit.'
					title='Zone breakpoints'
				>
					<EditorTable
						className='border-(--color-line-subtle)'
						label='Zone breakpoints'
						tableClassName='w-full'
					>
						<EditorTableBody>
							<StatRow
								label='2.1 monsters per zone'
								value={calculation ? formatNumber(calculation.breakpoints.highMonstersPerZone) : '-'}
							/>
							<StatRow
								label='5% primal chance'
								value={calculation ? formatNumber(calculation.breakpoints.primalChanceFloor) : '-'}
							/>
							<StatRow
								label='90% boss health'
								value={calculation ? formatNumber(calculation.breakpoints.bossHealthCeiling) : '-'}
							/>
							<StatRow
								label='2s boss timer'
								value={calculation ? formatNumber(calculation.breakpoints.bossTimerFloor) : '-'}
							/>
							<StatRow
								label='99% treasure chests'
								value={calculation ? formatNumber(calculation.breakpoints.treasureChestCeiling) : '-'}
							/>
							<StatRow
								label='1% treasure chests'
								value={calculation ? formatNumber(calculation.breakpoints.treasureChestFloor) : '-'}
							/>
						</EditorTableBody>
					</EditorTable>
				</SectionCard>

				<SectionCard
					description='What the highest zone looks like with and without your outsiders.'
					title='Stats at the highest zone'
				>
					<EditorTable
						className='border-(--color-line-subtle)'
						label='Stats at the highest zone'
						tableClassName='w-full'
					>
						<EditorTableHead>
							<tr>
								<EditorTableHeaderCell>Stat</EditorTableHeaderCell>
								<EditorTableHeaderCell className='text-right'>Unbuffed</EditorTableHeaderCell>
								<EditorTableHeaderCell className='text-right'>Buffed</EditorTableHeaderCell>
							</tr>
						</EditorTableHead>
						<EditorTableBody>
							<ComparisonRow
								buffed={
									calculation
										? `${calculation.buffed.monstersPerZone.toFixed(2)}${
												calculation.buffed.monstersPerZone < 2 ? ' (2)' : ''
											}`
										: '-'
								}
								label='Monsters per zone'
								unbuffed={calculation ? calculation.unbuffed.monstersPerZone.toFixed(2) : '-'}
							/>
							<ComparisonRow
								buffed={calculation ? `${calculation.buffed.treasureChestChance.toFixed(0)}%` : '-'}
								label='Treasure chests'
								unbuffed={calculation ? `${calculation.unbuffed.treasureChestChance.toFixed(6)}x` : '-'}
							/>
							<ComparisonRow
								buffed={calculation ? `${calculation.buffed.bossHealth.toFixed(0)}x` : '-'}
								label='Boss health'
								unbuffed={calculation ? `${calculation.unbuffed.bossHealth.toFixed(1)}x` : '-'}
							/>
							<ComparisonRow
								buffed={calculation ? `${calculation.buffed.bossTimer.toFixed(0)}s` : '-'}
								label='Boss timer'
								unbuffed={calculation ? `${calculation.unbuffed.bossTimer.toFixed(0)}s` : '-'}
							/>
							<ComparisonRow
								buffed={calculation ? `${calculation.buffed.primalBossChance.toFixed(0)}%` : '-'}
								label='Primal chance'
								unbuffed={calculation ? `${calculation.unbuffed.primalBossChance.toFixed(0)}%` : '-'}
							/>
						</EditorTableBody>
					</EditorTable>
				</SectionCard>

				{showSimulator ? (
					<SectionCard
						description='Every transcension from here to the end of the game.'
						title='Transcension simulator'
					>
						<EditorTable
							className='border-(--color-line-subtle)'
							label='Transcension simulator'
							tableClassName='w-full'
						>
							<EditorTableHead>
								<tr>
									<EditorTableHeaderCell>Ancient souls</EditorTableHeaderCell>
									<EditorTableHeaderCell className='text-right'>Borb</EditorTableHeaderCell>
									<EditorTableHeaderCell className='text-right'>Highest zone</EditorTableHeaderCell>
									<EditorTableHeaderCell className='text-right'>Final MpZ</EditorTableHeaderCell>
									<EditorTableHeaderCell className='text-right'>Time</EditorTableHeaderCell>
								</tr>
							</EditorTableHead>
							<EditorTableBody>
								{simulation ? (
									simulation.rows.map((row, index) => (
										// Two projected transcensions can start on the same souls
										// once the projection stops making progress.
										<TranscensionTableRow key={`${index}-${row.ancientSouls}`} row={row} />
									))
								) : (
									<EmptyTableRow columns={5}>Load a save to project your transcensions.</EmptyTableRow>
								)}
							</EditorTableBody>
						</EditorTable>
						{simulation ? (
							<p className='mt-3 text-[12px] text-(--color-fg-muted)'>
								Ends on {formatNumber(simulation.finalAncientSouls)} ancient souls
								{simulation.truncated ? ', where the projection stops making progress.' : '.'}
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
