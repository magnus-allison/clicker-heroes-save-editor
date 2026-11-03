'use client';

import { type FC, type ReactNode, useRef } from 'react';
import { Maximize2Icon, XIcon } from 'lucide-react';

import { buttonClassName } from '@/components/ui/Button';

interface Props {
	alt: string;
	src: string;
	/** Shown above the enlarged image, e.g. the hero name and state. */
	title: string;
	/** Accessible name for the open button, e.g. "View full image of Cid". */
	viewLabel: string;
	closeLabel: string;
	gilded?: boolean;
	/** The thumbnail frame; it becomes the button that opens the viewer. */
	className: string;
	children: ReactNode;
}

/*
 * Labels arrive as props so the `guides` messages stay server-only. A native
 * `<dialog>` handles focus trapping, Escape, and the top layer for us.
 */
export const ArtworkViewer: FC<Props> = ({
	alt,
	children,
	className,
	closeLabel,
	gilded,
	src,
	title,
	viewLabel
}) => {
	const dialogRef = useRef<HTMLDialogElement>(null);

	return (
		<>
			<button
				aria-label={viewLabel}
				className={`${className} group relative w-full cursor-zoom-in transition-colors hover:border-(--color-line-strong) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-info`}
				onClick={() => dialogRef.current?.showModal()}
				type='button'
			>
				{children}
				<Maximize2Icon
					aria-hidden='true'
					className='absolute right-1.5 top-1.5 h-3.5 w-3.5 text-(--color-fg-dim) transition-colors group-hover:text-fg-strong'
				/>
			</button>
			<dialog
				aria-label={title}
				className='m-auto w-[min(28rem,calc(100vw-2rem))] rounded-2xl border border-(--color-line-soft) bg-(--color-surface-raised) p-0 text-(--color-fg) backdrop:bg-black/70'
				onClick={(event) => {
					// A click on the dialog element itself is a click on the backdrop.
					if (event.target === event.currentTarget) event.currentTarget.close();
				}}
				ref={dialogRef}
			>
				<div className='flex items-center justify-between gap-3 border-b border-(--color-line-soft) py-2 pl-4 pr-2'>
					<p className={`text-[13px] font-semibold ${gilded ? 'text-(--color-gold)' : 'text-fg-strong'}`}>
						{title}
					</p>
					<button
						aria-label={closeLabel}
						className={buttonClassName({ variant: 'ghost', size: 'sm' })}
						onClick={() => dialogRef.current?.close()}
						type='button'
					>
						<XIcon aria-hidden='true' className='h-4 w-4' />
					</button>
				</div>
				<div
					className={`flex h-[min(60vh,28rem)] items-center justify-center p-6 ${
						gilded ? 'bg-(--color-gilded-surface)' : 'bg-(--color-surface-muted)'
					}`}
				>
					<img alt={alt} className='h-full w-full object-contain' src={src} />
				</div>
			</dialog>
		</>
	);
};
