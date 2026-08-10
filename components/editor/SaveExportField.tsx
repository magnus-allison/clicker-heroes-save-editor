'use client';

import type { ReactNode } from 'react';

import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { StepTitle } from '@/components/ui/StepTitle';
import { TextInput } from '@/components/ui/TextInput';
import { useToast } from '@/components/ui/ToastProvider';
import { FileDownIcon } from 'lucide-react';
import { Pill } from '../ui/Pill';

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
	/** Shines the step pill while exporting is the thing left to do. */
	isActiveStep?: boolean;
	/**
	 * Rendered between the output field and the action button. Used for the
	 * change summary, which belongs with the string it describes.
	 */
	belowOutput?: ReactNode;
};

/**
 * The output half of the save panel: the encoded string, a copy button, the
 * action that produces it, and the backup warning. Deliberately unnumbered —
 * it shares a card with step 1 while the numbered steps continue below it.
 */
export const SaveExportField = ({
	actionLabel,
	ariaLabel,
	belowOutput,
	dataLabel,
	isActiveStep = false,
	onAction,
	onValueChange,
	placeholder,
	title,
	value
}: Props) => {
	const { showToast } = useToast();

	return (
		<section className='flex min-w-0 flex-col border-t border-shadow px-1 lg:border-l lg:border-t-0'>
			<div className='p-5'>
				<span className='flex items-center gap-2'>
					<span className='flex items-center justify-center transition-[background-color] duration-200'>
						<FileDownIcon aria-hidden='true' className='h-5 w-5' />
					</span>
					<Pill className='ml-auto' isShining={isActiveStep}>
						Step 3
					</Pill>
				</span>
				<span className='mt-5 block text-[1.1rem] font-medium text-fg-strong mb-7 uppercase'>
					Export your save data
				</span>

				<div className='flex flex-1 flex-col gap-2.5'>
					<div className='flex min-w-0 items-start gap-2'>
						<TextInput
							ariaLabel={ariaLabel}
							className='min-h-33'
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
					{belowOutput}
					<Button fullWidth onClick={onAction} variant='primary'>
						{actionLabel}
					</Button>
				</div>
			</div>
			<p className='mt-auto text-[12px] leading-5 text-fg-dim/65 italic p-5'>
				* Always keep a backup of your original save before importing {dataLabel} back into the game.
			</p>
		</section>
	);
};
