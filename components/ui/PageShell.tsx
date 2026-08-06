import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

type Props = {
	children: ReactNode;
};

export const PageShell = ({ children }: Props) => {
	return (
		<div className='flex min-h-screen w-full justify-center overflow-x-hidden p-5 sm:p-9'>
			<main className={cn('flex w-full flex-col max-w-292 gap-10')}>{children}</main>
		</div>
	);
};
