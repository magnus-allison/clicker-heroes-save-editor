import type { FC, ReactNode } from 'react';

interface ListProps {
	children: ReactNode;
}

interface ItemProps {
	children: ReactNode;
}

export const GuideList: FC<ListProps> = ({ children }) => (
	<ul className='flex max-w-3xl flex-col gap-3'>{children}</ul>
);

/** The marker sits on the first line's centre: `top` is half of `leading-7` less half its own height. */
export const GuideListItem: FC<ItemProps> = ({ children }) => (
	<li className='relative pl-5 text-[13px] leading-7 text-(--color-fg-secondary) before:absolute before:left-0.5 before:top-[0.75rem] before:h-1.5 before:w-1.5 before:rounded-[2px] before:bg-(--color-primary-line)'>
		{children}
	</li>
);
