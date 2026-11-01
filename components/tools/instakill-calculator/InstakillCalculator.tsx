'use client';

import { useMemo, useState } from 'react';
import { Calculator, Gauge, RotateCcw, Timer, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Breadcrumb } from '@/components/home/Breadcrumb';
import { Button } from '@/components/ui/Button';
import {
	EditorTable,
	EditorTableBody,
	EditorTableHead,
	EditorTableHeaderCell
} from '@/components/ui/EditorTable';
import { PanelSection } from '@/components/ui/PanelSection';
import { SectionCard } from '@/components/ui/SectionCard';
import {
	calculateInstakill,
	defaultInstakillInputs,
	type InstakillCalculatorInputs
} from '@/lib/instakill-calculator';
import { formatLongDuration } from '@/lib/format';
import { useDurationUnits } from '@/components/tools/use-duration-units';
import { useNumberFormat } from '@/components/ui/useNumberFormat';
import {
	CalculatorCheckboxRow,
	CalculatorFieldRow,
	ResultMetricRow
} from '@/components/tools/instakill-calculator/rows';

const kumawakamaruImageSrc = 'https://static.wikia.nocookie.net/clickerheroes/images/3/37/Kumawakamaru.png';
const borbImageSrc = 'https://static.wikia.nocookie.net/clickerheroes/images/b/bd/Outsider_borb.png';

export const InstakillCalculator = () => {
	const t = useTranslations('tools.instakill');
	const tShared = useTranslations('tools.shared');
	const units = useDurationUnits();
	const format = useNumberFormat();
	// Two decimals, not `format.decimal`'s one: monsters per zone, MPZ reduction
	// and FPS are only useful to two.
	const formatMetric = (value: number) => format.fixed(value, 2);
	const [inputs, setInputs] = useState<InstakillCalculatorInputs>(defaultInstakillInputs);
	const calculation = useMemo(() => calculateInstakill(inputs), [inputs]);

	const updateInput = <Key extends keyof InstakillCalculatorInputs>(
		key: Key,
		value: InstakillCalculatorInputs[Key]
	) => {
		setInputs((currentInputs) => calculateInstakill({ ...currentInputs, [key]: value }).inputs);
	};

	const resetInputs = () => {
		setInputs(defaultInstakillInputs);
	};

	return (
		<>
			<Breadcrumb page='instakillCalculator' title='tools' />

			<PanelSection>
				<SectionCard
					defaultOpen
					description={t('inputs.description')}
					title={t('inputs.title')}
					actions={
						<Button
							aria-label={tShared('resetDefaults')}
							onClick={resetInputs}
							size='sm'
							title={tShared('resetDefaults')}
							variant='ghost'
						>
							<RotateCcw aria-hidden='true' className='h-3.5 w-3.5' />
						</Button>
					}
				>
					<EditorTable
						className='border-(--color-line-subtle)'
						label={t('inputs.label')}
						tableClassName='w-full table-fixed'
					>
						<colgroup>
							<col className='w-18 sm:w-22' />
							<col className='w-[38%] sm:w-auto' />
							<col className='w-[34%] sm:w-72' />
						</colgroup>
						<EditorTableHead>
							<tr>
								<EditorTableHeaderCell>{t('inputs.image')}</EditorTableHeaderCell>
								<EditorTableHeaderCell>{t('inputs.item')}</EditorTableHeaderCell>
								<EditorTableHeaderCell className='text-left sm:text-right'>
									{t('inputs.value')}
								</EditorTableHeaderCell>
							</tr>
						</EditorTableHead>
						<EditorTableBody>
							<CalculatorFieldRow
								allowDecimal={false}
								description={t('inputs.kumawakamaruDescription')}
								id='kumawakamaru-level'
								imageAlt='Kumawakamaru'
								imageSrc={kumawakamaruImageSrc}
								label='Kumawakamaru'
								onCommit={(value) => updateInput('kumawakamaruLevel', value)}
								value={inputs.kumawakamaruLevel}
							/>
							<CalculatorFieldRow
								allowDecimal={false}
								description={t('inputs.borbDescription')}
								id='borb-level'
								imageAlt='Borb'
								imageSrc={borbImageSrc}
								label='Borb'
								onCommit={(value) => updateInput('borbLevel', value)}
								value={inputs.borbLevel}
							/>
							<CalculatorFieldRow
								allowDecimal={false}
								description={t('inputs.startZoneDescription')}
								id='start-zone'
								imageAlt={t('inputs.startZoneImageAlt')}
								imageSrc='/assets/zoneItems/zone_explorer.webp'
								label={t('inputs.startZoneLabel')}
								onCommit={(value) => updateInput('startZone', value)}
								value={inputs.startZone}
							/>
							<CalculatorFieldRow
								allowDecimal={false}
								description={t('inputs.endZoneDescription')}
								id='end-zone'
								imageAlt={t('inputs.endZoneImageAlt')}
								imageSrc='/assets/zoneItems/zone_lord.webp'
								label={t('inputs.endZoneLabel')}
								onCommit={(value) => updateInput('endZone', value)}
								value={inputs.endZone}
							/>
							<CalculatorFieldRow
								description={t('inputs.fpsDescription')}
								id='fps'
								imageAlt={t('inputs.fpsImageAlt')}
								imageSrc='/assets/autoclickers/Autoclicker_default.webp'
								label='FPS'
								onCommit={(value) => updateInput('fps', value)}
								value={inputs.fps}
							/>
							<CalculatorCheckboxRow
								checked={inputs.acInstakill}
								description={t('inputs.acInstakillDescription')}
								icon={<Zap aria-hidden='true' className='h-4 w-4' />}
								label={t('inputs.acInstakillLabel')}
								onCheckedChange={(checked) => updateInput('acInstakill', checked)}
							/>
							<CalculatorCheckboxRow
								checked={inputs.root2}
								description={t('inputs.root2Description')}
								help={<p>{t('inputs.root2Help')}</p>}
								icon={<Gauge aria-hidden='true' className='h-4 w-4' />}
								label='root2'
								onCheckedChange={(checked) => updateInput('root2', checked)}
							/>
						</EditorTableBody>
					</EditorTable>
				</SectionCard>

				<SectionCard defaultOpen description={t('output.description')} title={t('output.title')}>
					<EditorTable
						className='border-(--color-line-subtle)'
						label={t('output.label')}
						tableClassName='w-full table-fixed'
					>
						<colgroup>
							<col className='w-18 sm:w-22' />
							<col className='w-[42%] sm:w-auto' />
							<col className='w-[30%] sm:w-64' />
						</colgroup>
						<EditorTableHead>
							<tr>
								<EditorTableHeaderCell>{t('output.icon')}</EditorTableHeaderCell>
								<EditorTableHeaderCell>{t('output.metric')}</EditorTableHeaderCell>
								<EditorTableHeaderCell className='text-left sm:text-right'>
									{t('output.value')}
								</EditorTableHeaderCell>
							</tr>
						</EditorTableHead>
						<EditorTableBody>
							<ResultMetricRow
								detail={t('output.effective', { value: formatMetric(calculation.startMonstersPerZone) })}
								icon={<Calculator aria-hidden='true' className='h-4 w-4' />}
								label={t('output.startMpz')}
								value={formatMetric(calculation.rawStartMonstersPerZone)}
							/>
							<ResultMetricRow
								detail={t('output.effective', { value: formatMetric(calculation.endMonstersPerZone) })}
								icon={<Calculator aria-hidden='true' className='h-4 w-4' />}
								label={t('output.endMpz')}
								value={formatMetric(calculation.rawEndMonstersPerZone)}
							/>
							<ResultMetricRow
								detail={t('output.zones', { count: calculation.zonesTotal })}
								icon={<Timer aria-hidden='true' className='h-4 w-4' />}
								label={t('output.duration')}
								value={formatLongDuration(calculation.durationSeconds, units)}
							/>
							<ResultMetricRow
								detail={t('output.frames', { count: Math.round(calculation.framesTotal) })}
								icon={<Gauge aria-hidden='true' className='h-4 w-4' />}
								label={t('output.zonesPerHour')}
								value={formatMetric(calculation.zonesPerHour)}
							/>
							<ResultMetricRow
								detail={t('output.mpzReductionDetail')}
								icon={<Zap aria-hidden='true' className='h-4 w-4' />}
								label={t('output.mpzReduction')}
								value={formatMetric(calculation.mpzReduction)}
							/>
							<ResultMetricRow
								detail={t('output.killFrames', { count: inputs.acInstakill ? 14 : 15 })}
								icon={<Gauge aria-hidden='true' className='h-4 w-4' />}
								label={t('output.timing')}
								value={`${formatMetric(calculation.inputs.fps)} FPS`}
							/>
						</EditorTableBody>
					</EditorTable>
				</SectionCard>
			</PanelSection>
		</>
	);
};
