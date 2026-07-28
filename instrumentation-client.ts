import posthog from 'posthog-js';

const posthogToken = process.env.NEXT_PUBLIC_POSTHOG_TOKEN;

// Guarded because this module runs on every page load: without a token,
// `posthog.init(undefined)` would still boot the SDK and then fail on every
// request it tries to make. Unconfigured means no analytics, quietly.
if (posthogToken) {
	posthog.init(posthogToken, {
		api_host: '/ingest',
		ui_host: 'https://us.posthog.com',
		defaults: '2026-01-30',
		capture_exceptions: true,
		debug: process.env.NODE_ENV === 'development',
		disable_session_recording: process.env.NODE_ENV === 'development',
		session_recording: {
			maskAllInputs: false
		}
	});
}
