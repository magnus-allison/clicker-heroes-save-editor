'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';
import { FieldDivider } from '@/components/ui/FieldDivider';
import { examples as defaultExamples, type ExampleSave } from '@/lib/data/example-saves';
import { Pill } from '../ui/Pill';

type Props = {
	customExamples?: ExampleSave[];
	onSelect: (save: string) => void;
};

export const ExampleSaveButtons = ({ customExamples, onSelect }: Props) => {
	const t = useTranslations('editor');
	const examples = customExamples && customExamples.length > 0 ? customExamples : defaultExamples;

	return (
		<div className='flex flex-col gap-2.5'>
			<FieldDivider label={t('importField.orExample')} />
			<div className='flex flex-wrap gap-1.5'>
				{examples.map((example) => (
					<Pill
						className='cursor-pointer'
						key={example.key}
						onClick={() => {
							onSelect(example.save);
						}}
					>
						{t(`exampleSaves.${example.key}`)}
					</Pill>
				))}
			</div>
		</div>
	);
};
