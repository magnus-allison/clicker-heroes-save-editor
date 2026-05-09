'use client';

import { Button } from '@/components/ui/Button';
import { examples } from '@/lib/data/example-saves';

type Props = {
	onSelect: (save: string) => void;
};

export const ExampleSaveButtons = ({ onSelect }: Props) => {
	return (
		<div className='mt-2 flex flex-col gap-1.5'>
			<p className='text-[10px] uppercase tracking-[0.14em] text-(--color-text-dim)'>
				Examples
			</p>
			<div className='flex flex-wrap gap-1.5'>
				{examples.map((example) => (
					<Button
						className='h-7 px-2.5 text-[11px] text-(--color-text-secondary)'
						key={example.name}
						onClick={() => onSelect(example.save)}
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
