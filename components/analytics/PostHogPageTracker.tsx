'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';

import { seoPages, type SeoPageKey } from '@/lib/seo';

type PageDetails = {
	key: SeoPageKey | 'unknown';
	title: string;
	category: 'home' | 'tool' | 'feedback' | 'page';
};

const pageDetailsByPath = Object.entries(seoPages).reduce<Record<string, PageDetails>>(
	(result, [key, page]) => {
		result[page.path] = {
			key: key as SeoPageKey,
			title: page.metaTitle,
			category:
				page.path === '/'
					? 'home'
					: page.path.startsWith('/tools/')
						? 'tool'
						: page.path === '/feedback'
							? 'feedback'
							: 'page'
		};

		return result;
	},
	{}
);

const getPageDetails = (pathname: string): PageDetails =>
	pageDetailsByPath[pathname] ?? {
		key: 'unknown',
		title: pathname,
		category: 'page'
	};

export const PostHogPageTracker = () => {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const lastTrackedPathRef = useRef<string | null>(null);

	useEffect(() => {
		const query = searchParams.toString();
		const currentPath = query ? `${pathname}?${query}` : pathname;

		if (lastTrackedPathRef.current === currentPath) {
			return;
		}

		lastTrackedPathRef.current = currentPath;

		const pageDetails = getPageDetails(pathname);

		posthog.capture('page_viewed', {
			page_key: pageDetails.key,
			page_title: pageDetails.title,
			page_category: pageDetails.category,
			pathname,
			search: query,
			url: window.location.href
		});
	}, [pathname, searchParams]);

	return null;
};
