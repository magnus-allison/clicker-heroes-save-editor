import type { SelectHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';
import type { SelectOption } from '@/lib/save-utils';

type Props = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> & {
	options: readonly SelectOption[];
	placeholder?: string;
};

export const Dropdown = ({ className, options, placeholder, value, ...props }: Props) => {
	const ariaLabel = props['aria-label'] ?? placeholder ?? 'Select option';

	return (
		<div className='relative'>
			<select
				aria-label={ariaLabel}
				className={cn(
					'h-10 w-full appearance-none rounded-(--input-radius) border border-(--color-border) bg-(--color-bg) px-2.5 pr-8 text-[13px] text-(--color-text) outline-none transition hover:border-(--color-border-hover) focus:border-(--color-border-hover) focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) disabled:cursor-not-allowed disabled:border-(--color-border-soft) disabled:bg-(--color-bg-soft) disabled:text-(--color-text-dim)',
					className
				)}
				value={value}
				{...props}
			>
				{placeholder ? <option value=''>{placeholder}</option> : null}
				{options.map((option) => (
					<option key={`${option.value}`} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
			<span className='pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-[11px] text-(--color-text-dim)'>
				▾
			</span>
		</div>
	);
};
