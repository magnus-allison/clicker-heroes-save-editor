'use client';

import posthog from 'posthog-js';

import { Button } from '@/components/ui/Button';
import { FieldDivider } from '@/components/ui/FieldDivider';
import { examples as defaultExamples, type ExampleSave } from '@/lib/data/example-saves';

type Props = {
	customExamples?: ExampleSave[];
	onSelect: (save: string) => void;
};

export const ExampleSaveButtons = ({ customExamples, onSelect }: Props) => {
	const examples = customExamples && customExamples.length > 0 ? customExamples : defaultExamples;

	return (
		<div className='flex flex-col gap-2.5'>
			<FieldDivider label='or load an example save' />
			<div className='flex flex-wrap gap-1.5'>
				{examples.map((example) => (
					<Button
						className='h-7 px-2.5 text-[11px] text-(--color-fg-secondary)'
						key={example.name}
						onClick={() => {
							posthog.capture('example_save_loaded', { example_name: example.name });
							onSelect(example.save);
						}}
						size='sm'
						variant='secondary'
					>
						{example.name}
					</Button>
				))}
			</div>
		</div>
	);
};
