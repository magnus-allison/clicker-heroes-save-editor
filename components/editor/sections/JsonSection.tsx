'use client';

import { startTransition, useState } from 'react';

import posthog from 'posthog-js';

import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { SectionCard } from '@/components/ui/SectionCard';
import { TextInput } from '@/components/ui/TextInput';
import { useSaveStore } from '@/lib/save-store';
import type { SaveData } from '@/lib/save-utils';

type Props = {
	defaultOpen?: boolean;
	showToast: (message: string) => void;
};

export const JsonSection = ({ defaultOpen, showToast }: Props) => {
	const loadSave = useSaveStore((state) => state.loadSave);
	const saveData = useSaveStore((state) => state.saveData);
	const [inputValue, setInputValue] = useState('');
	const [outputValue, setOutputValue] = useState('');
	const isJsonInputEmpty = inputValue.trim().length === 0;

	return (
		<SectionCard
			defaultOpen={defaultOpen}
			description='Round-trip the full save through JSON for power-user workflows.'
			title='JSON Editor'
		>
			<div className='grid gap-5 lg:grid-cols-2'>
				<div className='border border-(--color-border) bg-(--color-bg-soft) p-4'>
					<div className='flex items-center justify-between gap-3'>
						<p className='text-[11px] uppercase tracking-[0.08em] text-(--color-text-dim)'>
							Export to JSON
						</p>
						<CopyButton
							idleLabel='Copy JSON'
							onCopied={() => showToast('JSON copied.')}
							text={outputValue}
						/>
					</div>
					<TextInput
						className='mt-3'
						multiline
						placeholder='JSON output will appear here...'
						readOnly
						rows={10}
						selectOnFocus
						value={outputValue}
					/>
					<div className='mt-4 max-w-70'>
						<Button
							disabled={!saveData}
							onClick={() => {
								if (!saveData) {
									showToast('Load a save before exporting JSON.');
									return;
								}

								setOutputValue(JSON.stringify(saveData, null, 2));
							posthog.capture('json_exported');
							}}
							variant='primary'
						>
							Convert Save to JSON
						</Button>
					</div>
				</div>

				<div className='border border-(--color-border) bg-(--color-bg) p-4'>
					<div className='flex items-center justify-between gap-3'>
						<p className='text-[11px] uppercase tracking-[0.08em] text-(--color-text-dim)'>
							Import from JSON
						</p>
						<CopyButton
							idleLabel='Copy JSON'
							onCopied={() => showToast('JSON copied.')}
							text={inputValue}
						/>
					</div>
					<TextInput
						className='mt-3'
						multiline
						onValueChange={setInputValue}
						placeholder='Paste JSON here...'
						rows={10}
						value={inputValue}
					/>
					<div className='mt-4 max-w-70'>
						<Button
							disabled={isJsonInputEmpty}
							onClick={() => {
								try {
									const parsed = JSON.parse(inputValue) as SaveData;
									if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
										throw new Error('JSON must parse to an object.');
									}

									startTransition(() => {
										loadSave(parsed);
									});
									showToast('JSON loaded into the editor.');
									posthog.capture('json_imported');
								} catch (error) {
									posthog.captureException(error);
									showToast(
										error instanceof Error ? error.message : 'Failed to import JSON.'
									);
								}
							}}
							variant='primary'
						>
							Convert JSON to Save
						</Button>
					</div>
				</div>
			</div>
		</SectionCard>
	);
};
