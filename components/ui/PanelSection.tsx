import { cn } from '@/lib/cn';
import { type FC } from 'react';

interface Props {
	children: React.ReactNode;
	hasPadding?: boolean;
	className?: string;
}

export const PanelSection: FC<Props> = ({ hasPadding, children, className }) => {
	return (
		<div
			className={cn(
				`w-full overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-bg-alt) shadow-[0_2px_8px_var(--color-shadow)]`,
				hasPadding && 'p-5 flex-wrap flex',
				className
			)}

			// mx-auto flex flex-wrap gap-0 rounded-(--box-radius) border border-(--color-border) bg-(--color-bg-alt) p-5 shadow-[0_2px_8px_var(--color-shadow)]
		>
			{children}
		</div>
	);
};
