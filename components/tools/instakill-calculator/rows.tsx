'use client';

import type { ReactNode } from 'react';

import { Checkbox } from '@/components/ui/Checkbox';
import { EditorImage } from '@/components/ui/EditorImage';
import { EditorTableCell, EditorTableRow } from '@/components/ui/EditorTable';
import { HelpToolTip } from '@/components/ui/HelpToolTip';
import { NumberInput } from '@/components/ui/NumberInput';

/**
 * The three row shapes the instakill calculator's input and output tables are
 * built from. They live here so `InstakillCalculator` stays readable.
 */

type MetricIconProps = {
	children: ReactNode;
};

/** Tinted square that stands in for an image in the output table. */
export const MetricIcon = ({ children }: MetricIconProps) => (
	<div className='flex h-11 w-11 items-center justify-center rounded-(--radius-control) border border-(--color-primary-line)/45 bg-(--color-primary-soft) text-(--color-primary) shadow-[var(--shadow-raised)]'>
		{children}
	</div>
);

type RowDescriptionProps = {
	description: string;
	/** Rendered as a `<label>` bound to `htmlFor` when given. */
	htmlFor?: string;
	label: string;
};

const RowDescription = ({ description, htmlFor, label }: RowDescriptionProps) => (
	<>
		{htmlFor ? (
			<label className='block text-[13px] font-semibold text-(--color-fg)' htmlFor={htmlFor}>
				{label}
			</label>
		) : (
			<p className='text-[13px] font-semibold text-(--color-fg)'>{label}</p>
		)}
		<p className='mt-0.5 text-[12px] text-(--color-fg-muted)'>{description}</p>
	</>
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

export const CalculatorFieldRow = ({
	allowDecimal = true,
	description,
	id,
	imageAlt,
	imageSrc,
	label,
	onCommit,
	value
}: CalculatorFieldRowProps) => (
	<EditorTableRow>
		<EditorTableCell>
			<EditorImage alt={imageAlt} className='h-11 w-11 object-contain' size={44} src={imageSrc} />
		</EditorTableCell>
		<EditorTableCell>
			<RowDescription description={description} htmlFor={id} label={label} />
		</EditorTableCell>
		<EditorTableCell>
			<NumberInput
				allowDecimal={allowDecimal}
				ariaLabel={label}
				compact
				id={id}
				onCommit={onCommit}
				selectOnFocus
				value={value}
			/>
		</EditorTableCell>
	</EditorTableRow>
);

type CalculatorCheckboxRowProps = {
	checked: boolean;
	description: string;
	help?: ReactNode;
	icon: ReactNode;
	label: string;
	onCheckedChange: (checked: boolean) => void;
};

export const CalculatorCheckboxRow = ({
	checked,
	description,
	help,
	icon,
	label,
	onCheckedChange
}: CalculatorCheckboxRowProps) => (
	<EditorTableRow>
		<EditorTableCell>
			<MetricIcon>{icon}</MetricIcon>
		</EditorTableCell>
		<EditorTableCell>
			<div className='flex min-w-0 items-center gap-3'>
				<div className='min-w-0'>
					<RowDescription description={description} label={label} />
				</div>
				{help ? <HelpToolTip title={label}>{help}</HelpToolTip> : null}
			</div>
		</EditorTableCell>
		<EditorTableCell>
			<div className='flex justify-start sm:justify-end'>
				<Checkbox ariaLabel={label} checked={checked} onCheckedChange={onCheckedChange} />
			</div>
		</EditorTableCell>
	</EditorTableRow>
);

type ResultMetricRowProps = {
	detail: string;
	icon: ReactNode;
	label: string;
	value: string;
};

export const ResultMetricRow = ({ detail, icon, label, value }: ResultMetricRowProps) => (
	<EditorTableRow>
		<EditorTableCell>
			<MetricIcon>{icon}</MetricIcon>
		</EditorTableCell>
		<EditorTableCell>
			<RowDescription description={detail} label={label} />
		</EditorTableCell>
		<EditorTableCell className='text-left sm:text-right'>
			<p className='wrap-break-word text-lg font-semibold leading-tight text-(--color-fg-strong)'>{value}</p>
		</EditorTableCell>
	</EditorTableRow>
);
