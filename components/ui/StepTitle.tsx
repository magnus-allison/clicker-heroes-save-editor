import type { ReactNode } from 'react';

interface Props {
	title: string;
	step: number;
	trailing?: ReactNode;
}

export const StepTitle = ({ title, step, trailing }: Props) => (
	<h2 className='flex items-center gap-2 px-3 py-2.5 text-md uppercase tracking-wider text-(--color-text-strong) sm:px-4 font-semibold'>
		<StepPill number={step} />
		{title}
		{trailing ? <span className='ml-auto'>{trailing}</span> : null}
	</h2>
);

interface StepPillProps {
	number: number;
}

const StepPill = ({ number }: StepPillProps) => (
	<span className='inline-flex h-6 shrink-0 items-center justify-center rounded-full border border-(--color-primary-border) bg-(--color-primary-dim) px-2 text-[10px] font-bold tracking-wide text-(--color-primary)'>
		Step {number}
	</span>
);
