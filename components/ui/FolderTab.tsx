import type { LucideIcon } from 'lucide-react';

import { cn } from 'cn';

/**
 * The folder tab that stands up off a panel's top edge (see `.glass-tab` in
 * globals.css for how it joins the panel). The tab pulls 1px left so its
 * border lands in the column the panel's ring occupies; a tab that starts
 * partway along the panel instead passes `ml-0`.
 */
export const folderTabClassName =
	'glass-tab relative z-10 -ml-px flex w-fit min-w-0 items-center gap-3 rounded-t-xl px-5 pt-3 pb-2.5';

export const folderTabTitleClassName =
	'font-aeonik min-w-0 text-[1.05rem] leading-snug font-semibold tracking-wide uppercase text-fg-strong [word-spacing:0.2em]';

export const folderTabIconClassName = 'h-4.5 w-4.5 shrink-0 text-fg pt-0.5';

type Props = {
	icon?: LucideIcon;
	title: string;
	className?: string;
};

/**
 * A static tab: a label on a panel. Hidden from assistive tech, since the
 * section it names keeps its own heading for screen readers.
 */
export const FolderTab = ({ className, icon: Icon, title }: Props) => (
	<div aria-hidden='true' className={cn(folderTabClassName, className)}>
		{Icon ? <Icon className={folderTabIconClassName} /> : null}
		<span className={folderTabTitleClassName}>{title}</span>
	</div>
);
