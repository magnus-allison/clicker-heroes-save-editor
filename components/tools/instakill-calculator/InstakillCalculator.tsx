'use client';

import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Calculator, Gauge, RotateCcw, Timer, Zap } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { EditorTable, EditorTableBody, EditorTableHead } from '@/components/ui/EditorTable';
import { EditorImage } from '@/components/ui/EditorImage';
import { HelpToolTip } from '@/components/ui/HelpToolTip';
import { NumberInput } from '@/components/ui/NumberInput';
import { PanelSection } from '@/components/ui/PanelSection';
import { SectionCard } from '@/components/ui/SectionCard';
import {
	calculateInstakill,
	defaultInstakillInputs,
	type InstakillCalculatorInputs
} from '@/lib/instakill-calculator';
import { PageHeading } from '@/components/ui/PageHeading';

const kumawakamaruImageSrc = 'https://static.wikia.nocookie.net/clickerheroes/images/3/37/Kumawakamaru.png';
const borbImageSrc = 'https://static.wikia.nocookie.net/clickerheroes/images/b/bd/Outsider_borb.png';

const wholeNumberFormat = new Intl.NumberFormat('en-US', {
	maximumFractionDigits: 0
});
const decimalFormat = new Intl.NumberFormat('en-US', {
	maximumFractionDigits: 2,
	minimumFractionDigits: 2
});

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
		<div className='flex min-h-screen w-full justify-center overflow-x-hidden p-5 sm:p-10'>
			<main className='flex w-full max-w-6xl flex-col gap-3'>
				<PageHeading
					title='Clicker Heroes Instakill Calculator'
					subtitle='Estimate instakill travel time for Clicker Heroes 1e10 and newer.'
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
						<EditorTable className='border-(--color-border-subtle)' tableClassName='w-full table-fixed'>
							<colgroup>
								<col className='w-18 sm:w-22' />
								<col className='w-[38%] sm:w-auto' />
								<col className='w-[34%] sm:w-72' />
							</colgroup>
							<EditorTableHead>
								<tr>
									<th className='px-3 py-3 sm:px-4'>Image</th>
									<th className='px-3 py-3 sm:px-4'>Item</th>
									<th className='px-3 py-3 text-left sm:px-4 sm:text-right'>Value</th>
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
											Uses the alternate logarithmic Kumawakamaru and Borb reduction
											formula from the original calculator.
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
						<EditorTable className='border-(--color-border-subtle)' tableClassName='w-full table-fixed'>
							<colgroup>
								<col className='w-18 sm:w-22' />
								<col className='w-[42%] sm:w-auto' />
								<col className='w-[30%] sm:w-64' />
							</colgroup>
							<EditorTableHead>
								<tr>
									<th className='px-3 py-3 sm:px-4'>Icon</th>
									<th className='px-3 py-3 sm:px-4'>Metric</th>
									<th className='px-3 py-3 text-left sm:px-4 sm:text-right'>Value</th>
								</tr>
							</EditorTableHead>
							<EditorTableBody>
								<ResultMetricRow
									detail={formatEffectiveMonsters(calculation.startMonstersPerZone)}
									icon={<Calculator aria-hidden='true' className='h-4 w-4' />}
									label='Start MPZ'
									value={decimalFormat.format(calculation.rawStartMonstersPerZone)}
								/>
								<ResultMetricRow
									detail={formatEffectiveMonsters(calculation.endMonstersPerZone)}
									icon={<Calculator aria-hidden='true' className='h-4 w-4' />}
									label='End MPZ'
									value={decimalFormat.format(calculation.rawEndMonstersPerZone)}
								/>
								<ResultMetricRow
									detail={`${wholeNumberFormat.format(calculation.zonesTotal)} zones`}
									icon={<Timer aria-hidden='true' className='h-4 w-4' />}
									label='Duration'
									value={calculation.durationLabel}
								/>
								<ResultMetricRow
									detail={`${wholeNumberFormat.format(Math.round(calculation.framesTotal))} frames`}
									icon={<Gauge aria-hidden='true' className='h-4 w-4' />}
									label='Zones/hour'
									value={decimalFormat.format(calculation.zonesPerHour)}
								/>
								<ResultMetricRow
									detail='Kumawakamaru and Borb'
									icon={<Zap aria-hidden='true' className='h-4 w-4' />}
									label='MPZ reduction'
									value={decimalFormat.format(calculation.mpzReduction)}
								/>
								<ResultMetricRow
									detail={inputs.acInstakill ? '14 kill frames' : '15 kill frames'}
									icon={<Gauge aria-hidden='true' className='h-4 w-4' />}
									label='Timing'
									value={`${decimalFormat.format(calculation.inputs.fps)} FPS`}
								/>
							</EditorTableBody>
						</EditorTable>
					</SectionCard>
				</PanelSection>
			</main>
		</div>
	);
};

type TableImageProps = {
	alt: string;
	src: string;
};

const TableImage = ({ alt, src }: TableImageProps) => (
	<EditorImage alt={alt} className='h-11 w-11 object-contain' size={44} src={src} />
);

type MetricIconProps = {
	children: ReactNode;
};

const MetricIcon = ({ children }: MetricIconProps) => (
	<div className='flex h-11 w-11 items-center justify-center rounded-(--input-radius) border border-(--color-primary-border)/45 bg-(--color-primary-dim) text-(--color-primary)'>
		{children}
	</div>
);

type CalculatorFieldRowProps = {
	allowDecimal?: boolean;
	description: string;
	id: string;
	imageAlt: string;
	imageSrc: string;
	label: string;
	onCommit: (value: number) => void;
	value: number;
};

const CalculatorFieldRow = ({
	allowDecimal = true,
	description,
	id,
	imageAlt,
	imageSrc,
	label,
	onCommit,
	value
}: CalculatorFieldRowProps) => (
	<tr className='align-middle not-last:border-b not-last:border-(--color-border-subtle)'>
		<td className='px-3 py-3 sm:px-4'>
			<TableImage alt={imageAlt} src={imageSrc} />
		</td>
		<td className='px-3 py-3 sm:px-4'>
			<label className='block text-[13px] font-semibold text-(--color-text)' htmlFor={id}>
				{label}
			</label>
			<p className='mt-0.5 text-[12px] text-(--color-text-muted)'>{description}</p>
		</td>
		<td className='px-3 py-3 sm:px-4'>
			<NumberInput
				allowDecimal={allowDecimal}
				ariaLabel={label}
				compact
				id={id}
				onCommit={onCommit}
				selectOnFocus
				value={value}
			/>
		</td>
	</tr>
);

type CalculatorCheckboxRowProps = {
	checked: boolean;
	description: string;
	help?: ReactNode;
	icon: ReactNode;
	label: string;
	onCheckedChange: (checked: boolean) => void;
};

const CalculatorCheckboxRow = ({
	checked,
	description,
	help,
	icon,
	label,
	onCheckedChange
}: CalculatorCheckboxRowProps) => (
	<tr className='align-middle not-last:border-b not-last:border-(--color-border-subtle)'>
		<td className='px-3 py-3 sm:px-4'>
			<MetricIcon>{icon}</MetricIcon>
		</td>
		<td className='px-3 py-3 sm:px-4'>
			<div className='flex min-w-0 items-center gap-3'>
				<div className='min-w-0'>
					<p className='text-[13px] font-semibold text-(--color-text)'>{label}</p>
					<p className='mt-0.5 text-[12px] text-(--color-text-muted)'>{description}</p>
				</div>
				{help ? (
					<HelpToolTip contentClassName='max-w-90' title={label}>
						{help}
					</HelpToolTip>
				) : null}
			</div>
		</td>
		<td className='px-3 py-3 sm:px-4'>
			<div className='flex justify-start sm:justify-end'>
				<Checkbox ariaLabel={label} checked={checked} onCheckedChange={onCheckedChange} />
			</div>
		</td>
	</tr>
);

type ResultMetricProps = {
	detail: string;
	icon: ReactNode;
	label: string;
	value: string;
};

const ResultMetricRow = ({ detail, icon, label, value }: ResultMetricProps) => (
	<tr className='align-middle not-last:border-b not-last:border-(--color-border-subtle)'>
		<td className='px-3 py-3 sm:px-4'>
			<MetricIcon>{icon}</MetricIcon>
		</td>
		<td className='px-3 py-3 sm:px-4'>
			<p className='text-[13px] font-semibold text-(--color-text)'>{label}</p>
			<p className='mt-0.5 text-[12px] text-(--color-text-muted)'>{detail}</p>
		</td>
		<td className='px-3 py-3 text-left sm:px-4 sm:text-right'>
			<p className='wrap-break-word text-lg font-semibold leading-tight text-(--color-text-strong)'>
				{value}
			</p>
		</td>
	</tr>
);

function formatEffectiveMonsters(value: number) {
	return `Effective ${decimalFormat.format(value)}`;
}
