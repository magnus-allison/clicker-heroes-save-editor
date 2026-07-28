'use client';

import { useMemo, useState } from 'react';
import { ArrowLeft, Calculator, Gauge, RotateCcw, Timer, Zap } from 'lucide-react';

import { SectionHeading } from '@/components/home/SectionHeading';
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
import { formatNumber } from '@/lib/format';
import {
	CalculatorCheckboxRow,
	CalculatorFieldRow,
	ResultMetricRow
} from '@/components/tools/instakill-calculator/rows';

const kumawakamaruImageSrc = 'https://static.wikia.nocookie.net/clickerheroes/images/3/37/Kumawakamaru.png';
const borbImageSrc = 'https://static.wikia.nocookie.net/clickerheroes/images/b/bd/Outsider_borb.png';

/**
 * Not `formatDecimal` from `lib/format`: that is one decimal place, and this
 * calculator's outputs (monsters per zone, MPZ reduction, FPS) are only useful
 * to two.
 */
const twoDecimals = new Intl.NumberFormat('en-US', {
	maximumFractionDigits: 2,
	minimumFractionDigits: 2
});

const formatMetric = (value: number) => twoDecimals.format(value);

const formatEffectiveMonsters = (value: number) => `Effective ${formatMetric(value)}`;

export const InstakillCalculator = () => {
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
			<SectionHeading
				back='/'
				description=''
				icon={<ArrowLeft aria-hidden='true' className='h-4 w-4' />}
				title='Tools · Clicker Heroes Instakill Calculator'
			/>

			<PanelSection>
				<SectionCard
					defaultOpen
					description='Ancient levels, route range, and frame timing.'
					title='Inputs'
					actions={
						<Button
							aria-label='Reset defaults'
							onClick={resetInputs}
							size='sm'
							title='Reset defaults'
							variant='ghost'
						>
							<RotateCcw aria-hidden='true' className='h-3.5 w-3.5' />
						</Button>
					}
				>
					<EditorTable
						className='border-(--color-line-subtle)'
						label='Instakill calculator inputs'
						tableClassName='w-full table-fixed'
					>
						<colgroup>
							<col className='w-18 sm:w-22' />
							<col className='w-[38%] sm:w-auto' />
							<col className='w-[34%] sm:w-72' />
						</colgroup>
						<EditorTableHead>
							<tr>
								<EditorTableHeaderCell>Image</EditorTableHeaderCell>
								<EditorTableHeaderCell>Item</EditorTableHeaderCell>
								<EditorTableHeaderCell className='text-left sm:text-right'>Value</EditorTableHeaderCell>
							</tr>
						</EditorTableHead>
						<EditorTableBody>
							<CalculatorFieldRow
								allowDecimal={false}
								description='Ancient of Shadows level'
								id='kumawakamaru-level'
								imageAlt='Kumawakamaru'
								imageSrc={kumawakamaruImageSrc}
								label='Kumawakamaru'
								onCommit={(value) => updateInput('kumawakamaruLevel', value)}
								value={inputs.kumawakamaruLevel}
							/>
							<CalculatorFieldRow
								allowDecimal={false}
								description='Outsider level'
								id='borb-level'
								imageAlt='Borb'
								imageSrc={borbImageSrc}
								label='Borb'
								onCommit={(value) => updateInput('borbLevel', value)}
								value={inputs.borbLevel}
							/>
							<CalculatorFieldRow
								allowDecimal={false}
								description='First zone in the route'
								id='start-zone'
								imageAlt='Zone Explorer'
								imageSrc='/assets/zoneItems/zone_explorer.webp'
								label='Starting Zone'
								onCommit={(value) => updateInput('startZone', value)}
								value={inputs.startZone}
							/>
							<CalculatorFieldRow
								allowDecimal={false}
								description='Last zone in the route'
								id='end-zone'
								imageAlt='Zone Lord'
								imageSrc='/assets/zoneItems/zone_lord.webp'
								label='Target Zone'
								onCommit={(value) => updateInput('endZone', value)}
								value={inputs.endZone}
							/>
							<CalculatorFieldRow
								description='Frames per second'
								id='fps'
								imageAlt='Auto Clicker'
								imageSrc='/assets/autoclickers/Autoclicker_default.webp'
								label='FPS'
								onCommit={(value) => updateInput('fps', value)}
								value={inputs.fps}
							/>
							<CalculatorCheckboxRow
								checked={inputs.acInstakill}
								description='Treat autoclicker attacks as instakills.'
								icon={<Zap aria-hidden='true' className='h-4 w-4' />}
								label='AC instakill'
								onCheckedChange={(checked) => updateInput('acInstakill', checked)}
							/>
							<CalculatorCheckboxRow
								checked={inputs.root2}
								description='Use the alternate logarithmic Kumawakamaru and Borb reduction formula.'
								help={
									<p>
										Uses the alternate logarithmic Kumawakamaru and Borb reduction formula from the original
										calculator.
									</p>
								}
								icon={<Gauge aria-hidden='true' className='h-4 w-4' />}
								label='root2'
								onCheckedChange={(checked) => updateInput('root2', checked)}
							/>
						</EditorTableBody>
					</EditorTable>
				</SectionCard>

				<SectionCard
					defaultOpen
					description='Calculated monsters per zone, duration, and pace.'
					title='Output'
				>
					<EditorTable
						className='border-(--color-line-subtle)'
						label='Instakill calculator results'
						tableClassName='w-full table-fixed'
					>
						<colgroup>
							<col className='w-18 sm:w-22' />
							<col className='w-[42%] sm:w-auto' />
							<col className='w-[30%] sm:w-64' />
						</colgroup>
						<EditorTableHead>
							<tr>
								<EditorTableHeaderCell>Icon</EditorTableHeaderCell>
								<EditorTableHeaderCell>Metric</EditorTableHeaderCell>
								<EditorTableHeaderCell className='text-left sm:text-right'>Value</EditorTableHeaderCell>
							</tr>
						</EditorTableHead>
						<EditorTableBody>
							<ResultMetricRow
								detail={formatEffectiveMonsters(calculation.startMonstersPerZone)}
								icon={<Calculator aria-hidden='true' className='h-4 w-4' />}
								label='Start MPZ'
								value={formatMetric(calculation.rawStartMonstersPerZone)}
							/>
							<ResultMetricRow
								detail={formatEffectiveMonsters(calculation.endMonstersPerZone)}
								icon={<Calculator aria-hidden='true' className='h-4 w-4' />}
								label='End MPZ'
								value={formatMetric(calculation.rawEndMonstersPerZone)}
							/>
							<ResultMetricRow
								detail={`${formatNumber(calculation.zonesTotal)} zones`}
								icon={<Timer aria-hidden='true' className='h-4 w-4' />}
								label='Duration'
								value={calculation.durationLabel}
							/>
							<ResultMetricRow
								detail={`${formatNumber(Math.round(calculation.framesTotal))} frames`}
								icon={<Gauge aria-hidden='true' className='h-4 w-4' />}
								label='Zones/hour'
								value={formatMetric(calculation.zonesPerHour)}
							/>
							<ResultMetricRow
								detail='Kumawakamaru and Borb'
								icon={<Zap aria-hidden='true' className='h-4 w-4' />}
								label='MPZ reduction'
								value={formatMetric(calculation.mpzReduction)}
							/>
							<ResultMetricRow
								detail={inputs.acInstakill ? '14 kill frames' : '15 kill frames'}
								icon={<Gauge aria-hidden='true' className='h-4 w-4' />}
								label='Timing'
								value={`${formatMetric(calculation.inputs.fps)} FPS`}
							/>
						</EditorTableBody>
					</EditorTable>
				</SectionCard>
			</PanelSection>
		</>
	);
};
