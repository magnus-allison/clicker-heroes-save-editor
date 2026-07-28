import type { FC, ReactNode } from 'react';

interface ListProps {
	children: ReactNode;
}

interface ItemProps {
	children: ReactNode;
}

export const GuideList: FC<ListProps> = ({ children }) => (
	<ul className='flex flex-col gap-2.5'>{children}</ul>
);

export const GuideListItem: FC<ItemProps> = ({ children }) => (
	<li className='relative pl-4 text-[13px] leading-6 text-(--color-fg-secondary) before:absolute before:left-0 before:top-[0.65rem] before:h-1 before:w-1 before:rounded-full before:bg-(--color-primary)'>
		{children}
	</li>
);
