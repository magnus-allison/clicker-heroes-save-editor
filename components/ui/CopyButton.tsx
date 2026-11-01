'use client';

import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';
import { cn } from 'cn';

type Props = {
	text: string;
	onCopied?: () => void;
	/** Called when the clipboard write is blocked or unavailable. */
	onCopyFailed?: () => void;
	idleLabel?: string;
	successLabel?: string;
	variant?: 'primary' | 'secondary' | 'subtle' | 'ghost';
	size?: 'sm' | 'md';
	disabled?: boolean;
	className?: string;
};

export const CopyButton = ({
	className,
	disabled,
	idleLabel,
	onCopied,
	onCopyFailed,
	size = 'md',
	successLabel,
	text,
	variant = 'ghost'
}: Props) => {
	const t = useTranslations('common.ui');
	const [isCopied, setIsCopied] = useState(false);
	const idle = idleLabel ?? t('copy');
	const success = successLabel ?? t('copied');

	useEffect(() => {
		if (!isCopied) {
			return undefined;
		}

		const timeoutId = window.setTimeout(() => setIsCopied(false), 1200);
		return () => window.clearTimeout(timeoutId);
	}, [isCopied]);

	return (
		<Button
			aria-label={isCopied ? success : idle}
			className={cn(
				'h-10 w-10 border-transparent bg-transparent p-0 disabled:border-transparent disabled:bg-transparent disabled:opacity-45',
				className
			)}
			disabled={disabled || !text}
			onClick={() => {
				// `navigator.clipboard` is undefined on insecure origins and
				// rejects when permission is denied, so this must never be an
				// unhandled rejection.
				void (async () => {
					try {
						await navigator.clipboard.writeText(text);
						setIsCopied(true);
						onCopied?.();
					} catch {
						onCopyFailed?.();
					}
				})();
			}}
			size={size}
			variant={variant}
		>
			{isCopied ? (
				<Check aria-hidden='true' className='h-4 w-4' />
			) : (
				<Copy aria-hidden='true' className='h-4 w-4' />
			)}
		</Button>
	);
};
