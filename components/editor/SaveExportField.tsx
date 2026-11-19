'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import { headingInTabClasses, type HeadingInTab } from '@/components/editor/SaveDataFolder';
import { CopyButton } from '@/components/ui/CopyButton';
import { FieldDivider } from '@/components/ui/FieldDivider';
import { TextInput } from '@/components/ui/TextInput';
import { useToast } from '@/components/ui/ToastProvider';
import { FileDownIcon, MonitorDownIcon, ShieldAlertIcon, TriangleAlertIcon } from 'lucide-react';
import { Pill } from '../ui/Pill';
import { CardTitle } from '../ui/LinkCard';
import { SaveDataButton } from './SaveDataButton';
import { cn } from 'cn';

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
	/** Name given to the downloaded file. */
	fileName?: string;
	/** Set inside `SaveDataFolder`, whose tab shows this field's heading. */
	headingInTab?: HeadingInTab;
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
	fileName = 'clicker-heroes-save.txt',
	headingInTab,
	isActiveStep = false,
	onAction,
	onValueChange,
	placeholder,
	title,
	value
}: Props) => {
	const { showToast } = useToast();
	const t = useTranslations('editor');
	const tCommon = useTranslations('common.ui');
	const tabbed = headingInTab ? headingInTabClasses[headingInTab] : undefined;
	const hasValue = value.trim().length > 0;

	const handleDownload = () => {
		if (!hasValue) {
			showToast(t('exportField.nothingToDownload'));
			return;
		}

		let url: string;

		try {
			url = URL.createObjectURL(new Blob([value], { type: 'text/plain;charset=utf-8' }));
		} catch {
			showToast(t('exportField.downloadUnavailable'));
			return;
		}

		const link = document.createElement('a');
		link.download = fileName;
		link.href = url;
		document.body.append(link);
		link.click();
		link.remove();
		// The blob is only needed for the duration of the click.
		URL.revokeObjectURL(url);
	};

	return (
		<section className='flex min-w-0 flex-col border-t border-shadow lg:border-l lg:border-t-0'>
			<div className='flex flex-1 flex-col p-5'>
				<span className={cn('flex items-center gap-2', tabbed?.row)}>
					<span
						className={cn(
							'flex items-center justify-center transition-[background-color] duration-200',
							tabbed?.icon
						)}
					>
						<FileDownIcon aria-hidden='true' className='h-4.5 w-4.5' />
					</span>
					<Pill className='ml-auto' isShining={isActiveStep}>
						{tCommon('step', { number: 3 })}
					</Pill>
				</span>
				<CardTitle as='h2' className={tabbed?.title} title={t('exportField.title')} />
				<div className='flex flex-1 flex-col gap-2.5'>
					<div className='flex flex-wrap items-center gap-2'>
						<button
							className='gap-1.5 whitespace-nowrap rounded-full
						shadow-card px-2.5 py-1.5 font-medium text-fg-dim transition-[background-color] duration-200 hover:bg-(--color-surface-hover) disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent flex items-center'
							disabled={!hasValue}
							onClick={handleDownload}
							type='button'
						>
							<MonitorDownIcon className='w-3.5 h-3.5 mt-0.5' />
							<span className='font-aeonik text-sm'>{t('exportField.downloadFile')}</span>
						</button>
						<p className='max-w-full truncate text-[11px] text-(--color-fg-dim)'>
							{hasValue ? fileName : '...'}
						</p>
					</div>
					<FieldDivider label={t('exportField.orCopy')} />
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
							idleLabel={tCommon('copy')}
							onCopied={() => showToast(t('clipboard.copied'))}
							onCopyFailed={() => showToast(t('clipboard.unavailable'))}
							text={value}
						/>
					</div>
					{belowOutput}
					<p className='flex items-start gap-2 font-aeonik text-sm tracking-wide text-fg-dim/65'>
						<ShieldAlertIcon aria-hidden='true' className='mt-1.5 h-3 w-3 shrink-0' />
						<span>{t('exportField.backupWarning')}</span>
					</p>
					{/* Pinned to the bottom so it lines up with the import column's button. */}
					<div className='mt-auto'>
						<SaveDataButton onClick={onAction} title={actionLabel} />
					</div>
				</div>
			</div>
		</section>
	);
};
