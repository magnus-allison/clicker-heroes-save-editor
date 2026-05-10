'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { SectionCard } from '@/components/ui/SectionCard';
import { TextInput } from '@/components/ui/TextInput';
import { useToast } from '@/components/ui/ToastProvider';

type Props = {
	defaultOpen?: boolean;
};

export const FeedbackSection = ({ defaultOpen }: Props) => {
	const { showToast } = useToast();
	const [name, setName] = useState('');
	const [message, setMessage] = useState('');
	const [website, setWebsite] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const trimmedMessage = message.trim();

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!trimmedMessage) {
			showToast('Enter a message before sending feedback.');
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
					message: trimmedMessage,
					name,
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
			setMessage('');
			setWebsite('');
			showToast('Feedback sent.');
		} catch {
			showToast('Unable to send feedback right now.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<SectionCard
			defaultOpen={defaultOpen}
			description='Send your suggestions / improvements'
			title='Feedback'
		>
			<form className='space-y-3' onSubmit={handleSubmit}>
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
					disabled={isSubmitting}
					onValueChange={setName}
					placeholder='Name (optional)'
					value={name}
				/>
				<TextInput
					ariaLabel='Your feedback message'
					className='min-h-28'
					disabled={isSubmitting}
					multiline
					onValueChange={setMessage}
					placeholder='Message'
					rows={5}
					value={message}
				/>
				<div className='flex justify-start'>
					<Button disabled={isSubmitting || !trimmedMessage} type='submit' variant='primary'>
						{isSubmitting ? 'Sending...' : 'Submit'}
					</Button>
				</div>
			</form>
		</SectionCard>
	);
};
