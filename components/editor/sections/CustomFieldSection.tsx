'use client';

import type { LucideIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Checkbox } from '@/components/ui/Checkbox';
import { CollapsiblePanel } from '@/components/ui/CollapsiblePanel';
import { Dropdown } from '@/components/ui/Dropdown';
import { NumberInput } from '@/components/ui/NumberInput';
import { TextInput } from '@/components/ui/TextInput';
import { useSaveStore } from '@/lib/save-store';
import { listPrimitiveKeys } from '@/lib/save-utils';

type Props = {
	defaultOpen?: boolean;
	icon?: LucideIcon;
	title?: string;
};

export const CustomFieldSection = ({ defaultOpen, icon, title }: Props) => {
	const t = useTranslations('editor.customField');
	const saveData = useSaveStore((state) => state.saveData);
	const updateValue = useSaveStore((state) => state.updateValue);
	const options = useMemo(
		() => listPrimitiveKeys(saveData).map((key) => ({ label: key, value: key })),
		[saveData]
	);
	const [selectedKey, setSelectedKey] = useState('');
	const resolvedKey = options.some((option) => option.value === selectedKey)
		? selectedKey
		: String(options[0]?.value ?? '');
	const currentValue = resolvedKey && saveData ? saveData[resolvedKey] : undefined;
	const isDisabled = !saveData || !resolvedKey;

	return (
		<CollapsiblePanel
			defaultOpen={defaultOpen}
			description={t('description')}
			icon={icon}
			title={title ?? t('title')}
		>
			<div className='grid gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]'>
				<div className='space-y-4'>
					<div>
						<p className='mb-2 text-[11px] uppercase tracking-[0.08em] text-(--color-fg-dim)'>
							{t('searchLabel')}
						</p>
						<Dropdown
							disabled={!saveData}
							onChange={(event) => setSelectedKey(event.target.value)}
							options={options}
							placeholder={t('choose')}
							value={resolvedKey}
						/>
					</div>
					<div>
						<p className='mb-2 text-[11px] uppercase tracking-[0.08em] text-(--color-fg-dim)'>
							{t('fieldName')}
						</p>
						<div className='rounded-(--radius-card) border border-(--color-line) bg-(--color-surface-sunken) px-4 py-3 text-[13px] text-(--color-fg) shadow-[inset_0_1px_2px_var(--color-shadow)]'>
							{resolvedKey || t('choose')}
						</div>
					</div>
				</div>

				<div>
					<p className='mb-2 text-[11px] uppercase tracking-[0.08em] text-(--color-fg-dim)'>
						{t('fieldValue')}
					</p>
					{typeof currentValue === 'boolean' ? (
						<div className='rounded-(--radius-card) border border-(--color-line) bg-(--color-surface) px-4 py-3 shadow-[var(--shadow-raised)]'>
							<Checkbox
								checked={currentValue}
								disabled={isDisabled}
								label={t('enabled')}
								onCheckedChange={(checked) => updateValue([resolvedKey], checked)}
							/>
						</div>
					) : typeof currentValue === 'number' ? (
						<NumberInput
							ariaLabel={resolvedKey || t('fieldValue')}
							disabled={isDisabled}
							onCommit={(value) => updateValue([resolvedKey], value)}
							selectOnFocus
							value={currentValue}
						/>
					) : (
						<TextInput
							ariaLabel={resolvedKey || t('fieldValue')}
							disabled={isDisabled}
							onCommit={(value) => updateValue([resolvedKey], value)}
							value={currentValue == null ? '' : String(currentValue)}
						/>
					)}
				</div>
			</div>
		</CollapsiblePanel>
	);
};
