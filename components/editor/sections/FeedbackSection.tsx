'use client';

import { MessageCircleMoreIcon, type LucideIcon } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';
import { CollapsiblePanel } from '@/components/ui/CollapsiblePanel';
import { TextInput } from '@/components/ui/TextInput';
import { useToast } from '@/components/ui/ToastProvider';

/** Decides the subject line the server puts on the email. */
export type FeedbackTopic = 'feedback' | 'guide-request' | 'tool-request';

type Props = {
	defaultOpen?: boolean;
	icon?: LucideIcon;
	title?: string;
	description?: string;
	/** Routes the message to the right subject line. Defaults to general feedback. */
	topic?: FeedbackTopic;
	messageLabel?: string;
	messagePlaceholder?: string;
	submitLabel?: string;
	emptyMessageError?: string;
	successMessage?: string;
};

/** Deliberately loose: the server and the mail provider are the real arbiters. */
const isLikelyEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const FeedbackSection = ({
	defaultOpen,
	description,
	emptyMessageError,
	icon,
	messageLabel,
	messagePlaceholder,
	submitLabel,
	successMessage,
	title,
	topic = 'feedback'
}: Props) => {
	const { showToast } = useToast();
	const locale = useLocale();
	const t = useTranslations('editor.feedback');
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const [website, setWebsite] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const trimmedMessage = message.trim();
	const trimmedEmail = email.trim();

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!trimmedMessage) {
			showToast(emptyMessageError ?? t('emptyMessage'));
			return;
		}

		if (trimmedEmail && !isLikelyEmail(trimmedEmail)) {
			showToast(t('invalidEmail'));
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: trimmedEmail,
					message: trimmedMessage,
					name,
					topic,
					website
				})
			});

			const payload = (await response.json().catch(() => null)) as {
				error?: string;
				ok?: boolean;
			} | null;

			if (!response.ok) {
				// The API's error text is English, so other locales get the translated
				// equivalent; only rate limiting has its own message.
				showToast(
					response.status === 429
						? t('tooManyRequests')
						: locale === 'en'
							? (payload?.error ?? t('sendFailed'))
							: t('sendFailed')
				);
				return;
			}

			setName('');
			setEmail('');
			setMessage('');
			setWebsite('');
			showToast(successMessage ?? t('success'));
		} catch {
			showToast(t('sendFailed'));
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<CollapsiblePanel
			defaultOpen={defaultOpen}
			description={description ?? t('description')}
			icon={MessageCircleMoreIcon}
			title={title ?? t('title')}
		>
			<form className='flex flex-col gap-3' onSubmit={handleSubmit}>
				<input
					aria-hidden='true'
					autoComplete='off'
					className='pointer-events-none absolute h-px w-px overflow-hidden opacity-0'
					onChange={(event) => setWebsite(event.target.value)}
					tabIndex={-1}
					type='text'
					value={website}
				/>
				<TextInput
					ariaLabel={t('nameAria')}
					className='max-w-70'
					disabled={isSubmitting}
					onValueChange={setName}
					placeholder={t('namePlaceholder')}
					value={name}
				/>
				<TextInput
					ariaLabel={t('emailAria')}
					className='max-w-70'
					disabled={isSubmitting}
					onValueChange={setEmail}
					placeholder={t('emailPlaceholder')}
					type='email'
					value={email}
				/>
				<TextInput
					ariaLabel={messageLabel ?? t('messageLabel')}
					className='min-h-28'
					disabled={isSubmitting}
					multiline
					onValueChange={setMessage}
					placeholder={messagePlaceholder ?? t('messagePlaceholder')}
					resizable
					rows={5}
					value={message}
				/>
				<div className='flex justify-start'>
					<Button disabled={isSubmitting || !trimmedMessage} type='submit' variant='primary'>
						{isSubmitting ? t('sending') : (submitLabel ?? t('submit'))}
					</Button>
				</div>
			</form>
		</CollapsiblePanel>
	);
};
