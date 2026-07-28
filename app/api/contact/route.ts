import { checkRateLimit } from '@vercel/firewall';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getPostHogClient } from '@/lib/posthog-server';

const resend = new Resend(process.env.RESEND_API_KEY);

const MAX_MESSAGE_LENGTH = 5000;

type ContactPayload = {
	name?: string;
	message?: string;
	website?: string; // honeypot
};

function sanitize(input: string) {
	return input.replace(/\s+/g, ' ').trim();
}

/**
 * Analytics must never decide the outcome of a request that already sent an
 * email, so the capture and its flush are isolated from the response path.
 */
async function captureSubmission(properties: { has_name: boolean; message_length: number }) {
	try {
		const posthog = getPostHogClient();

		if (!posthog) {
			return;
		}

		posthog.capture({ distinctId: 'anonymous', event: 'feedback_submitted', properties });
		await posthog.shutdown();
	} catch (error) {
		console.error('Failed to record feedback analytics', error);
	}
}

export async function POST(request: Request) {
	// Set once the email is out the door: nothing after this point may report
	// failure for a message the user has actually had delivered.
	let emailSent = false;

	try {
		const { rateLimited } = await checkRateLimit('contact-form', { request });
		if (rateLimited) {
			return NextResponse.json(
				{ error: 'Too many requests. Please wait before trying again.' },
				{ status: 429 }
			);
		}

		if (!process.env.RESEND_API_KEY || !process.env.EMAIL_TO) {
			return NextResponse.json({ error: 'Email service is not configured on the server.' }, { status: 500 });
		}

		let payload: ContactPayload;

		// The only genuine "invalid request payload" case: a body that is not JSON.
		try {
			payload = (await request.json()) as ContactPayload;
		} catch {
			return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
		}

		if (!payload || typeof payload !== 'object') {
			return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
		}

		// Honeypot: real users never fill this field; bots do
		if (payload.website) {
			return NextResponse.json({ ok: true }); // silent fake success
		}

		const name = sanitize(typeof payload.name === 'string' ? payload.name : '');
		const message = (typeof payload.message === 'string' ? payload.message : '').trim();
		const senderName = name || 'Anonymous';

		if (!message) {
			return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
		}

		if (message.length > MAX_MESSAGE_LENGTH) {
			return NextResponse.json(
				{
					error: `Message is too long. Please keep it under ${MAX_MESSAGE_LENGTH.toLocaleString('en-US')} characters.`
				},
				{ status: 400 }
			);
		}

		const from = process.env.EMAIL_FROM || 'onboarding@resend.dev';

		let sendResult: Awaited<ReturnType<typeof resend.emails.send>>;

		try {
			sendResult = await resend.emails.send({
				from,
				to: process.env.EMAIL_TO,
				subject: `[Feedback] ${senderName}`,
				text: `Clicker Heroes tools feedback from: ${senderName}\n\n${message}`
			});
		} catch (sendError) {
			// The SDK throws rather than returning an error for transport failures.
			console.error('Feedback email request failed', sendError);
			return NextResponse.json(
				{ error: 'Unable to send message right now. Please try again later.' },
				{ status: 502 }
			);
		}

		const { error } = sendResult;

		if (error) {
			const providerStatus =
				typeof error.statusCode === 'number' && error.statusCode >= 400 ? error.statusCode : 502;

			if (providerStatus === 403 && /testing emails to your own email address/i.test(error.message)) {
				return NextResponse.json(
					{
						error:
							'Resend is in testing mode. Set EMAIL_TO to your Resend account email, or verify a domain and set EMAIL_FROM to that domain before sending to other recipients.'
					},
					{ status: 403 }
				);
			}

			return NextResponse.json(
				{ error: error.message || 'Unable to send message right now.' },
				{ status: providerStatus }
			);
		}

		emailSent = true;

		await captureSubmission({ has_name: Boolean(name), message_length: message.length });

		return NextResponse.json({ ok: true });
	} catch (error) {
		if (emailSent) {
			// The email is already delivered; whatever failed afterwards is ours to
			// log, not the user's to retry.
			console.error('Feedback request failed after the email was sent', error);
			return NextResponse.json({ ok: true });
		}

		console.error('Feedback request failed', error);
		return NextResponse.json({ error: 'Something went wrong. Please try again later.' }, { status: 500 });
	}
}
