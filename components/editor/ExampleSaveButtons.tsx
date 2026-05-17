'use client';

import posthog from 'posthog-js';

import { Button } from '@/components/ui/Button';
import { examples as defaultExamples, type ExampleSave } from '@/lib/data/example-saves';

type Props = {
	customExamples?: ExampleSave[];
	onSelect: (save: string) => void;
};

export const ExampleSaveButtons = ({ customExamples, onSelect }: Props) => {
	const examples = customExamples && customExamples.length > 0 ? customExamples : defaultExamples;

	return (
		<div className='mt-2 flex flex-col gap-1.5'>
			<p className='text-left text-[11px] uppercase tracking-wider text-(--color-text-dim) ml-2 py-2'>
				-- Load an Example Save --
			</p>
			<div className='flex flex-wrap gap-1.5'>
				{examples.map((example) => (
					<Button
						className='h-7 px-2.5 text-[11px] text-(--color-text-secondary)'
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
