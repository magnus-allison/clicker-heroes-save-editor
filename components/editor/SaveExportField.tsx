'use client';

import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { TextInput } from '@/components/ui/TextInput';
import { useToast } from '@/components/ui/ToastProvider';

type Props = {
	title: string;
	/** Accessible name for the output field, which is otherwise unlabelled. */
	ariaLabel: string;
	placeholder: string;
	value: string;
	onValueChange: (value: string) => void;
	actionLabel: string;
	onAction: () => void;
	/**
	 * What the user is about to put back into the game — "edited data",
	 * "converted data" — used in the backup warning.
	 */
	dataLabel: string;
};

/**
 * The output half of the save panel: the encoded string, a copy button, the
 * action that produces it, and the backup warning. Deliberately unnumbered —
 * it shares a card with step 1 while the numbered steps continue below it.
 */
export const SaveExportField = ({
	actionLabel,
	ariaLabel,
	dataLabel,
	onAction,
	onValueChange,
	placeholder,
	title,
	value
}: Props) => {
	const { showToast } = useToast();

	return (
		<section className='flex min-w-0 flex-col border-t border-(--color-line-soft) px-1 lg:border-l lg:border-t-0'>
			<h2 className='flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-(--color-fg-strong)'>
				{title}
			</h2>
			<div className='flex flex-1 flex-col gap-2.5 p-3 sm:p-4'>
				<div className='flex min-w-0 items-start gap-2'>
					<TextInput
						ariaLabel={ariaLabel}
						className='min-h-32'
						multiline
						onValueChange={onValueChange}
						placeholder={placeholder}
						resizable
						value={value}
					/>
					<CopyButton
						className='min-w-10 px-0'
						idleLabel='Copy'
						onCopied={() => showToast('Text copied.')}
						onCopyFailed={() => showToast('Copying is not available in this browser.')}
						text={value}
					/>
				</div>
				<div className='flex flex-wrap gap-2'>
					<Button className='flex-1' onClick={onAction} variant='primary'>
						{actionLabel}
					</Button>
				</div>
				<p className='mt-auto pt-2 pb-1 text-[12px] leading-5 text-(--color-fg-dim)'>
					Always keep a backup of your original save before importing {dataLabel} back into the game.
				</p>
			</div>
		</section>
	);
};
