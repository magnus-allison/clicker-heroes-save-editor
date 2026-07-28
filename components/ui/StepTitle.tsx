import type { ReactNode } from 'react';

interface Props {
	title: string;
	step: number;
	trailing?: ReactNode;
}

/**
 * Numbered step header used by the tool flows. Owns its own horizontal
 * padding — callers must not wrap it in a spacer, or steps stop lining up
 * with each other.
 */
export const StepTitle = ({ title, step, trailing }: Props) => (
	<h2 className='flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-(--color-fg-strong)'>
		<StepPill number={step} />
		{title}
		{trailing ? <span className='ml-auto'>{trailing}</span> : null}
	</h2>
);

interface StepPillProps {
	number: number;
}

const StepPill = ({ number }: StepPillProps) => (
	<span className='inline-flex h-6 shrink-0 items-center justify-center rounded-full border border-(--color-primary-line) bg-(--color-primary-soft) px-2 text-[10px] font-bold tracking-[0.08em] text-(--color-primary)'>
		Step {number}
	</span>
);
