'use client';

import { MessageCircleMoreIcon, type LucideIcon } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';

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

const defaultDescription = 'Send your suggestions and improvements to make the save editor better!';

/** Deliberately loose: the server and the mail provider are the real arbiters. */
const isLikelyEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const FeedbackSection = ({
	defaultOpen,
	description = defaultDescription,
	emptyMessageError = 'Enter a message before sending feedback.',
	icon,
	messageLabel = 'Your feedback message',
	messagePlaceholder = 'Write your feedback here...',
	submitLabel = 'Submit',
	successMessage = 'Feedback sent.',
	title = 'Feedback',
	topic = 'feedback'
}: Props) => {
	const { showToast } = useToast();
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
			showToast(emptyMessageError);
			return;
		}

		if (trimmedEmail && !isLikelyEmail(trimmedEmail)) {
			showToast('Enter a valid email address, or leave it blank.');
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
				showToast(payload?.error ?? 'Unable to send feedback right now.');
				return;
			}

			setName('');
			setEmail('');
			setMessage('');
			setWebsite('');
			showToast(successMessage);
		} catch {
			showToast('Unable to send feedback right now.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<CollapsiblePanel
			defaultOpen={defaultOpen}
			description={description}
			icon={MessageCircleMoreIcon}
			title={title}
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
					ariaLabel='Your name'
					className='max-w-70'
					disabled={isSubmitting}
					onValueChange={setName}
					placeholder='Name (optional)'
					value={name}
				/>
				<TextInput
					ariaLabel='Your email address'
					className='max-w-70'
					disabled={isSubmitting}
					onValueChange={setEmail}
					placeholder='Email (optional)'
					type='email'
					value={email}
				/>
				<TextInput
					ariaLabel={messageLabel}
					className='min-h-28'
					disabled={isSubmitting}
					multiline
					onValueChange={setMessage}
					placeholder={messagePlaceholder}
					resizable
					rows={5}
					value={message}
				/>
				<div className='flex justify-start'>
					<Button disabled={isSubmitting || !trimmedMessage} type='submit' variant='primary'>
						{isSubmitting ? 'Sending...' : submitLabel}
					</Button>
				</div>
			</form>
		</CollapsiblePanel>
	);
};
