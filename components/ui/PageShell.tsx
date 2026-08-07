import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

type Props = {
	children: ReactNode;
};

export const PageShell = ({ children }: Props) => {
	return (
		<div className='flex min-h-screen w-full justify-center overflow-x-hidden p-4 sm:p-8'>
			<main className={cn('flex w-full flex-col max-w-293 gap-10')}>{children}</main>
		</div>
	);
};
