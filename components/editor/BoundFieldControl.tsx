'use client';

import { Checkbox } from '@/components/ui/Checkbox';
import { Dropdown } from '@/components/ui/Dropdown';
import { NumberInput } from '@/components/ui/NumberInput';
import { TextInput } from '@/components/ui/TextInput';
import type { SimpleFieldConfig } from '@/lib/data/editor-config';
import { toFiniteNumber } from '@/lib/format';
import { useSaveStore } from '@/lib/save-store';
import {
	getValueAtPath,
	hasPath,
	toSelectValue,
	type PathSegment,
	type SelectOption
} from '@/lib/save-utils';

type Props = {
	path: PathSegment[];
	kind: SimpleFieldConfig['kind'];
	allowMissing?: boolean;
	options?: readonly SelectOption[];
	selectOnFocus?: boolean;
	inputClassName?: string;
	/** Accessible name for the control. Falls back to the save path. */
	label?: string;
};

export const BoundFieldControl = ({
	allowMissing,
	inputClassName,
	kind,
	label,
	options,
	path,
	selectOnFocus
}: Props) => {
	const saveData = useSaveStore((state) => state.saveData);
	const updateValue = useSaveStore((state) => state.updateValue);
	const fieldValue = saveData ? getValueAtPath(saveData, path) : undefined;
	const isDisabled = !saveData || (!allowMissing && !hasPath(saveData, path));
	const alignedControlClassName = 'w-full sm:ml-auto sm:w-fit sm:max-w-full';
	const accessibleName = label ?? path.join('.');

	if (kind === 'checkbox') {
		return (
			<div className='flex w-full justify-start sm:ml-auto sm:w-fit sm:max-w-full'>
				<Checkbox
					ariaLabel={accessibleName}
					checked={Boolean(fieldValue)}
					disabled={isDisabled}
					onCheckedChange={(checked) => updateValue(path, checked)}
				/>
			</div>
		);
	}

	if (kind === 'select') {
		return (
			<div className={alignedControlClassName}>
				<Dropdown
					aria-label={accessibleName}
					className='sm:min-w-56'
					disabled={isDisabled}
					onChange={(event) => {
						const selectedOption = options?.find(
							(option) => String(option.value) === event.target.value
						);

						if (selectedOption) {
							updateValue(path, selectedOption.value);
							return;
						}

						// No option matched. Writing the raw string back would put
						// `"3"` into a field the game reads as a number, so numeric
						// fields either take a parsed number or are left untouched.
						const isNumericField =
							typeof fieldValue === 'number' ||
							(options !== undefined &&
								options.length > 0 &&
								options.every((option) => typeof option.value === 'number'));

						if (!isNumericField) {
							updateValue(path, event.target.value);
							return;
						}

						const numericValue = toFiniteNumber(event.target.value);
						if (numericValue !== null) {
							updateValue(path, numericValue);
						}
					}}
					options={options ?? []}
					value={toSelectValue(fieldValue as string | number | undefined)}
				/>
			</div>
		);
	}

	if (kind === 'number') {
		return (
			<NumberInput
				allowDecimal
				ariaLabel={accessibleName}
				disabled={isDisabled}
				inputClassName={inputClassName}
				onCommit={(value) => updateValue(path, value)}
				selectOnFocus={selectOnFocus}
				value={typeof fieldValue === 'number' || typeof fieldValue === 'string' ? fieldValue : 0}
			/>
		);
	}

	return (
		<div className={alignedControlClassName}>
			<TextInput
				ariaLabel={accessibleName}
				className='sm:min-w-56'
				disabled={isDisabled}
				onCommit={(value) => updateValue(path, value)}
				selectOnFocus={selectOnFocus}
				value={fieldValue == null ? '' : String(fieldValue)}
			/>
		</div>
	);
};
