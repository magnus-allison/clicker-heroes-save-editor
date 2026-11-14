'use client';

import { LinkIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { MouseEvent } from 'react';

import { useToast } from '@/components/ui/ToastProvider';
import { cn } from 'cn';

interface Props {
	/** The target element's id. Keep it the same in every locale so shared links keep working. */
	anchor: string;
	/** The section's visible name, for the accessible label. */
	label: string;
	className?: string;
}

/**
 * The small link icon beside a linkable heading. Clicking it copies the
 * section's URL rather than jumping to it, since the reader is already there.
 * Callers decide when it shows (usually on hover of the heading row).
 */
export const AnchorLink = ({ anchor, className, label }: Props) => {
	const t = useTranslations('common.ui');
	const { showToast } = useToast();

	const copyLink = async (event: MouseEvent<HTMLAnchorElement>) => {
		// Stay put: the link is for sharing, not for jumping to its own header.
		event.preventDefault();
		const url = new URL(window.location.href);
		url.hash = anchor;
		window.history.replaceState(window.history.state, '', url);

		try {
			await navigator.clipboard.writeText(url.toString());
			showToast(t('linkCopied'));
		} catch {
			showToast(t('linkCopyFailed'));
		}
	};

	return (
		<a
			aria-label={t('copyLink', { section: label })}
			className={cn(
				'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-(--radius-control) text-(--color-fg-dim) transition-[opacity,color] duration-150 hover:text-(--color-primary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-strong',
				className
			)}
			href={`#${anchor}`}
			onClick={(event) => {
				void copyLink(event);
			}}
			title={t('copyLink', { section: label })}
		>
			<LinkIcon aria-hidden='true' className='h-3.5 w-3.5' />
		</a>
	);
};
