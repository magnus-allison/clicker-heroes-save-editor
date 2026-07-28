import type { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/cn';
import type { SelectOption } from '@/lib/save-utils';

type Props = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> & {
	options: readonly SelectOption[];
	placeholder?: string;
};

export const Dropdown = ({ className, options, placeholder, value, ...props }: Props) => {
	const ariaLabel = props['aria-label'] ?? placeholder ?? 'Select option';

	return (
		<div className='group relative'>
			<select
				aria-label={ariaLabel}
				className={cn(
					'h-10 w-full appearance-none rounded-(--radius-control) border border-line bg-(--color-surface) px-2.5 pr-8 text-[13px] text-(--color-fg) shadow-[inset_0_1px_2px_var(--color-shadow)] outline-none transition-[border-color,box-shadow,background-color] duration-150 ease-snap hover:border-(--color-line-strong) focus:border-(--color-primary-line) focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) disabled:cursor-not-allowed disabled:border-(--color-line-soft) disabled:bg-(--color-surface-sunken) disabled:text-(--color-fg-dim) disabled:shadow-none',
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
			<ChevronDown
				aria-hidden='true'
				className='pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 text-(--color-fg-dim) transition-colors duration-150 group-hover:text-(--color-fg-muted)'
			/>
		</div>
	);
};
