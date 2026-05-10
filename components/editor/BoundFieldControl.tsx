'use client';

import { Checkbox } from '@/components/ui/Checkbox';
import { Dropdown } from '@/components/ui/Dropdown';
import { NumberInput } from '@/components/ui/NumberInput';
import { TextInput } from '@/components/ui/TextInput';
import type { SimpleFieldConfig } from '@/lib/data/editor-config';
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
};

export const BoundFieldControl = ({ allowMissing, kind, options, path, selectOnFocus }: Props) => {
	const saveData = useSaveStore((state) => state.saveData);
	const updateValue = useSaveStore((state) => state.updateValue);
	const fieldValue = saveData ? getValueAtPath(saveData, path) : undefined;
	const isDisabled = !saveData || (!allowMissing && !hasPath(saveData, path));
	const alignedControlClassName = 'w-full sm:ml-auto sm:w-fit sm:max-w-full';

	if (kind === 'checkbox') {
		return (
			<div className='flex w-full justify-start sm:ml-auto sm:w-fit sm:max-w-full'>
				<Checkbox
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
					className='sm:min-w-56'
					disabled={isDisabled}
					onChange={(event) => {
						const selectedOption = options?.find(
							(option) => String(option.value) === event.target.value
						);
						updateValue(path, selectedOption?.value ?? event.target.value);
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
				disabled={isDisabled}
				onCommit={(value) => updateValue(path, value)}
				selectOnFocus={selectOnFocus}
				value={typeof fieldValue === 'number' || typeof fieldValue === 'string' ? fieldValue : 0}
			/>
		);
	}

	return (
		<div className={alignedControlClassName}>
			<TextInput
				className='sm:min-w-56'
				disabled={isDisabled}
				onCommit={(value) => updateValue(path, value)}
				selectOnFocus={selectOnFocus}
				value={fieldValue == null ? '' : String(fieldValue)}
			/>
		</div>
	);
};
