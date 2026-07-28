import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

/**
 * The server-side PostHog client, or `null` when no token is configured — a
 * client built on `undefined` would queue events and fail on flush, so callers
 * skip analytics instead.
 */
export function getPostHogClient(): PostHog | null {
	const token = process.env.NEXT_PUBLIC_POSTHOG_TOKEN;

	if (!token) {
		return null;
	}

	if (!posthogClient) {
		posthogClient = new PostHog(token, {
			host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
			flushAt: 1,
			flushInterval: 0
		});
	}

	return posthogClient;
}
