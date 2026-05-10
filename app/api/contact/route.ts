import { checkRateLimit } from '@vercel/firewall';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

type ContactPayload = {
	name?: string;
	message?: string;
	website?: string; // honeypot
};

function sanitize(input: string) {
	return input.replace(/\s+/g, ' ').trim();
}

export async function POST(request: Request) {
	try {
		const { rateLimited } = await checkRateLimit('contact-form', { request });
		if (rateLimited) {
			return NextResponse.json(
				{ error: 'Too many requests. Please wait before trying again.' },
				{ status: 429 }
			);
		}

		if (!process.env.RESEND_API_KEY || !process.env.EMAIL_TO) {
			return NextResponse.json(
				{ error: 'Email service is not configured on the server.' },
				{ status: 500 }
			);
		}

		const payload = (await request.json()) as ContactPayload;

		// Honeypot: real users never fill this field; bots do
		if (payload.website) {
			return NextResponse.json({ ok: true }); // silent fake success
		}

		const name = sanitize(payload.name ?? '');
		const message = (payload.message ?? '').trim();
		const senderName = name || 'Anonymous';

		if (!message) {
			return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
		}

		const from = process.env.EMAIL_FROM || 'onboarding@resend.dev';

		const { error } = await resend.emails.send({
			from,
			to: process.env.EMAIL_TO,
			subject: `[Feedback] ${senderName}`,
			text: `Clicker Heroes Save Editor feedback from: ${senderName}\n\n${message}`
		});

		if (error) {
			const providerStatus =
				typeof error.statusCode === 'number' && error.statusCode >= 400 ? error.statusCode : 502;

			if (providerStatus === 403 && /testing emails to your own email address/i.test(error.message)) {
				return NextResponse.json(
					{
						error: 'Resend is in testing mode. Set EMAIL_TO to your Resend account email, or verify a domain and set EMAIL_FROM to that domain before sending to other recipients.'
					},
					{ status: 403 }
				);
			}

			return NextResponse.json(
				{ error: error.message || 'Unable to send message right now.' },
				{ status: providerStatus }
			);
		}

		return NextResponse.json({ ok: true });
	} catch {
		return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
	}
}
